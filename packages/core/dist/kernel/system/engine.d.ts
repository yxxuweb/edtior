import { Document, NodeSchema, Selection } from '../../../../model/src/index.ts';
import { MaterialRegistry } from '../../../../material/src/index.ts';
import { PluginManager } from '../../../../plugin/src/index.ts';
import { Renderer, FrameworkRenderClass } from '../../../../renderer/src/index.ts';
import { EventBus } from './event-bus';
import { History } from './history';
import { Skeleton } from './skeleton';
import { TransactionManager } from './transaction';

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
export declare class Engine {
    private static instance;
    currentDocument: Document | null;
    readonly events: EventBus;
    readonly material: MaterialRegistry;
    readonly selection: Selection;
    readonly history: History;
    readonly transaction: TransactionManager;
    readonly plugins: PluginManager;
    readonly skeleton: Skeleton;
    readonly renderer: Renderer | null;
    constructor(config?: EngineConfig);
    /**
     * Backward-compatible singleton access.
     * For new code, prefer `new Engine(config)`.
     */
    static getInstance(config?: EngineConfig): Engine;
    /**
     * Reset the singleton instance (primarily for testing).
     */
    static resetInstance(): void;
    /**
     * Load a document from schema.
     */
    load(schema: NodeSchema): void;
    /**
     * Render the current document into a DOM container.
     * Requires a renderClass to be configured.
     */
    render(container: HTMLElement): void;
}
