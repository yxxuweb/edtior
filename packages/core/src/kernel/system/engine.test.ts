import { describe, it, expect, beforeEach } from 'vitest';
import { Engine } from './engine';

describe('Engine System', () => {
    beforeEach(() => {
        // Reset singleton between tests
        Engine.resetInstance();
    });

    it('should be a singleton via getInstance', () => {
        const engine1 = Engine.getInstance();
        const engine2 = Engine.getInstance();
        expect(engine1).toBe(engine2);
    });

    it('should support direct construction', () => {
        const engine = new Engine();
        expect(engine).toBeInstanceOf(Engine);
        expect(engine.currentDocument).toBeNull();
    });

    it('should initialize with no document', () => {
        const engine = new Engine();
        expect(engine.currentDocument).toBeNull();
    });

    it('should load a document', () => {
        const engine = new Engine();
        const schema = {
            id: 'root',
            componentName: 'Page',
            props: {},
            children: []
        };
        engine.load(schema);
        expect(engine.currentDocument).not.toBeNull();
        expect(engine.currentDocument?.root.id).toBe('root');
    });

    it('should have renderer as null when no renderClass configured', () => {
        const engine = new Engine();
        expect(engine.renderer).toBeNull();
    });

    it('should throw when render() called without renderClass', () => {
        const engine = new Engine();
        engine.load({ id: 'root', componentName: 'Page', props: {} });
        expect(() => engine.render({} as any)).toThrow('no renderClass configured');
    });

    it('should throw when render() called without document', () => {
        const engine = new Engine({
            renderClass: {
                renderComponent() { },
                updateComponent() { },
                destroyComponent() { },
                registerComponent() { },
                getComponent() { return undefined; },
            }
        });
        expect(() => engine.render({} as any)).toThrow('no document loaded');
    });

    it('should have all sub-module instances', () => {
        const engine = new Engine();
        expect(engine.events).toBeDefined();
        expect(engine.material).toBeDefined();
        expect(engine.selection).toBeDefined();
        expect(engine.history).toBeDefined();
        expect(engine.plugins).toBeDefined();
        expect(engine.skeleton).toBeDefined();
    });
});
