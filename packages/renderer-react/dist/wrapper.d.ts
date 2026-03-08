import { default as React } from 'react';
import { Node } from '../../model/src/index.ts';

export interface NodeWrapperProps {
    node: Node;
    children: React.ReactNode;
}
/**
 * NodeWrapper handles edit-mode specific behavior for a component.
 */
export declare const NodeWrapper: React.FC<NodeWrapperProps>;
