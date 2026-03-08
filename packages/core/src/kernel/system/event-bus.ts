import mitt, { Emitter } from 'mitt';
import { Node } from '@lowcode/model';
import { Patch } from 'immer';
import { LoggerFactory } from '@lowcode/utils-logger';
import { Transaction } from './transaction';

const logger = LoggerFactory.getLogger('EventBus');

export type Events = {
    'engine:init': void;
    'engine:ready': void;
    'node:add': { node: Node; parent: Node | null; index?: number };
    'node:remove': { node: Node; parent: Node | null; index?: number };
    'node:change': { node: Node; key: string; value: any; oldValue: any; patches?: Patch[]; inversePatches?: Patch[] };
    'node:change:system': { node: Node; props: any };
    'selection:change': { selected: string[] };
    'transaction:commit': { transaction: Transaction };
    'transaction:rollback': { transaction: Transaction };
    'history:undo': { transaction: Transaction };
    'history:redo': { transaction: Transaction };
    'history:change': { undoLength: number; redoLength: number };
};

export class EventBus {
    private emitter: Emitter<Events>;

    constructor() {
        // @ts-ignore
        this.emitter = mitt<Events>();
        logger.debug('EventBus initialized');
    }

    on<K extends keyof Events>(type: K, handler: (event: Events[K]) => void) {
        this.emitter.on(type, handler);
    }

    off<K extends keyof Events>(type: K, handler: (event: Events[K]) => void) {
        this.emitter.off(type, handler);
    }

    emit<K extends keyof Events>(type: K, event: Events[K]) {
        logger.debug(`[Event] ${type}`, event);
        this.emitter.emit(type, event);
    }
}
