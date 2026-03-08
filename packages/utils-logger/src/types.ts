export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    OFF = 4
}

export interface LogAdapter {
    log(level: LogLevel, namespace: string, message: string, ...args: any[]): void;
}

export interface LogConfig {
    level: LogLevel;
    adapters: LogAdapter[];
}

export interface ILogger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    setLevel(level: LogLevel): void;
}
