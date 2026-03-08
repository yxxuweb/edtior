import { Patch } from 'immer';

declare class Document_2 {
    root: Node_2;
    private nodeMap;
    emitter?: DocumentEventEmitter;
    constructor(schema: NodeSchema, emitter?: DocumentEventEmitter);
    getNode(id: string): Node_2 | null;
    /**
     * Internal method called by Node.insertChild / constructor.
     * Recursively registers a node and its tree into the map.
     */
    registerNode(node: Node_2): void;
    /**
     * Internal method called by Node.remove.
     * Recursively unregisters a node and its tree from the map.
     */
    unregisterNode(node: Node_2): void;
    exportSchema(): NodeSchema;
}
export { Document_2 as Document }

export declare interface DocumentEventEmitter {
    emitNodeChange(node: any, key: string, value: any, oldValue: any, patches: Patch[], inversePatches: Patch[]): void;
    emitNodeAdd(node: any, parent: any, index: number): void;
    emitNodeRemove(node: any, parent: any, index: number): void;
}

declare class Node_2 {
    readonly id: string;
    readonly componentName: string;
    private _props;
    private _children;
    document: Document_2 | null;
    parent: Node_2 | null;
    constructor(schema: NodeSchema, document?: Document_2);
    get props(): Record<string, any>;
    get children(): Node_2[];
    get index(): number;
    setProp(key: string, value: any): void;
    appendChild(node: Node_2): void;
    insertChild(node: Node_2, index: number): void;
    insertBefore(node: Node_2, referenceNode: Node_2): void;
    remove(): void;
    exportSchema(): NodeSchema;
}
export { Node_2 as Node }

export declare interface NodeSchema {
    id: string;
    componentName: string;
    props?: Record<string, any>;
    children?: NodeSchema[];
}

declare class Selection_2 {
    private emitter;
    private _selected;
    constructor(emitter: SelectionEventEmitter);
    get selected(): Node_2[];
    get first(): Node_2 | undefined;
    select(node: Node_2): void;
    add(node: Node_2): void;
    remove(node: Node_2): void;
    clear(): void;
    private emitChange;
}
export { Selection_2 as Selection }

/**
 * Event emitter interface for Selection to notify changes.
 * Uses dependency inversion — Selection doesn't depend on Engine directly.
 */
export declare interface SelectionEventEmitter {
    emitSelectionChange(selected: string[]): void;
}

export { }
