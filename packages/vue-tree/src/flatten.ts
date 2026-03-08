import type { TreeNodeData, FlatNode } from './types';

/**
 * Flatten a tree into a list of FlatNode entries suitable for virtual-scrolling.
 *
 * - Only descends into expanded nodes (O(visible) complexity).
 * - Injects a synthetic "Load More" row after the last child of any node
 *   whose `hasMore` flag is true.
 *
 * @param nodes      The root-level tree nodes
 * @param expandedKeys  Set of node IDs that are currently expanded
 * @returns          A flat array of rows to render
 */
export function flattenTree(
    nodes: TreeNodeData[],
    expandedKeys: Set<string | number>,
    hasMoreRoot: boolean = false
): FlatNode[] {
    const result: FlatNode[] = [];

    function walk(
        list: TreeNodeData[],
        level: number,
        parentId: string | number | null
    ): void {
        for (const node of list) {
            const isExpanded = expandedKeys.has(node.id);
            const isLeaf = node.isLeaf === true;
            const hasChildren =
                !isLeaf &&
                ((node.children && node.children.length > 0) ||
                    node.hasMore === true ||
                    node.isLeaf === undefined);

            result.push({
                key: String(node.id),
                node,
                level,
                expanded: isExpanded,
                parentId,
                isLoadMore: false,
                hasChildren,
                isLeaf
            });

            if (isExpanded && !isLeaf) {
                // Render children if they exist
                if (node.children && node.children.length > 0) {
                    walk(node.children, level + 1, node.id);
                }

                // Append a "Load More" virtual row if more children are available
                if (node.hasMore) {
                    result.push({
                        key: `__load_more_${node.id}`,
                        node,
                        level: level + 1,
                        expanded: false,
                        parentId: node.id,
                        isLoadMore: true,
                        hasChildren: false,
                        isLeaf: false
                    });
                }
            }
        }
    }

    walk(nodes, 0, null);

    // Append a root-level "Load More" sentinel if more root nodes are available
    if (hasMoreRoot) {
        result.push({
            key: '__load_more_root',
            node: null,
            level: 0,
            expanded: false,
            parentId: null,
            isLoadMore: true,
            hasChildren: false,
            isLeaf: false
        });
    }

    return result;
}
