import { describe, it, expect, beforeEach } from 'vitest';
import { Node, Document, NodeSchema } from './index';

describe('Node and Document Model', () => {
    let schema: NodeSchema;
    let document: Document;

    beforeEach(() => {
        schema = {
            id: 'root',
            componentName: 'Page',
            props: { title: 'Test' },
            children: [
                { id: 'child-1', componentName: 'Button' },
                { id: 'child-2', componentName: 'Input' }
            ]
        };
        document = new Document(schema);
    });

    it('should initialize correctly and lookup O(1)', () => {
        expect(document.root.id).toBe('root');

        const child1 = document.getNode('child-1');
        expect(child1).toBeTruthy();
        expect(child1?.parent).toBe(document.root);
        expect(child1?.index).toBe(0);

        const child2 = document.getNode('child-2');
        expect(child2?.index).toBe(1);
    });

    it('should insert Before', () => {
        const root = document.root;
        const refNode = document.getNode('child-2')!;
        const newNode = new Node({ id: 'child-new', componentName: 'Text' });

        root.insertBefore(newNode, refNode);

        expect(root.children.length).toBe(3);
        expect(root.children[1].id).toBe('child-new');
        expect(document.getNode('child-new')).toBeTruthy();
        expect(newNode.parent).toBe(root);
        expect(newNode.document).toBe(document);
    });

    it('should detach and empty node registry on remove', () => {
        const child = document.getNode('child-1')!;
        child.remove();

        expect(document.root.children.length).toBe(1);
        expect(child.parent).toBeNull();
        expect(document.getNode('child-1')).toBeNull();
    });

    it('should produce nested schema correctly', () => {
        const child1 = document.getNode('child-1')!;
        child1.setProp('disabled', true);
        child1.appendChild(new Node({ id: 'deep-child', componentName: 'Icon' }));

        const exported = document.exportSchema();
        expect(exported.id).toBe('root');
        expect(exported.children?.length).toBe(2);
        expect(exported.children![0].props?.disabled).toBe(true);
        expect(exported.children![0].children![0].id).toBe('deep-child');
    });
});
