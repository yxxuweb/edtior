import { Patch } from 'immer';

/**
 * Compute resolved props from raw node props.
 *
 * Currently a simplified pass-through implementation.
 * Future: resolve JSExpression, JSFunction, and other dynamic value types.
 */
export declare function computeProps(props: Record<string, any>): Record<string, any>;

declare class Document_2 {
    root: Node_2;
    // O(1) Lookup Map
    private nodeMap = new Map<string, Node_2>();
    // Optional emitter to connect to Engine EventBus
    emitter?: DocumentEventEmitter;

    constructor(schema: NodeSchema, emitter?: DocumentEventEmitter) {
        this.emitter = emitter;
        // Instantiating the root will recursively instantiate and link all children
        this.root = new Node(schema, this);
        logger.info('Document initialized with root:', this.root.id);

        // Recursively register all initial nodes
        this.registerNode(this.root);
    }

    getNode(id: string): Node_2 | null {
        return this.nodeMap.get(id) || null;
    }

    /** 
     * Internal method called by Node.insertChild / constructor.
     * Recursively registers a node and its tree into the map.
     */
    registerNode(node: Node_2) {
        this.nodeMap.set(node.id, node);
        node.document = this;
        for (const child of node.children) {
            this.registerNode(child);
        }
    }

    /**
     * Internal method called by Node.remove.
     * Recursively unregisters a node and its tree from the map.
     */
    unregisterNode(node: Node_2) {
        for (const child of node.children) {
            this.unregisterNode(child);
        }
        this.nodeMap.delete(node.id);
        node.document = null;
    }

    exportSchema(): NodeSchema {
        return this.root.exportSchema();
    }
}

declare interface DocumentEventEmitter {
    emitNodeChange(node: any, key: string, value: any, oldValue: any, patches: Patch[], inversePatches: Patch[]): void;
    emitNodeAdd(node: any, parent: any, index: number): void;
    emitNodeRemove(node: any, parent: any, index: number): void;
}

/**
 * Framework Render Class interface.
 * Each UI framework adapter (React, Vue, Angular) implements this interface
 * to tell the universal renderer how to mount/update/destroy a single component.
 */
export declare interface FrameworkRenderClass {
    /**
     * Mount a single component into the given DOM container.
     * Called by the universal renderer during recursive traversal.
     */
    renderComponent(options: RenderComponentOptions): void;
    /**
     * Update an already-mounted component's props.
     */
    updateComponent(nodeId: string, props: Record<string, any>): void;
    /**
     * Destroy a mounted component and clean up resources.
     */
    destroyComponent(nodeId: string): void;
    /**
     * Register a business component implementation.
     * The component must match the framework of this render class.
     */
    registerComponent(name: string, component: any): void;
    /**
     * Get a registered component by name.
     */
    getComponent(name: string): any | undefined;
}

declare class Node_2 {
    readonly id: string;
    readonly componentName: string;
    private _props: Record<string, any>;
    private _children: Node_2[];

    // Internal pointers
    document: Document_2 | null = null;
    parent: Node_2 | null = null;

    constructor(schema: NodeSchema, document?: Document_2) {
        this.id = schema.id;
        this.componentName = schema.componentName;
        this._props = schema.props || {};
        this.document = document || null;

        this._children = (schema.children || []).map(childSchema => {
            const childNode = new Node(childSchema, document);
            childNode.parent = this;
            return childNode;
        });

        logger.debug(`Node created: ${this.id}`);
    }

    get props() {
        return this._props;
    }

    get children() {
        return this._children;
    }

    get index(): number {
        if (!this.parent) return -1;
        return this.parent.children.indexOf(this);
    }

    setProp(key: string, value: any) {
        const oldValue = this._props[key];
        if (oldValue === value) return; // Exact match, no change

        logger.debug(`setProp: ${this.id}.${key} = ${value}`);
        this._props = produce(this._props, (draft) => {
            draft[key] = value;
        });

        // Emit change if document has an emitter
        if (this.document && this.document.emitter) {
            this.document.emitter.emitNodeChange(this, key, value, oldValue);
        }
    }

    appendChild(node: Node_2) {
        this.insertChild(node, this._children.length);
    }

    insertChild(node: Node_2, index: number) {
        // If node already has a parent, remove it first
        if (node.parent) {
            node.remove();
        }

        node.parent = this;
        node.document = this.document;
        this._children.splice(index, 0, node);

        if (this.document) {
            this.document.registerNode(node);
            if (this.document.emitter) {
                this.document.emitter.emitNodeAdd(node, this, index);
            }
        }
    }

    insertBefore(node: Node_2, referenceNode: Node_2) {
        const index = this._children.indexOf(referenceNode);
        if (index === -1) {
            throw new Error(`Reference node ${referenceNode.id} is not a child of ${this.id}`);
        }
        this.insertChild(node, index);
    }

    remove() {
        if (!this.parent) return; // Cannot remove root or detached node

        const index = this.parent._children.indexOf(this);
        if (index > -1) {
            this.parent._children.splice(index, 1);

            if (this.document) {
                if (this.document.emitter) {
                    this.document.emitter.emitNodeRemove(this, this.parent, index);
                }
                this.document.unregisterNode(this);
            }

            this.parent = null;
        }
    }

    exportSchema(): NodeSchema {
        const schema: NodeSchema = {
            id: this.id,
            componentName: this.componentName,
        };

        if (Object.keys(this._props).length > 0) {
            schema.props = { ...this._props };
        }

        if (this._children.length > 0) {
            schema.children = this._children.map(child => child.exportSchema());
        }

        return schema;
    }
}

declare interface NodeSchema {
    id: string;
    componentName: string;
    props?: Record<string, any>;
    children?: NodeSchema[];
}

/**
 * Options passed to FrameworkRenderClass.renderComponent()
 */
export declare interface RenderComponentOptions {
    /** Component name from the node schema */
    componentName: string;
    /** Resolved props (after expression evaluation) */
    props: Record<string, any>;
    /** DOM container to mount the component into */
    container: HTMLElement;
    /** The node instance being rendered */
    node: Node_2;
    /** Current rendering mode */
    mode: 'edit' | 'runtime';
}

/**
 * Universal Renderer — framework-agnostic recursive rendering engine.
 *
 * Responsibilities:
 * - Recursively traverse the Node Tree
 * - Compute props (resolve expressions)
 * - Create DOM containers for each node
 * - Delegate component mounting to the FrameworkRenderClass
 * - Manage container references for updates/cleanup
 */
export declare class Renderer {
    private renderClass;
    private mode;
    private containers;
    private rootContainer;
    constructor(renderClass: FrameworkRenderClass, mode?: 'edit' | 'runtime');
    /**
     * Render a node tree into the given root container.
     */
    render(rootNode: Node_2, rootContainer: HTMLElement): void;
    /**
     * Recursively render a single node and its children.
     * Creates a DOM container, delegates component mounting to the
     * framework render class, then recurses into children.
     */
    renderNode(node: Node_2): HTMLElement;
    /**
     * Update a specific node's rendered component with new props.
     */
    updateNode(nodeId: string, props: Record<string, any>): void;
    /**
     * Get the DOM container for a specific node.
     */
    getContainer(nodeId: string): HTMLElement | undefined;
    /**
     * Destroy the renderer and clean up all resources.
     */
    destroy(): void;
}

export { }
