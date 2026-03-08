import { Node } from './node';
import { LoggerFactory } from '@lowcode/utils-logger';

const logger = LoggerFactory.getLogger('Selection');

/**
 * Event emitter interface for Selection to notify changes.
 * Uses dependency inversion — Selection doesn't depend on Engine directly.
 */
export interface SelectionEventEmitter {
    emitSelectionChange(selected: string[]): void;
}

export class Selection {
    private emitter: SelectionEventEmitter;
    private _selected: Node[] = [];

    constructor(emitter: SelectionEventEmitter) {
        this.emitter = emitter;
    }

    get selected(): Node[] {
        return this._selected;
    }

    get first(): Node | undefined {
        return this._selected[0];
    }

    select(node: Node) {
        if (this._selected.length === 1 && this._selected[0] === node) return;
        this._selected = [node];
        this.emitChange();
    }

    add(node: Node) {
        if (this._selected.includes(node)) return;
        this._selected.push(node);
        this.emitChange();
    }

    remove(node: Node) {
        const index = this._selected.indexOf(node);
        if (index > -1) {
            this._selected.splice(index, 1);
            this.emitChange();
        }
    }

    clear() {
        if (this._selected.length === 0) return;
        this._selected = [];
        this.emitChange();
    }

    private emitChange() {
        const ids = this._selected.map(n => n.id);
        logger.debug('Selection changed:', ids);
        this.emitter.emitSelectionChange(ids);
    }
}
