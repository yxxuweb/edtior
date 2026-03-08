import React, { useContext, useState } from 'react';
import { Node } from '@lowcode/model';
import { EngineContext } from './renderer-component';
import { useSelection } from './hooks';

export interface NodeWrapperProps {
    node: Node;
    children: React.ReactNode;
}

/**
 * NodeWrapper handles edit-mode specific behavior for a component.
 */
export const NodeWrapper: React.FC<NodeWrapperProps> = ({ node, children }) => {
    const engine = useContext(EngineContext);
    const selectedIds = useSelection(engine);
    const [isHovered, setIsHovered] = useState(false);

    const isSelected = selectedIds.includes(node.id);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent parent nodes from also selecting
        e.preventDefault();  // Prevent default link/button actions in edit mode
        if (engine) {
            engine.selection.select(node);
        }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    let borderStyle = '1px dashed transparent';
    if (isSelected) {
        borderStyle = '2px solid #1890ff';
    } else if (isHovered) {
        borderStyle = '1px dashed #1890ff';
    }

    return (
        <div
            className={`lowcode-node-wrapper ${isSelected ? 'selected' : ''}`}
            data-node-id={node.id}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                outline: borderStyle,
                outlineOffset: '-1px', // Keep outline inside bounds
                transition: 'outline 0.2s',
                cursor: 'pointer'
            }}
        >
            {/* Optional: Add a small label overlay when hovered/selected */}
            {(isHovered || isSelected) && (
                <div style={{
                    position: 'absolute',
                    top: -20,
                    left: -1,
                    background: '#1890ff',
                    color: 'white',
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '2px 2px 0 0',
                    zIndex: 10,
                    pointerEvents: 'none'
                }}>
                    {node.componentName}
                </div>
            )}

            {/* Wrap children to prevent their pointer events if needed, 
                but typically outline and capture on the wrapper is enough for MVP */}
            <div style={{ pointerEvents: 'none', height: '100%' }}>
                {children}
            </div>
        </div>
    );
};
