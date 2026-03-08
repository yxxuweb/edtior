import { LoggerFactory } from '@lowcode/utils-logger';
import { produceWithPatches, enablePatches, Patch } from 'immer';
import { Document } from './document';

enablePatches();

const logger = LoggerFactory.getLogger('Node');

export interface NodeSchema {
    id: string;
    componentName: string;
    props?: Record<string, any>;
    children?: NodeSchema[];
}

export class Node {
    readonly id: string;
    readonly componentName: string;
    private _props: Record<string, any>;
    private _children: Node[];

    // Internal pointers
    document: Document | null = null;
    parent: Node | null = null;

    constructor(schema: NodeSchema, document?: Document) {
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
        const [nextState, patches, inversePatches] = produceWithPatches(this._props, (draft: any) => {
            draft[key] = value;
        });

        this._props = nextState;

        // Emit change if document has an emitter
        if (this.document && this.document.emitter) {
            this.document.emitter.emitNodeChange(this, key, value, oldValue, patches, inversePatches);
        }
    }

    appendChild(node: Node) {
        this.insertChild(node, this._children.length);
    }

    insertChild(node: Node, index: number) {
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

    insertBefore(node: Node, referenceNode: Node) {
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
