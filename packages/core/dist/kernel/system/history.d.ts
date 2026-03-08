import { Transaction, TransactionManager } from './transaction';
import { EventBus } from './event-bus';

export declare class History {
    private past;
    private future;
    private manager;
    private eventBus;
    constructor(manager: TransactionManager, eventBus: EventBus);
    push(transaction: Transaction): void;
    undo(): void;
    redo(): void;
    clear(): void;
}
