import { default as React } from 'react';
import { Engine } from '@lowcode/core';

export interface RendererProps {
    engine: Engine;
    className?: string;
    style?: React.CSSProperties;
}
export declare const EngineContext: React.Context<Engine | null>;
/**
 * React Component wrapper for the Universal Renderer.
 * Mounts the engine's renderer into a DOM node.
 */
export declare const Renderer: React.FC<RendererProps>;
