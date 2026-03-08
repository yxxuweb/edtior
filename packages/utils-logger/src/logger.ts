import { ILogger, LogLevel, LogConfig } from './types';

export class Logger implements ILogger {
    private namespace: string;
    private config: LogConfig;

    constructor(namespace: string, config: LogConfig) {
        this.namespace = namespace;
        this.config = config;
    }

    setLevel(level: LogLevel) {
        this.config.level = level;
    }

    private log(level: LogLevel, message: string, ...args: any[]) {
        if (level < this.config.level) return;

        for (const adapter of this.config.adapters) {
            adapter.log(level, this.namespace, message, ...args);
        }
    }

    debug(message: string, ...args: any[]) {
        this.log(LogLevel.DEBUG, message, ...args);
    }

    info(message: string, ...args: any[]) {
        this.log(LogLevel.INFO, message, ...args);
    }

    warn(message: string, ...args: any[]) {
        this.log(LogLevel.WARN, message, ...args);
    }

    error(message: string, ...args: any[]) {
        this.log(LogLevel.ERROR, message, ...args);
    }
}
