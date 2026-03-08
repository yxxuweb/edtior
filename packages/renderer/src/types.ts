import { Node } from '@lowcode/model';

/**
 * Options passed to FrameworkRenderClass.renderComponent()
 */
export interface RenderComponentOptions {
    /** Component name from the node schema */
    componentName: string;
    /** Resolved props (after expression evaluation) */
    props: Record<string, any>;
    /** DOM container to mount the component into */
    container: HTMLElement;
    /** The node instance being rendered */
    node: Node;
    /** Current rendering mode */
    mode: 'edit' | 'runtime';
}

/**
 * Framework Render Class interface.
 * Each UI framework adapter (React, Vue, Angular) implements this interface
 * to tell the universal renderer how to mount/update/destroy a single component.
 */
export interface FrameworkRenderClass {
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
