import { Logger } from './logger';
import { ConsoleAdapter } from './adapters/console';
import { LogLevel, LogConfig } from './types';

const SYMBOL_REGISTRY = Symbol.for('@lowcode/utils-logger/registry');

interface LoggerRegistry {
    loggers: Map<string, Logger>;
    config: LogConfig;
}

export class LoggerFactory {
    private static get registry(): LoggerRegistry {
        const globalContext = (typeof window !== 'undefined' ? window : global) as any;
        if (!globalContext[SYMBOL_REGISTRY]) {
            globalContext[SYMBOL_REGISTRY] = {
                loggers: new Map<string, Logger>(),
                config: {
                    level: LogLevel.INFO,
                    adapters: [new ConsoleAdapter()]
                }
            };
        }
        return globalContext[SYMBOL_REGISTRY];
    }

    static configure(config: Partial<LogConfig>) {
        const registry = this.registry;
        if (config.level !== undefined) registry.config.level = config.level;
        if (config.adapters !== undefined) registry.config.adapters = config.adapters;
    }

    static getLogger(namespace: string): Logger {
        const registry = this.registry;
        if (!registry.loggers.has(namespace)) {
            // Create a *copy* of the global config so individual loggers can receive overrides if needed in future
            // For now, they share the reference or we pass current values.
            // Better to pass a reference to global config OR local config.
            // Based on design, we want independent level control but default to global.
            // Simplified: Logger holds a reference to a config object that inherits defaults?
            // Or just pass current global config values.
            // Let's pass the global config object reference for now, but strictly speaking
            // the design said "support independent control".
            // Let's make Logger take a config object that defaults to global values but can be overridden.
            // Re-reading design: "Logger.configure({ rootLevel: ... })".
            // Let's keep it simple: Logger uses the global config by default but we can add a method to override specific logger.
            // For now, just pass the global config *values* into a new object to allow independence?
            // No, if I change global "rootLevel", I want all loggers to update?
            // Usually: Global default, override specific.
            // Let's implement: Logger checks its own config, if not set, check global.
            // To simplify, let's just pass a new config object initialized with global defaults.
            registry.loggers.set(namespace, new Logger(namespace, { ...registry.config }));
        }
        return registry.loggers.get(namespace)!;
    }
}
