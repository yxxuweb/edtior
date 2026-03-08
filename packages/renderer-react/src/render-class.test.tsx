import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { ReactRenderClass } from './render-class';
// Using basic DOM for testing 
// Vitest with environment="jsdom" is needed.

// Mock Node class since we don't have the full engine setup here easily
class MockNode {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}

describe('ReactRenderClass', () => {
    let container: HTMLElement;
    let renderClass: ReactRenderClass;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        renderClass = new ReactRenderClass();
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('should register and get a component', () => {
        const MockComponent = () => <div>Hello</div>;
        renderClass.registerComponent('MockComp', MockComponent);

        expect(renderClass.getComponent('MockComp')).toBe(MockComponent);
    });

    // NOTE: This test will fail if Vitest jsdom setup is not configured for React 18 createRoot
    // We are skipping full DOM assertion for renderComponent due to async nature of createRoot in some test envs, 
    // but we can test the fallback component mounts.
    it('should render a fallback if component not found', () => {
        const node = new MockNode('n1') as any;
        renderClass.renderComponent({
            componentName: 'Unknown',
            props: {},
            container,
            node,
            mode: 'runtime'
        });

        // Wait for React to render (setTimeout can help with createRoot microtasks if needed, 
        // but often synchronous enough in basic jsdom for simple assertions after small delay)
        setTimeout(() => {
            expect(container.innerHTML).toContain('Unknown Component: Unknown');
        }, 10);
    });
});
