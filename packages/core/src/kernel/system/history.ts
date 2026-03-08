import { LoggerFactory } from '@lowcode/utils-logger';
import { Transaction, TransactionManager } from './transaction';
import { EventBus } from './event-bus';

const logger = LoggerFactory.getLogger('History');

export class History {
    private past: Transaction[] = [];
    private future: Transaction[] = [];
    private manager: TransactionManager;
    private eventBus: EventBus;

    constructor(manager: TransactionManager, eventBus: EventBus) {
        this.manager = manager;
        this.eventBus = eventBus;

        // Auto record committed transactions
        this.eventBus.on('transaction:commit', ({ transaction }) => {
            this.push(transaction);
        });
    }

    push(transaction: Transaction) {
        this.past.push(transaction);
        this.future = []; // Clear future on new action
        logger.debug(`Transaction pushed to history: ${transaction.name}`);
        this.eventBus.emit('history:change', { undoLength: this.past.length, redoLength: this.future.length });
    }

    undo() {
        if (this.past.length === 0) return;
        const transaction = this.past.pop()!;

        logger.debug(`Undo executing: ${transaction.name}`);
        this.manager.applyInverse(transaction);

        this.future.push(transaction);
        this.eventBus.emit('history:undo', { transaction });
        this.eventBus.emit('history:change', { undoLength: this.past.length, redoLength: this.future.length });
    }

    redo() {
        if (this.future.length === 0) return;
        const transaction = this.future.pop()!;

        logger.debug(`Redo executing: ${transaction.name}`);
        this.manager.applyForward(transaction);

        this.past.push(transaction);
        this.eventBus.emit('history:redo', { transaction });
        this.eventBus.emit('history:change', { undoLength: this.past.length, redoLength: this.future.length });
    }

    clear() {
        this.past = [];
        this.future = [];
        this.eventBus.emit('history:change', { undoLength: 0, redoLength: 0 });
    }
}
