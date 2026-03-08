import { Patch, applyPatches } from 'immer';
import { EventBus } from './event-bus';
import { Document } from '@lowcode/model';
import { LoggerFactory } from '@lowcode/utils-logger';

const logger = LoggerFactory.getLogger('Transaction');

export interface Operation {
    nodeId: string;
    type: 'change' | 'add' | 'remove';
    patches?: Patch[];
    inversePatches?: Patch[];
    // For structural changes (add/remove) we might record full node schema or parent indices 
    // instead of patches if we don't use immer for the children array purely. 
    // In Phase 3 MVP, let's just focus on prop changes via immer.
    payload?: any;
}

export class Transaction {
    readonly id: string;
    readonly name: string;
    readonly timestamp: number;
    ops: Operation[] = [];

    constructor(name: string) {
        this.id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        this.name = name;
        this.timestamp = Date.now();
    }

    addOp(op: Operation) {
        this.ops.push(op);
    }
}

export class TransactionManager {
    private currentTransaction: Transaction | null = null;
    private eventBus: EventBus;
    private getDocument: () => Document | null;

    constructor(eventBus: EventBus, getDocument: () => Document | null) {
        this.eventBus = eventBus;
        this.getDocument = getDocument;

        // Listen to node changes to record operations
        this.eventBus.on('node:change', this.handleNodeChange.bind(this));
    }

    get current() {
        return this.currentTransaction;
    }

    start(name: string = 'Auto Transaction'): Transaction {
        if (this.currentTransaction) {
            logger.warn(`Transaction already active: ${this.currentTransaction.name}. Proceeding within existing transaction.`);
            return this.currentTransaction;
        }

        this.currentTransaction = new Transaction(name);
        return this.currentTransaction;
    }

    commit() {
        if (!this.currentTransaction) return;

        const tx = this.currentTransaction;
        this.currentTransaction = null;

        if (tx.ops.length > 0) {
            this.eventBus.emit('transaction:commit', { transaction: tx });
        }
    }

    rollback() {
        if (!this.currentTransaction) return;

        const tx = this.currentTransaction;
        this.currentTransaction = null;

        if (tx.ops.length > 0) {
            this.applyInverse(tx);
            this.eventBus.emit('transaction:rollback', { transaction: tx });
        }
    }

    private handleNodeChange(event: any) {
        const { node, patches, inversePatches } = event;

        // If no active transaction, instantly wrap in auto-transaction
        const isAuto = !this.currentTransaction;
        if (isAuto) {
            this.start('Auto Prop Change');
        }

        this.currentTransaction!.addOp({
            nodeId: node.id,
            type: 'change',
            patches,
            inversePatches
        });

        if (isAuto) {
            this.commit();
        }
    }

    // Abstract method to apply inverse operations for rollback or undo
    applyInverse(transaction: Transaction) {
        const doc = this.getDocument();
        if (!doc) return;

        // Apply in reverse order
        for (let i = transaction.ops.length - 1; i >= 0; i--) {
            const op = transaction.ops[i];
            if (op.type === 'change' && op.inversePatches) {
                const node = doc.getNode(op.nodeId);
                // Note: since Node state is encapsulated, we technically need a backdoor 
                // to apply patches. For MVP, we'll assume applyPatches works on the internal _props.
                if (node) {
                    // @ts-ignore - access private _props for patch application
                    const currentProps = node._props;
                    const nextProps = applyPatches(currentProps, op.inversePatches);
                    // @ts-ignore
                    node._props = nextProps;

                    // Manually emit the change so UI updates, but avoid creating a new transaction loop!
                    // We must pause listening or add a flag. 
                    this.eventBus.emit('node:change:system', { node, props: nextProps });
                }
            }
        }

        this.eventBus.emit('engine:ready', undefined); // trigger UI re-render
    }

    applyForward(transaction: Transaction) {
        const doc = this.getDocument();
        if (!doc) return;

        for (const op of transaction.ops) {
            if (op.type === 'change' && op.patches) {
                const node = doc.getNode(op.nodeId);
                if (node) {
                    // @ts-ignore
                    const currentProps = node._props;
                    const nextProps = applyPatches(currentProps, op.patches);
                    // @ts-ignore
                    node._props = nextProps;

                    this.eventBus.emit('node:change:system', { node, props: nextProps });
                }
            }
        }

        this.eventBus.emit('engine:ready', undefined); // trigger UI re-render
    }
}
