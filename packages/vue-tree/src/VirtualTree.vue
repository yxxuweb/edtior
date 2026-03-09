<template>
    <div
        class="vtree-container"
        :style="{ height: height + 'px' }"
        ref="scrollContainer"
        @scroll="onScroll"
    >
        <!-- Total height spacer to produce correct scrollbar -->
        <div
            class="vtree-phantom"
            :style="{ height: totalHeight + 'px' }"
        ></div>

        <!-- Visible items, absolutely positioned -->
        <div
            class="vtree-visible-area"
            :style="{ transform: `translateY(${offsetY}px)` }"
        >
            <TreeNodeRow
                v-for="item in visibleItems"
                :key="item.key"
                :flat-node="item"
                :indent="indent"
                :loading="loadingKeys.has(getLoadMoreKey(item))"
                :node-loading="loadingKeys.has(String(item.node?.id))"
                :selected="item.node ? internalSelectedKeys.has(item.node.id) : false"
                :style="{ height: itemHeight + 'px' }"
                @toggle="onToggle"
                @node-click="onNodeClick"
                @select="onSelect"
            >
                <template #default="{ node }">
                    <slot :node="node">{{ node.label }}</slot>
                </template>
            </TreeNodeRow>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    computed,
    watch,
    nextTick,
    type PropType,
    reactive
} from 'vue';
import type { TreeNodeData, FlatNode } from './types';
import { flattenTree } from './flatten';
import TreeNodeRow from './TreeNodeRow.vue';

