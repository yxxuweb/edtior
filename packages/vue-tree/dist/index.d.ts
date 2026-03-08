import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { PropType } from 'vue';
import { PublicProps } from 'vue';
import { Reactive } from 'vue';
import { Ref } from 'vue';

/**
 * A flattened representation of a tree node for rendering in a flat list.
 */
export declare interface FlatNode {
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
export declare function flattenTree(nodes: TreeNodeData[], expandedKeys: Set<string | number>, hasMoreRoot?: boolean): FlatNode[];

/**
 * Raw tree node data provided by the consumer.
 */
export declare interface TreeNodeData {
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

export declare const TreeNodeRow: DefineComponent<ExtractPropTypes<    {
flatNode: {
type: PropType<FlatNode>;
required: true;
};
indent: {
type: NumberConstructor;
default: number;
};
loading: {
type: BooleanConstructor;
default: boolean;
};
nodeLoading: {
type: BooleanConstructor;
default: boolean;
};
selected: {
type: BooleanConstructor;
default: boolean;
};
}>, {
onToggle: () => void;
onLabelClick: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("node-click" | "select" | "toggle")[], "node-click" | "select" | "toggle", PublicProps, Readonly<ExtractPropTypes<    {
flatNode: {
type: PropType<FlatNode>;
required: true;
};
indent: {
type: NumberConstructor;
default: number;
};
loading: {
type: BooleanConstructor;
default: boolean;
};
nodeLoading: {
type: BooleanConstructor;
default: boolean;
};
selected: {
type: BooleanConstructor;
default: boolean;
};
}>> & Readonly<{
"onNode-click"?: ((...args: any[]) => any) | undefined;
onSelect?: ((...args: any[]) => any) | undefined;
onToggle?: ((...args: any[]) => any) | undefined;
}>, {
indent: number;
loading: boolean;
nodeLoading: boolean;
selected: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

export declare const VirtualTree: DefineComponent<ExtractPropTypes<    {
data: {
type: PropType<TreeNodeData[]>;
required: true;
};
itemHeight: {
type: NumberConstructor;
default: number;
};
height: {
type: NumberConstructor;
default: number;
};
indent: {
type: NumberConstructor;
default: number;
};
defaultExpandedKeys: {
type: PropType<Set<string | number>>;
default: () => Set<unknown>;
};
loadChildren: {
type: PropType<(node: TreeNodeData) => Promise<{
children: TreeNodeData[];
hasMore: boolean;
}>>;
default: undefined;
};
/** Async callback to load more root-level nodes */
loadRoot: {
type: PropType<() => Promise<void>>;
default: undefined;
};
/** If true, more root-level nodes can be loaded via loadRoot */
hasMoreRoot: {
type: BooleanConstructor;
default: boolean;
};
/** Number of extra items to render above/below the viewport */
overscan: {
type: NumberConstructor;
default: number;
};
/** Set of node IDs that are currently selected */
selectedKeys: {
type: PropType<Set<string | number>>;
default: () => Set<unknown>;
};
/** Selection mode: 'single' or 'multiple' */
selectionMode: {
type: PropType<"single" | "multiple">;
default: string;
};
}>, {
scrollContainer: Ref<HTMLDivElement | null, HTMLDivElement | null>;
flatList: ComputedRef<FlatNode[]>;
totalHeight: ComputedRef<number>;
visibleItems: ComputedRef<FlatNode[]>;
offsetY: ComputedRef<number>;
loadingKeys: Reactive<Set<string>>;
internalSelectedKeys: Ref<Set<string | number> & Omit<Set<string | number>, keyof Set<any>>, Set<string | number> | (Set<string | number> & Omit<Set<string | number>, keyof Set<any>>)>;
onScroll: () => void;
onToggle: (node: TreeNodeData) => Promise<void>;
onNodeClick: (node: TreeNodeData) => void;
onSelect: (node: TreeNodeData) => void;
getLoadMoreKey: (item: FlatNode) => string;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("expand" | "collapse" | "node-click" | "select" | "update:selectedKeys")[], "expand" | "collapse" | "node-click" | "select" | "update:selectedKeys", PublicProps, Readonly<ExtractPropTypes<    {
data: {
type: PropType<TreeNodeData[]>;
required: true;
};
itemHeight: {
type: NumberConstructor;
default: number;
};
height: {
type: NumberConstructor;
default: number;
};
indent: {
type: NumberConstructor;
default: number;
};
defaultExpandedKeys: {
type: PropType<Set<string | number>>;
default: () => Set<unknown>;
};
loadChildren: {
type: PropType<(node: TreeNodeData) => Promise<{
children: TreeNodeData[];
hasMore: boolean;
}>>;
default: undefined;
};
/** Async callback to load more root-level nodes */
loadRoot: {
type: PropType<() => Promise<void>>;
default: undefined;
};
/** If true, more root-level nodes can be loaded via loadRoot */
hasMoreRoot: {
type: BooleanConstructor;
default: boolean;
};
/** Number of extra items to render above/below the viewport */
overscan: {
type: NumberConstructor;
default: number;
};
/** Set of node IDs that are currently selected */
selectedKeys: {
type: PropType<Set<string | number>>;
default: () => Set<unknown>;
};
/** Selection mode: 'single' or 'multiple' */
selectionMode: {
type: PropType<"single" | "multiple">;
default: string;
};
}>> & Readonly<{
"onNode-click"?: ((...args: any[]) => any) | undefined;
onSelect?: ((...args: any[]) => any) | undefined;
onExpand?: ((...args: any[]) => any) | undefined;
onCollapse?: ((...args: any[]) => any) | undefined;
"onUpdate:selectedKeys"?: ((...args: any[]) => any) | undefined;
}>, {
indent: number;
height: number;
itemHeight: number;
defaultExpandedKeys: Set<string | number>;
loadChildren: (node: TreeNodeData) => Promise<{
children: TreeNodeData[];
hasMore: boolean;
}>;
loadRoot: () => Promise<void>;
hasMoreRoot: boolean;
overscan: number;
selectedKeys: Set<string | number>;
selectionMode: "single" | "multiple";
}, {}, {
TreeNodeRow: DefineComponent<ExtractPropTypes<    {
flatNode: {
type: PropType<FlatNode>;
required: true;
};
indent: {
type: NumberConstructor;
default: number;
};
loading: {
type: BooleanConstructor;
default: boolean;
};
nodeLoading: {
type: BooleanConstructor;
default: boolean;
};
selected: {
type: BooleanConstructor;
default: boolean;
};
}>, {
onToggle: () => void;
onLabelClick: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("node-click" | "select" | "toggle")[], "node-click" | "select" | "toggle", PublicProps, Readonly<ExtractPropTypes<    {
flatNode: {
type: PropType<FlatNode>;
required: true;
};
indent: {
type: NumberConstructor;
default: number;
};
loading: {
type: BooleanConstructor;
default: boolean;
};
nodeLoading: {
type: BooleanConstructor;
default: boolean;
};
selected: {
type: BooleanConstructor;
default: boolean;
};
}>> & Readonly<{
"onNode-click"?: ((...args: any[]) => any) | undefined;
onSelect?: ((...args: any[]) => any) | undefined;
onToggle?: ((...args: any[]) => any) | undefined;
}>, {
indent: number;
loading: boolean;
nodeLoading: boolean;
selected: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;
}, {}, string, ComponentProvideOptions, true, {}, any>;

/**
 * Emits for the VirtualTree component.
 */
export declare interface VirtualTreeEmits {
    (e: "expand", node: TreeNodeData): void;
    (e: "collapse", node: TreeNodeData): void;
    (e: "node-click", node: TreeNodeData): void;
    (e: "select", node: TreeNodeData, selectedKeys: Set<string | number>): void;
    (e: "update:selectedKeys", selectedKeys: Set<string | number>): void;
}

/**
 * Props for the VirtualTree component.
 */
export declare interface VirtualTreeProps {
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
}

export { }
