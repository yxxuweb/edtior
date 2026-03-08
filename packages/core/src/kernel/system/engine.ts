import { Document, Node, NodeSchema, Selection, SelectionEventEmitter } from '@lowcode/model';
import { MaterialRegistry } from '@lowcode/material';
import { PluginManager, PluginContextFactory } from '@lowcode/plugin';
import { Renderer, FrameworkRenderClass } from '@lowcode/renderer';
import { LoggerFactory } from '@lowcode/utils-logger';
import { Patch } from 'immer';
import { EventBus } from './event-bus';
import { History } from './history';
import { Skeleton } from './skeleton';
import { TransactionManager } from './transaction';

const logger = LoggerFactory.getLogger('Engine');

export interface EngineConfig {
    /** Framework render class for component mounting */
    renderClass?: FrameworkRenderClass;
    /** Rendering mode */
    mode?: 'edit' | 'runtime';
}

/**
 * Engine — the "brain" of the low-code editor.
 * Coordinates all sub-modules: model, plugin, material, renderer.
 * Users only need to import from @lowcode/core.
 */
export class Engine {
    private static instance: Engine | null = null;

    currentDocument: Document | null = null;
    readonly events: EventBus;
    readonly material: MaterialRegistry;
    readonly selection: Selection;
    readonly history: History;
    readonly transaction: TransactionManager;
    readonly plugins: PluginManager;
    readonly skeleton: Skeleton;
    readonly renderer: Renderer | null;

    constructor(config: EngineConfig = {}) {
        this.events = new EventBus();
        this.material = new MaterialRegistry();
        this.skeleton = new Skeleton();

        this.transaction = new TransactionManager(this.events, () => this.currentDocument);
        this.history = new History(this.transaction, this.events);

        // Wire Selection with event emission via dependency inversion
        const selectionEmitter: SelectionEventEmitter = {
            emitSelectionChange: (selected: string[]) => {
                this.events.emit('selection:change', { selected });
            }
        };
        this.selection = new Selection(selectionEmitter);

        // Wire PluginManager with context factory
        const contextFactory: PluginContextFactory = (pluginName: string) => ({
            engine: this,
            events: this.events,
            skeleton: this.skeleton,
            logger: LoggerFactory.getLogger(pluginName),
        });
        this.plugins = new PluginManager(contextFactory);

        // Create renderer if renderClass provided
        this.renderer = config.renderClass
            ? new Renderer(config.renderClass, config.mode || 'edit')
            : null;

        // @ts-ignore
        logger.info('Engine instance created');
        this.events.emit('engine:init', undefined);
    }

    /**
     * Backward-compatible singleton access.
     * For new code, prefer `new Engine(config)`.
     */
    static getInstance(config?: EngineConfig): Engine {
        if (!Engine.instance) {
            Engine.instance = new Engine(config);
        }
        return Engine.instance;
    }

    /**
     * Reset the singleton instance (primarily for testing).
     */
    static resetInstance(): void {
        Engine.instance = null;
    }

    /**
     * Load a document from schema.
     */
    load(schema: NodeSchema) {
        logger.info('Loading schema...');

        // Connect Document changes to Engine EventBus
        const documentEmitter = {
            emitNodeChange: (node: Node, key: string, value: any, oldValue: any, patches: Patch[], inversePatches: Patch[]) => {
                this.events.emit('node:change', { node, key, value, oldValue, patches, inversePatches });
            },
            emitNodeAdd: (node: Node, parent: Node, index: number) => {
                this.events.emit('node:add', { node, parent, index });
            },
            emitNodeRemove: (node: Node, parent: Node, index: number) => {
                this.events.emit('node:remove', { node, parent, index });
            }
        };

        this.currentDocument = new Document(schema, documentEmitter);
        this.events.emit('engine:ready', undefined);
    }

    /**
     * Render the current document into a DOM container.
     * Requires a renderClass to be configured.
     */
    render(container: HTMLElement): void {
        if (!this.renderer) {
            throw new Error('Cannot render: no renderClass configured. Pass renderClass in Engine config.');
        }
        if (!this.currentDocument) {
            throw new Error('Cannot render: no document loaded. Call engine.load(schema) first.');
        }
        // @ts-ignore - TS nominal typing issues with private properties across monorepo package boundaries
        this.renderer.render(this.currentDocument.root, container);
    }
}
