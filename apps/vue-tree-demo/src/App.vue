<template>
    <div class="demo-app">
        <header class="demo-header">
            <h1>Vue Virtual Tree Demo</h1>
            <p class="demo-subtitle">
                虚拟滚动 + 分层分页加载 · 支持大数据量场景
            </p>
            <div class="demo-stats">
                <span class="demo-stat">
                    <strong>总根节点数:</strong> {{ totalRootCount }}
                </span>
                <span class="demo-stat">
                    <strong>已加载根节点:</strong> {{ treeData.length }}
                </span>
                <span class="demo-stat">
                    <strong>每页加载:</strong> {{ pageSize }} 个节点
                </span>
                <span class="demo-stat">
                    <strong>最大层级:</strong> {{ maxDepth }} 层
                </span>
            </div>
            <div class="demo-search">
                <input
                    v-model="searchKeyword"
                    type="text"
                    placeholder="搜索节点..."
                    class="demo-search-input"
                    @input="onSearch"
                />
                <button
                    v-if="searchKeyword"
                    class="demo-search-clear"
                    @click="clearSearch"
                >
                    清除
                </button>
            </div>
            <div v-if="searchKeyword" class="demo-search-info">
                找到 {{ matchedNodes.length }} 个匹配节点
                <button
                    v-if="matchedNodes.length > 0"
                    class="demo-select-all-btn"
                    @click="selectAllMatched"
                >
                    全选匹配项
                </button>
            </div>
            <div class="demo-selection-info">
                已选中 {{ selectedKeys.size }} 个节点
                <button
                    v-if="selectedKeys.size > 0"
                    class="demo-clear-selection-btn"
                    @click="clearSelection"
                >
                    清除选中
                </button>
            </div>
        </header>

        <main class="demo-content">
            <VirtualTree
                ref="treeRef"
                :data="treeData"
                :item-height="34"
                :height="600"
                :indent="22"
                :load-children="loadChildren"
                :load-root="loadRoot"
                :has-more-root="hasMoreRoot"
                :selected-keys="selectedKeys"
                :default-expanded-keys="expandedKeys"
                selection-mode="multiple"
                @select="onSelect"
            >
                <template #default="{ node }">
                    <span
                        :class="{
                            'demo-highlight': isMatched(node)
                        }"
                    >
                        {{ node.label }}
                    </span>
                </template>
            </VirtualTree>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { VirtualTree } from '@lowcode/vue-tree';
import type { TreeNodeData } from '@lowcode/vue-tree';

const TOTAL_ROOT_COUNT = 100;
const PAGE_SIZE = 50;
const MAX_DEPTH = 5;
const TOTAL_CHILDREN = 200;
const LOAD_DELAY = 300;

let nextId = 1;

