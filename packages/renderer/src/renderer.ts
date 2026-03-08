import { Node } from '@lowcode/model';
import { FrameworkRenderClass } from './types';
import { computeProps } from './props';
import { LoggerFactory } from '@lowcode/utils-logger';

const logger = LoggerFactory.getLogger('Renderer');

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
export class Renderer {
    private renderClass: FrameworkRenderClass;
    private mode: 'edit' | 'runtime';
    private containers = new Map<string, HTMLElement>();
    private rootContainer: HTMLElement | null = null;

    constructor(renderClass: FrameworkRenderClass, mode: 'edit' | 'runtime' = 'edit') {
        this.renderClass = renderClass;
        this.mode = mode;
        logger.info(`Renderer created in ${mode} mode`);
    }

    /**
     * Render a node tree into the given root container.
     */
    render(rootNode: Node, rootContainer: HTMLElement): void {
        logger.info('Starting render from root node:', rootNode.id);
        this.rootContainer = rootContainer;

        // Clear previous render
        rootContainer.innerHTML = '';
        this.containers.clear();

        const tree = this.renderNode(rootNode);
        rootContainer.appendChild(tree);

        logger.info('Render complete');
    }

    /**
     * Recursively render a single node and its children.
     * Creates a DOM container, delegates component mounting to the
     * framework render class, then recurses into children.
     */
    renderNode(node: Node): HTMLElement {
        // 1. Compute resolved props
        const resolvedProps = computeProps(node.props);

        // 2. Create DOM container for this node
        const container = document.createElement('div');
        container.setAttribute('data-node-id', node.id);
        this.containers.set(node.id, container);

        // 3. Delegate to framework render class
        this.renderClass.renderComponent({
            componentName: node.componentName,
            props: resolvedProps,
            container,
            node,
            mode: this.mode,
        });

        // 4. Recursively render children
        for (const child of node.children) {
            const childEl = this.renderNode(child);
            container.appendChild(childEl);
        }

        return container;
    }

    /**
     * Update a specific node's rendered component with new props.
     */
    updateNode(nodeId: string, props: Record<string, any>): void {
        const resolvedProps = computeProps(props);
        this.renderClass.updateComponent(nodeId, resolvedProps);
    }

    /**
     * Get the DOM container for a specific node.
     */
    getContainer(nodeId: string): HTMLElement | undefined {
        return this.containers.get(nodeId);
    }

    /**
     * Destroy the renderer and clean up all resources.
     */
    destroy(): void {
        logger.info('Destroying renderer');

        for (const [nodeId] of this.containers) {
            this.renderClass.destroyComponent(nodeId);
        }

        this.containers.clear();

        if (this.rootContainer) {
            this.rootContainer.innerHTML = '';
            this.rootContainer = null;
        }

        logger.info('Renderer destroyed');
    }
}
