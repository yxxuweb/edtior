import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FrameworkRenderClass, RenderComponentOptions } from '@lowcode/renderer';
import { NodeWrapper } from './wrapper';

export class ReactRenderClass implements FrameworkRenderClass {
    private registry = new Map<string, React.ComponentType<any>>();
    private roots = new Map<string, Root>();

    /**
     * Register a React component corresponding to a componentName in the schema
     */
    registerComponent(name: string, component: React.ComponentType<any>): void {
        this.registry.set(name, component);
    }

    getComponent(name: string): React.ComponentType<any> | undefined {
        return this.registry.get(name);
    }

    renderComponent({ componentName, props, container, node, mode }: RenderComponentOptions): void {
        const Comp = this.getComponent(componentName);

        if (!Comp) {
            console.warn(`[ReactRenderClass] Component not found: ${componentName}`);
            // Provide a fallback UI if a component is missing
            this.mountElement(
                <div style={{ color: 'red', border: '1px solid red', padding: '4px' }}>
                    Unknown Component: {componentName}
                </div>,
                container,
                node.id
            );
            return;
        }

        let element = <Comp {...props} />;

        if (mode === 'edit') {
            element = <NodeWrapper node={node}>{element}</NodeWrapper>;
        }

        this.mountElement(element, container, node.id);
    }

    updateComponent(nodeId: string, props: Record<string, any>): void {
        const root = this.roots.get(nodeId);
        if (root) {
            // Note: In an ideal scenario, the components would reactively update based on a state store.
            // Since our architecture calls updateComponent explicitly, we need a way to trigger re-render
            // with new props. Re-calling render on the root is one way to achieve this React 18+.
            // However, this requires preserving the Component class, which we don't have here.
            // For now, we expect updateComponent to be handled at a higher macro level or we'd need
            // to store { componentName, mode, container } alongside the Root to re-render.

            // TODO: Implement precise update. 
            // Currently, full re-render from the Universal Renderer is likely the fallback path.
            console.warn(`[ReactRenderClass] updateComponent not fully implemented yet for node ${nodeId}`);
        }
    }

    destroyComponent(nodeId: string): void {
        const root = this.roots.get(nodeId);
        if (root) {
            root.unmount();
            this.roots.delete(nodeId);
        }
    }

    private mountElement(element: React.ReactElement, container: HTMLElement, nodeId: string) {
        // Create root if it doesn't exist, else use existing to re-render
        let root = this.roots.get(nodeId);
        if (!root) {
            root = createRoot(container);
            this.roots.set(nodeId, root);
        }
        root.render(element);
    }
}
