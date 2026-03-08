import { Plugin, PluginContext } from './types';
import { LoggerFactory } from '@lowcode/utils-logger';

const logger = LoggerFactory.getLogger('PluginManager');

/**
 * Factory for creating PluginContext instances.
 * Injected by the host (core Engine) to avoid direct dependency.
 */
export type PluginContextFactory = (pluginName: string) => PluginContext;

export class PluginManager {
    private plugins = new Map<string, Plugin>();
    private contextFactory: PluginContextFactory;

    constructor(contextFactory: PluginContextFactory) {
        this.contextFactory = contextFactory;
    }

    async use(plugin: Plugin) {
        if (this.plugins.has(plugin.name)) {
            logger.warn(`Plugin ${plugin.name} already registered.`);
            return;
        }

        logger.info(`Loading plugin: ${plugin.name}`);
        const ctx = this.contextFactory(plugin.name);

        try {
            await plugin.init(ctx);
            this.plugins.set(plugin.name, plugin);
            logger.info(`Plugin ${plugin.name} loaded.`);
        } catch (e) {
            logger.error(`Failed to load plugin ${plugin.name}`, e);
        }
    }

    get(name: string) {
        return this.plugins.get(name);
    }
}
