/**
 * Plugin context interface — provided by the core Engine to plugins.
 * Uses abstract interfaces to avoid depending on concrete Engine/EventBus/Skeleton types.
 */
export interface PluginContext {
    /** The engine instance */
    engine: any;
    /** Event bus for subscribing/emitting events */
    events: any;
    /** UI skeleton for registering panels */
    skeleton: any;
    /** Scoped logger */
    logger: any;
}

export interface Plugin {
    name: string;
    init(ctx: PluginContext): void | Promise<void>;
    destroy(ctx: PluginContext): void;
    exports?: any;
}

export interface PluginConfig {
    name: string;
    options?: any;
}
