import { Node } from '../../../../model/src/index.ts';
import { Patch } from 'immer';
import { Transaction } from './transaction';

export type Events = {
    'engine:init': void;
    'engine:ready': void;
    'node:add': {
        node: Node;
        parent: Node | null;
        index?: number;
    };
    'node:remove': {
        node: Node;
        parent: Node | null;
        index?: number;
    };
    'node:change': {
        node: Node;
        key: string;
        value: any;
        oldValue: any;
        patches?: Patch[];
        inversePatches?: Patch[];
    };
    'node:change:system': {
        node: Node;
        props: any;
    };
    'selection:change': {
        selected: string[];
    };
    'transaction:commit': {
        transaction: Transaction;
    };
    'transaction:rollback': {
        transaction: Transaction;
    };
    'history:undo': {
        transaction: Transaction;
    };
    'history:redo': {
        transaction: Transaction;
    };
    'history:change': {
        undoLength: number;
        redoLength: number;
    };
};
export declare class EventBus {
    private emitter;
    constructor();
    on<K extends keyof Events>(type: K, handler: (event: Events[K]) => void): void;
    off<K extends keyof Events>(type: K, handler: (event: Events[K]) => void): void;
    emit<K extends keyof Events>(type: K, event: Events[K]): void;
}
