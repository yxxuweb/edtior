import { default as React } from 'react';
import { FrameworkRenderClass, RenderComponentOptions } from '../../renderer/src/index.ts';

export declare class ReactRenderClass implements FrameworkRenderClass {
    private registry;
    private roots;
    /**
     * Register a React component corresponding to a componentName in the schema
     */
    registerComponent(name: string, component: React.ComponentType<any>): void;
    getComponent(name: string): React.ComponentType<any> | undefined;
    renderComponent({ componentName, props, container, node, mode }: RenderComponentOptions): void;
    updateComponent(nodeId: string, props: Record<string, any>): void;
    destroyComponent(nodeId: string): void;
    private mountElement;
}
