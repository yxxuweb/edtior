import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoggerFactory } from './factory';
import { LogLevel } from './types';

describe('Logger System', () => {
    beforeEach(() => {
        // Reset configuration or mock console if needed
        vi.restoreAllMocks();
    });

    it('should return the same logger instance for the same namespace', () => {
        const logger1 = LoggerFactory.getLogger('TestNamespace');
        const logger2 = LoggerFactory.getLogger('TestNamespace');
        expect(logger1).toBe(logger2);
    });

    it('should return different logger instances for different namespaces', () => {
        const logger1 = LoggerFactory.getLogger('NamespaceA');
        const logger2 = LoggerFactory.getLogger('NamespaceB');
        expect(logger1).not.toBe(logger2);
    });

    it('should use the default log level (INFO)', () => {
        const logger = LoggerFactory.getLogger('DefaultLevelTest');
        const consoleSpy = vi.spyOn(console, 'info');

        logger.debug('Debug message'); // Should be ignored
        logger.info('Info message');   // Should be logged

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]'), 'Info message');
    });

    it('should respect custom log level', () => {
        const logger = LoggerFactory.getLogger('CustomLevelTest');
        logger.setLevel(LogLevel.ERROR);

        const infoSpy = vi.spyOn(console, 'info');
        const errorSpy = vi.spyOn(console, 'error');

        logger.info('Info message');
        logger.error('Error message');

        expect(infoSpy).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
    });
});