export default defineComponent({
    name: 'VirtualTree',
    components: { TreeNodeRow },
    props: {
        data: {
            type: Array as PropType<TreeNodeData[]>,
            required: true
        },
        itemHeight: {
            type: Number,
            default: 32
        },
        height: {
            type: Number,
            default: 500
        },
        indent: {
            type: Number,
            default: 20
        },
        defaultExpandedKeys: {
            type: Object as PropType<Set<string | number>>,
            default: () => new Set()
        },
        loadChildren: {
            type: Function as PropType<
                (node: TreeNodeData) => Promise<{
                    children: TreeNodeData[];
                    hasMore: boolean;
                }>
            >,
            default: undefined
        },
        /** Async callback to load more root-level nodes */
        loadRoot: {
            type: Function as PropType<() => Promise<void>>,
            default: undefined
        },
        /** If true, more root-level nodes can be loaded via loadRoot */
        hasMoreRoot: {
            type: Boolean,
            default: false
        },
        /** Number of extra items to render above/below the viewport */
        overscan: {
            type: Number,
            default: 5
        },
        /** Set of node IDs that are currently selected */
        selectedKeys: {
            type: Object as PropType<Set<string | number>>,
            default: () => new Set()
        },
        /** Selection mode: 'single' or 'multiple' */
        selectionMode: {
            type: String as PropType<'single' | 'multiple'>,
            default: 'single'
        },
        /** Whether non-leaf nodes can be selected */
        folderSelectable: {
            type: Boolean,
            default: true
        }
    },
    emits: ['expand', 'collapse', 'node-click', 'select', 'update:selectedKeys'],
    setup(props, { emit }) {
        // ── State ──────────────────────────────────────────────
        const expandedKeys = ref<Set<string | number>>(
            new Set(props.defaultExpandedKeys)
        );
        const internalSelectedKeys = ref<Set<string | number>>(
            new Set(props.selectedKeys)
        );
        const loadingKeys = reactive<Set<string>>(new Set());
        const scrollContainer = ref<HTMLDivElement | null>(null);
        const scrollTop = ref(0);

        // ── Flat list ──────────────────────────────────────────
        const flatList = computed<FlatNode[]>(() =>
            flattenTree(props.data, expandedKeys.value, props.hasMoreRoot)
        );

        // ── Virtual scrolling calculations ─────────────────────
        const totalHeight = computed(
            () => flatList.value.length * props.itemHeight
        );

        const startIndex = computed(() => {
            const idx = Math.floor(scrollTop.value / props.itemHeight);
            return Math.max(0, idx - props.overscan);
        });

        const endIndex = computed(() => {
            const visibleCount = Math.ceil(props.height / props.itemHeight);
            const idx =
                Math.floor(scrollTop.value / props.itemHeight) +
                visibleCount +
                props.overscan;
            return Math.min(flatList.value.length, idx);
        });

        const visibleItems = computed(() =>
            flatList.value.slice(startIndex.value, endIndex.value)
        );

        const offsetY = computed(() => startIndex.value * props.itemHeight);

        // ── Scroll handler ─────────────────────────────────────
        function onScroll() {
            if (scrollContainer.value) {
                scrollTop.value = scrollContainer.value.scrollTop;
            }
        }

        // ── Helper for load-more key ───────────────────────────
        function getLoadMoreKey(item: FlatNode): string {
            if (item.isLoadMore) {
                if (item.node) {
                    return `__load_more_${item.node.id}`;
                }
                // Root-level load-more sentinel (node is null)
                return '__load_more_root';
            }
            return '';
        }

        // ── Node finder helper (deep search) ───────────────────
        function findNode(
            nodes: TreeNodeData[],
            id: string | number
        ): TreeNodeData | null {
            for (const n of nodes) {
                if (n.id === id) return n;
                if (n.children) {
                    const found = findNode(n.children, id);
                    if (found) return found;
                }
            }
            return null;
        }

        // ── Toggle expand/collapse ─────────────────────────────
        async function onToggle(node: TreeNodeData) {
            const newSet = new Set(expandedKeys.value);
            const nodeLoadKey = String(node.id);
            const loadMoreKey = `__load_more_${node.id}`;

            if (newSet.has(node.id)) {
                // Collapse
                newSet.delete(node.id);
                expandedKeys.value = newSet;
                emit('collapse', node);
            } else {
                // Expand
                newSet.add(node.id);
                expandedKeys.value = newSet;
                emit('expand', node);

                // If node has no children yet and is not a leaf → load first page
                if (
                    !node.isLeaf &&
                    (!node.children || node.children.length === 0) &&
                    props.loadChildren
                ) {
                    if (
                        loadingKeys.has(nodeLoadKey) ||
                        loadingKeys.has(loadMoreKey)
                    ) {
                        return;
                    }

                    loadingKeys.add(nodeLoadKey);
                    loadingKeys.add(loadMoreKey);
                    try {
                        const result = await props.loadChildren(node);
                        // Mutate the data in-place (reactive update)
                        const target = findNode(props.data, node.id);
                        if (target) {
                            target.children = result.children;
                            target.hasMore = result.hasMore;
                        }
                    } finally {
                        loadingKeys.delete(nodeLoadKey);
                        nextTick(() => {
                            loadingKeys.delete(loadMoreKey);
                        });
                    }
                }
            }
        }

        // ── Load more children for a node ──────────────────────
        async function onLoadMore(node: TreeNodeData) {
            if (!props.loadChildren) return;

            const loadKey = `__load_more_${node.id}`;
            const nodeLoadKey = String(node.id);
            if (loadingKeys.has(loadKey) || loadingKeys.has(nodeLoadKey))
                return;

            loadingKeys.add(loadKey);
            try {
                const result = await props.loadChildren(node);
                const target = findNode(props.data, node.id);
                if (target) {
                    if (!target.children) {
                        target.children = [];
                    }
                    target.children.push(...result.children);
                    target.hasMore = result.hasMore;
                }
            } finally {
                loadingKeys.delete(loadKey);
            }
        }

        // ── Load more root-level nodes ─────────────────────────
        async function onLoadMoreRoot() {
            if (!props.loadRoot) return;

            const loadKey = '__load_more_root';
            if (loadingKeys.has(loadKey)) return; // prevent double-trigger

            loadingKeys.add(loadKey);
            try {
                await props.loadRoot();
            } finally {
                loadingKeys.delete(loadKey);
            }
        }

        // ── Auto-trigger loading when sentinel rows become visible ──
        watch(
            visibleItems,
            (items) => {
                for (const item of items) {
                    if (item.isLoadMore) {
                        if (item.node) {
                            // Child-level load more
                            onLoadMore(item.node);
                        } else {
                            // Root-level load more
                            onLoadMoreRoot();
                        }
                    }
                }
            },
            { flush: 'post' }
        );

        // ── Node click ─────────────────────────────────────────
        function onNodeClick(node: TreeNodeData) {
            emit('node-click', node);
        }

        // ── Node select ────────────────────────────────────────
        function onSelect(node: TreeNodeData) {
            if (!props.folderSelectable && !node.isLeaf) {
                return; // Folders are not selectable
            }

            const newSet = new Set(internalSelectedKeys.value);
            const isSelected = newSet.has(node.id);

            if (props.selectionMode === 'single') {
                newSet.clear();
                if (!isSelected) {
                    newSet.add(node.id);
                }
            } else {
                if (isSelected) {
                    newSet.delete(node.id);
                } else {
                    newSet.add(node.id);
                }
            }

            internalSelectedKeys.value = newSet;
            emit('select', node, newSet);
            emit('update:selectedKeys', newSet);
        }

        // ── Watch for external selectedKeys changes ────────────
        watch(
            () => props.selectedKeys,
            (newKeys) => {
                if (newKeys) {
                    internalSelectedKeys.value = new Set(newKeys);
                }
            }
        );

        // ── Watch for external defaultExpandedKeys changes ─────
        watch(
            () => props.defaultExpandedKeys,
            (newKeys) => {
                if (newKeys) {
                    expandedKeys.value = new Set(newKeys);
                }
            }
        );

        return {
            scrollContainer,
            flatList,
            totalHeight,
            visibleItems,
            offsetY,
            loadingKeys,
            internalSelectedKeys,
            onScroll,
            onToggle,
            onNodeClick,
            onSelect,
            getLoadMoreKey
        };
    }
});
</script>
