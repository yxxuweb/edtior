import { LogAdapter, LogLevel } from '../types';

export class ConsoleAdapter implements LogAdapter {
    log(level: LogLevel, namespace: string, message: string, ...args: any[]): void {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${LogLevel[level]}] [${namespace}]`;

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(prefix, message, ...args);
                break;
            case LogLevel.INFO:
                console.info(prefix, message, ...args);
                break;
            case LogLevel.WARN:
                console.warn(prefix, message, ...args);
                break;
            case LogLevel.ERROR:
                console.error(prefix, message, ...args);
                break;
        }
    }
}
