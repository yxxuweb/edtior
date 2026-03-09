/**
 * Raw tree node data provided by the consumer.
 */
export interface TreeNodeData {
  /** Unique identifier for this node */
  id: string | number;
  /** Display label */
  label: string;
  /** Pre-loaded children (may be partial if pagination is used) */
  children?: TreeNodeData[];
  /** If true, this node cannot be expanded (has no children) */
  isLeaf?: boolean;
  /** If true, more children can be loaded via `loadChildren` */
  hasMore?: boolean;
  /** Total children count (optional, for UI hints like "showing 50 of 200") */
  totalChildren?: number;
}

/**
 * A flattened representation of a tree node for rendering in a flat list.
 */
export interface FlatNode {
  /** A unique key for this row (node id or synthetic key for load-more rows) */
  key: string;
  /** Reference to the original tree node data (null for load-more rows) */
  node: TreeNodeData | null;
  /** Nesting depth (0 = root) */
  level: number;
  /** Whether this node is currently expanded */
  expanded: boolean;
  /** The parent node's id, or null for root-level */
  parentId: string | number | null;
  /** If true, this is a virtual "Load More" row */
  isLoadMore: boolean;
  /** Whether this node has children (or could load children) */
  hasChildren: boolean;
  /** Whether this node is a leaf */
  isLeaf: boolean;
}

/**
 * Props for the VirtualTree component.
 */
export interface VirtualTreeProps {
  /** The tree data to display */
  data: TreeNodeData[];
  /** Height of each row in pixels (default: 32) */
  itemHeight?: number;
  /** Viewport height in pixels (default: 500) */
  height?: number;
  /** Indentation per level in pixels (default: 20) */
  indent?: number;
  /** Set of node IDs that should be expanded by default */
  defaultExpandedKeys?: Set<string | number>;
  /**
   * Async callback to load (more) children for a node.
   * Called when:
   *   1. A non-leaf node with no children is expanded for the first time
   *   2. The user clicks "Load More" on a node
   *
   * Should return the next batch of children and whether more remain.
   */
  loadChildren?: (node: TreeNodeData) => Promise<{
    children: TreeNodeData[];
    hasMore: boolean;
  }>;
  /**
   * Async callback to load more root-level nodes.
   * Called when the user scrolls to the bottom of the root list.
   * Should append new nodes to `data` and update `hasMoreRoot`.
   */
  loadRoot?: () => Promise<void>;
  /** If true, more root-level nodes can be loaded via `loadRoot` */
  hasMoreRoot?: boolean;
  /** Set of node IDs that are currently selected */
  selectedKeys?: Set<string | number>;
  /** Selection mode: 'single' for single selection, 'multiple' for multiple selection */
  selectionMode?: "single" | "multiple";
  /** Whether non-leaf (folder) nodes can be selected (default: true) */
  folderSelectable?: boolean;
}

/**
 * Emits for the VirtualTree component.
 */
export interface VirtualTreeEmits {
  (e: "expand", node: TreeNodeData): void;
  (e: "collapse", node: TreeNodeData): void;
  (e: "node-click", node: TreeNodeData): void;
  (e: "select", node: TreeNodeData, selectedKeys: Set<string | number>): void;
  (e: "update:selectedKeys", selectedKeys: Set<string | number>): void;
}
