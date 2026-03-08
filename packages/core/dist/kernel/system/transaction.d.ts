import { Patch } from 'immer';
import { EventBus } from './event-bus';
import { Document } from '../../../../model/src/index.ts';

export interface Operation {
    nodeId: string;
    type: 'change' | 'add' | 'remove';
    patches?: Patch[];
    inversePatches?: Patch[];
    payload?: any;
}
export declare class Transaction {
    readonly id: string;
    readonly name: string;
    readonly timestamp: number;
    ops: Operation[];
    constructor(name: string);
    addOp(op: Operation): void;
}
export declare class TransactionManager {
    private currentTransaction;
    private eventBus;
    private getDocument;
    constructor(eventBus: EventBus, getDocument: () => Document | null);
    get current(): Transaction | null;
    start(name?: string): Transaction;
    commit(): void;
    rollback(): void;
    private handleNodeChange;
    applyInverse(transaction: Transaction): void;
    applyForward(transaction: Transaction): void;
}
