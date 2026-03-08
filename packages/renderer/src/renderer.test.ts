import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Renderer } from './renderer';
import { FrameworkRenderClass, RenderComponentOptions } from './types';
import { Node, NodeSchema } from '@lowcode/model';

// Mock FrameworkRenderClass
function createMockRenderClass(): FrameworkRenderClass {
    return {
        renderComponent: vi.fn(),
        updateComponent: vi.fn(),
        destroyComponent: vi.fn(),
        registerComponent: vi.fn(),
        getComponent: vi.fn(),
    };
}

// Helper to create a simple node
function createNode(schema: NodeSchema): Node {
    return new Node(schema);
}

describe('Renderer', () => {
    let mockRenderClass: FrameworkRenderClass;
    let renderer: Renderer;

    beforeEach(() => {
        mockRenderClass = createMockRenderClass();
        renderer = new Renderer(mockRenderClass, 'edit');
    });

    describe('renderNode', () => {
        it('should render a single node', () => {
            const node = createNode({
                id: 'btn-1',
                componentName: 'Button',
                props: { text: 'Click me' },
            });

            const container = renderer.renderNode(node);

            // Should create a div with data-node-id
            expect(container.tagName).toBe('DIV');
            expect(container.getAttribute('data-node-id')).toBe('btn-1');

            // Should call renderComponent
            expect(mockRenderClass.renderComponent).toHaveBeenCalledTimes(1);
            expect(mockRenderClass.renderComponent).toHaveBeenCalledWith(
                expect.objectContaining({
                    componentName: 'Button',
                    props: { text: 'Click me' },
                    node,
                    mode: 'edit',
                })
            );
        });

        it('should recursively render children', () => {
            const node = createNode({
                id: 'root',
                componentName: 'Page',
                props: {},
                children: [
                    { id: 'btn-1', componentName: 'Button', props: { text: 'A' } },
                    { id: 'btn-2', componentName: 'Button', props: { text: 'B' } },
                ],
            });

            const container = renderer.renderNode(node);

            // Should call renderComponent 3 times (root + 2 children)
            expect(mockRenderClass.renderComponent).toHaveBeenCalledTimes(3);

            // Verify DOM nesting
            expect(container.children.length).toBe(2);
            expect(container.children[0].getAttribute('data-node-id')).toBe('btn-1');
            expect(container.children[1].getAttribute('data-node-id')).toBe('btn-2');
        });

        it('should handle deeply nested children', () => {
            const node = createNode({
                id: 'root',
                componentName: 'Page',
                props: {},
                children: [
                    {
                        id: 'container',
                        componentName: 'Container',
                        props: {},
                        children: [
                            { id: 'text-1', componentName: 'Text', props: {} },
                        ],
                    },
                ],
            });

            const container = renderer.renderNode(node);

            // 3 nodes total
            expect(mockRenderClass.renderComponent).toHaveBeenCalledTimes(3);

            // Verify deep nesting
            const childContainer = container.children[0];
            expect(childContainer.getAttribute('data-node-id')).toBe('container');
            expect(childContainer.children[0].getAttribute('data-node-id')).toBe('text-1');
        });
    });

    describe('render', () => {
        it('should render into root container', () => {
            const rootContainer = document.createElement('div');
            const node = createNode({
                id: 'root',
                componentName: 'Page',
                props: {},
            });

            renderer.render(node, rootContainer);

            expect(rootContainer.children.length).toBe(1);
            expect(rootContainer.children[0].getAttribute('data-node-id')).toBe('root');
        });

        it('should clear previous render before re-rendering', () => {
            const rootContainer = document.createElement('div');
            rootContainer.innerHTML = '<div>old content</div>';

            const node = createNode({
                id: 'root',
                componentName: 'Page',
                props: {},
            });

            renderer.render(node, rootContainer);

            expect(rootContainer.children.length).toBe(1);
            expect(rootContainer.children[0].getAttribute('data-node-id')).toBe('root');
        });
    });

    describe('getContainer', () => {
        it('should return the container for a rendered node', () => {
            const node = createNode({
                id: 'btn-1',
                componentName: 'Button',
                props: {},
            });

            renderer.renderNode(node);

            const container = renderer.getContainer('btn-1');
            expect(container).toBeDefined();
            expect(container?.getAttribute('data-node-id')).toBe('btn-1');
        });

        it('should return undefined for non-existent node', () => {
            expect(renderer.getContainer('nonexistent')).toBeUndefined();
        });
    });

    describe('updateNode', () => {
        it('should delegate to renderClass.updateComponent', () => {
            renderer.updateNode('btn-1', { text: 'Updated' });

            expect(mockRenderClass.updateComponent).toHaveBeenCalledWith(
                'btn-1',
                { text: 'Updated' }
            );
        });
    });

    describe('destroy', () => {
        it('should destroy all rendered components', () => {
            const node = createNode({
                id: 'root',
                componentName: 'Page',
                props: {},
                children: [
                    { id: 'btn-1', componentName: 'Button', props: {} },
                ],
            });

            const rootContainer = document.createElement('div');
            renderer.render(node, rootContainer);

            renderer.destroy();

            // Should call destroyComponent for each node
            expect(mockRenderClass.destroyComponent).toHaveBeenCalledTimes(2);

            // Root container should be cleared
            expect(rootContainer.innerHTML).toBe('');
        });

        it('should clear container references', () => {
            const node = createNode({
                id: 'btn-1',
                componentName: 'Button',
                props: {},
            });

            const rootContainer = document.createElement('div');
            renderer.render(node, rootContainer);
            renderer.destroy();

            expect(renderer.getContainer('btn-1')).toBeUndefined();
        });
    });

    describe('mode', () => {
        it('should pass edit mode to renderComponent', () => {
            const editRenderer = new Renderer(mockRenderClass, 'edit');
            const node = createNode({ id: 'n1', componentName: 'A', props: {} });

            editRenderer.renderNode(node);

            expect(mockRenderClass.renderComponent).toHaveBeenCalledWith(
                expect.objectContaining({ mode: 'edit' })
            );
        });

        it('should pass runtime mode to renderComponent', () => {
            const runtimeRenderer = new Renderer(mockRenderClass, 'runtime');
            const node = createNode({ id: 'n1', componentName: 'A', props: {} });

            runtimeRenderer.renderNode(node);

            expect(mockRenderClass.renderComponent).toHaveBeenCalledWith(
                expect.objectContaining({ mode: 'runtime' })
            );
        });
    });
});
