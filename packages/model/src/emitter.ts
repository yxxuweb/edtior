import { Patch } from 'immer';

export interface DocumentEventEmitter {
    emitNodeChange(node: any, key: string, value: any, oldValue: any, patches: Patch[], inversePatches: Patch[]): void;
    emitNodeAdd(node: any, parent: any, index: number): void;
    emitNodeRemove(node: any, parent: any, index: number): void;
}
