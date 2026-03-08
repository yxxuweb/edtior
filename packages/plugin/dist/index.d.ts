declare interface Plugin_2 {
    name: string;
    init(ctx: PluginContext): void | Promise<void>;
    destroy(ctx: PluginContext): void;
    exports?: any;
}
export { Plugin_2 as Plugin }

export declare interface PluginConfig {
    name: string;
    options?: any;
}

/**
 * Plugin context interface — provided by the core Engine to plugins.
 * Uses abstract interfaces to avoid depending on concrete Engine/EventBus/Skeleton types.
 */
export declare interface PluginContext {
    /** The engine instance */
    engine: any;
    /** Event bus for subscribing/emitting events */
    events: any;
    /** UI skeleton for registering panels */
    skeleton: any;
    /** Scoped logger */
    logger: any;
}

/**
 * Factory for creating PluginContext instances.
 * Injected by the host (core Engine) to avoid direct dependency.
 */
export declare type PluginContextFactory = (pluginName: string) => PluginContext;

export declare class PluginManager {
    private plugins;
    private contextFactory;
    constructor(contextFactory: PluginContextFactory);
    use(plugin: Plugin_2): Promise<void>;
    get(name: string): Plugin_2 | undefined;
}

export { }
