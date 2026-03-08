export declare class ConsoleAdapter implements LogAdapter {
    log(level: LogLevel, namespace: string, message: string, ...args: any[]): void;
}

export declare interface ILogger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    setLevel(level: LogLevel): void;
}

export declare interface LogAdapter {
    log(level: LogLevel, namespace: string, message: string, ...args: any[]): void;
}

export declare interface LogConfig {
    level: LogLevel;
    adapters: LogAdapter[];
}

export declare class Logger implements ILogger {
    private namespace;
    private config;
    constructor(namespace: string, config: LogConfig);
    setLevel(level: LogLevel): void;
    private log;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}

export declare class LoggerFactory {
    private static get registry();
    static configure(config: Partial<LogConfig>): void;
    static getLogger(namespace: string): Logger;
}

export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    OFF = 4
}

export { }
