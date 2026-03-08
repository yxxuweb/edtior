import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Engine } from './engine';
import { NodeSchema, Node } from '@lowcode/model';

describe('History and Transaction System', () => {
    let engine: Engine;

    beforeEach(() => {
        engine = new Engine();
        const schema: NodeSchema = {
            id: 'root',
            componentName: 'Page',
            props: { title: 'Init', width: 100 },
        };
        engine.load(schema);
        engine.events.off('engine:ready', () => { }); // disable logs if needed
    });

    it('should record an automatic transaction on prop change', () => {
        const root = engine.currentDocument!.root;

        // Change #1
        root.setProp('width', 200);
        expect(root.props.width).toBe(200);

        // One transaction should be pushed
        const past = (engine.history as any).past;
        expect(past.length).toBe(1);
        expect(past[0].ops.length).toBe(1);
        expect(past[0].name).toBe('Auto Prop Change');
    });

    it('should correctly undo and redo a prop change using patches', () => {
        const root = engine.currentDocument!.root;

        root.setProp('title', 'Change A');
        expect(root.props.title).toBe('Change A');

        engine.history.undo();
        // Since we bypassed normal renderer we just check internal props
        expect(root.props.title).toBe('Init');

        engine.history.redo();
        expect(root.props.title).toBe('Change A');
    });

    it('should group multiple ops into a single explicit transaction', () => {
        const root = engine.currentDocument!.root;

        engine.transaction.start('Complex Operation');
        root.setProp('width', 500);
        root.setProp('title', 'Complex');
        engine.transaction.commit();

        const past = (engine.history as any).past;
        expect(past.length).toBe(1); // 1 transaction
        expect(past[0].ops.length).toBe(2); // 2 operations inside

        expect(root.props.width).toBe(500);
        expect(root.props.title).toBe('Complex');

        // Single undo rewinds both
        engine.history.undo();
        expect(root.props.width).toBe(100);
        expect(root.props.title).toBe('Init');
    });
});
