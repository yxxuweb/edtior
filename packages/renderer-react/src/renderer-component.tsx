import React, { useEffect, useRef, createContext } from 'react';
import { Engine } from '@lowcode/core';

export interface RendererProps {
    engine: Engine;
    className?: string;
    style?: React.CSSProperties;
}

// Engine context to make engine available to NodeWrapper and internal components
export const EngineContext = createContext<Engine | null>(null);

/**
 * React Component wrapper for the Universal Renderer.
 * Mounts the engine's renderer into a DOM node.
 */
export const Renderer: React.FC<RendererProps> = ({ engine, className, style }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && engine.currentDocument) {
            // Tell the engine to render into this container
            engine.render(containerRef.current);
        }

        const handleReady = () => {
            if (containerRef.current && engine.currentDocument) {
                engine.render(containerRef.current);
            }
        };

        engine.events.on('engine:ready', handleReady);
        return () => {
            engine.events.off('engine:ready', handleReady);
        };
    }, [engine]);

    return (
        <EngineContext.Provider value={engine}>
            <div
                ref={containerRef}
                className={className}
                style={{ width: '100%', height: '100%', ...style }}
            />
        </EngineContext.Provider>
    );
};