export default defineComponent({
    name: 'App',
    components: { VirtualTree },
    setup() {
        const totalRootCount = TOTAL_ROOT_COUNT;
        const pageSize = PAGE_SIZE;
        const maxDepth = MAX_DEPTH;

        const treeData = reactive<TreeNodeData[]>([]);
        const rootLoadedCount = ref(0);
        const hasMoreRoot = ref(true);
        const treeRef = ref<InstanceType<typeof VirtualTree> | null>(null);

        const selectedKeys = ref<Set<string | number>>(new Set());
        const expandedKeys = ref<Set<string | number>>(new Set());
        const searchKeyword = ref('');
        const matchedNodes = ref<TreeNodeData[]>([]);

        loadRootPage();

        function loadRootPage() {
            const remaining = TOTAL_ROOT_COUNT - rootLoadedCount.value;
            const count = Math.min(PAGE_SIZE, remaining);

            for (let i = 0; i < count; i++) {
                const id = nextId++;
                const index = rootLoadedCount.value + i + 1;
                treeData.push({
                    id,
                    label: `根节点 ${index}`,
                    isLeaf: false,
                    hasMore: true,
                    totalChildren: TOTAL_CHILDREN
                });
            }

            rootLoadedCount.value += count;
            hasMoreRoot.value = rootLoadedCount.value < TOTAL_ROOT_COUNT;
        }

        const loadedCountMap = new Map<string | number, number>();

        async function loadRoot(): Promise<void> {
            await new Promise((r) => setTimeout(r, LOAD_DELAY));
            loadRootPage();
        }

        async function loadChildren(
            node: TreeNodeData
        ): Promise<{ children: TreeNodeData[]; hasMore: boolean }> {
            await new Promise((r) => setTimeout(r, LOAD_DELAY));

            const currentLoaded = loadedCountMap.get(node.id) || 0;
            const remaining = TOTAL_CHILDREN - currentLoaded;
            const count = Math.min(PAGE_SIZE, remaining);

            const depth = getNodeDepth(node);
            const children: TreeNodeData[] = [];

            for (let i = 0; i < count; i++) {
                const childId = nextId++;
                const childIndex = currentLoaded + i + 1;
                const isLeaf = depth + 1 >= MAX_DEPTH;
                children.push({
                    id: childId,
                    label: `${node.label} / 子节点 ${childIndex}`,
                    isLeaf,
                    hasMore: isLeaf ? false : true,
                    totalChildren: isLeaf ? 0 : TOTAL_CHILDREN,
                    children: []
                });
            }

            const newLoaded = currentLoaded + count;
            loadedCountMap.set(node.id, newLoaded);

            return {
                children,
                hasMore: newLoaded < TOTAL_CHILDREN
            };
        }

        function getNodeDepth(node: TreeNodeData): number {
            const slashes = (node.label.match(/\//g) || []).length;
            return slashes + 1;
        }

        function findMatchingNodes(
            nodes: TreeNodeData[],
            keyword: string
        ): TreeNodeData[] {
            const matches: TreeNodeData[] = [];
            const lowerKeyword = keyword.toLowerCase();

            function walk(nodeList: TreeNodeData[]) {
                for (const node of nodeList) {
                    if (node.label.toLowerCase().includes(lowerKeyword)) {
                        matches.push(node);
                    }
                    if (node.children && node.children.length > 0) {
                        walk(node.children);
                    }
                }
            }

            walk(nodes);
            return matches;
        }

        function findParentChain(
            nodes: TreeNodeData[],
            targetId: string | number,
            path: TreeNodeData[] = []
        ): TreeNodeData[] | null {
            for (const node of nodes) {
                if (node.id === targetId) {
                    return path;
                }
                if (node.children && node.children.length > 0) {
                    const result = findParentChain(node.children, targetId, [
                        ...path,
                        node
                    ]);
                    if (result) return result;
                }
            }
            return null;
        }

        async function onSearch() {
            if (!searchKeyword.value.trim()) {
                matchedNodes.value = [];
                return;
            }

            matchedNodes.value = findMatchingNodes(
                treeData,
                searchKeyword.value.trim()
            );

            const newExpandedKeys = new Set<string | number>();
            for (const matchedNode of matchedNodes.value) {
                const parentChain = findParentChain(treeData, matchedNode.id);
                if (parentChain) {
                    for (const parent of parentChain) {
                        newExpandedKeys.add(parent.id);
                    }
                }
            }

            expandedKeys.value = newExpandedKeys;
        }

        function clearSearch() {
            searchKeyword.value = '';
            matchedNodes.value = [];
        }

        function isMatched(node: TreeNodeData): boolean {
            if (!searchKeyword.value.trim()) return false;
            return matchedNodes.value.some((m) => m.id === node.id);
        }

        function onSelect(
            _node: TreeNodeData,
            keys: Set<string | number>
        ) {
            selectedKeys.value = keys;
        }

        function selectAllMatched() {
            const newKeys = new Set(selectedKeys.value);
            for (const node of matchedNodes.value) {
                newKeys.add(node.id);
            }
            selectedKeys.value = newKeys;
        }

        function clearSelection() {
            selectedKeys.value = new Set();
        }

        return {
            treeData,
            loadChildren,
            loadRoot,
            hasMoreRoot,
            totalRootCount,
            pageSize,
            maxDepth,
            treeRef,
            selectedKeys,
            expandedKeys,
            searchKeyword,
            matchedNodes,
            onSearch,
            clearSearch,
            isMatched,
            onSelect,
            selectAllMatched,
            clearSelection
        };
    }
});
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 20px;
}

#app {
    width: 100%;
    max-width: 800px;
}

.demo-app {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    overflow: hidden;
}

.demo-header {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
    color: #ffffff;
    padding: 32px;
}

.demo-header h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
}

.demo-subtitle {
    color: #a0aec0;
    font-size: 14px;
    margin-bottom: 16px;
}

.demo-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.demo-stat {
    background: rgba(255, 255, 255, 0.1);
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    color: #e2e8f0;
}

.demo-stat strong {
    color: #63b3ed;
}

.demo-search {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.demo-search-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background-color 0.2s;
}

.demo-search-input::placeholder {
    color: #a0aec0;
}

.demo-search-input:focus {
    border-color: #63b3ed;
    background: rgba(255, 255, 255, 0.15);
}

.demo-search-clear {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    background: #e53e3e;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.demo-search-clear:hover {
    background: #c53030;
}

.demo-search-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: rgba(99, 179, 237, 0.2);
    border-radius: 6px;
    font-size: 13px;
    color: #90cdf4;
    margin-bottom: 12px;
}

.demo-select-all-btn {
    padding: 4px 10px;
    border: none;
    border-radius: 4px;
    background: #38a169;
    color: #ffffff;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.demo-select-all-btn:hover {
    background: #2f855a;
}

.demo-selection-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: rgba(154, 230, 180, 0.2);
    border-radius: 6px;
    font-size: 13px;
    color: #9ae6b4;
}

.demo-clear-selection-btn {
    padding: 4px 10px;
    border: none;
    border-radius: 4px;
    background: #718096;
    color: #ffffff;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.demo-clear-selection-btn:hover {
    background: #4a5568;
}

.demo-content {
    padding: 24px;
}

.demo-highlight {
    background-color: #fef08a;
    padding: 1px 4px;
    border-radius: 3px;
}
</style>
