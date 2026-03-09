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
                    placeholder="输入关键字进行后端搜索..."
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
                <span v-if="isSearching" class="demo-searching">搜索中...</span>
                <span v-else>
                    后端返回了包含关键字的节点树
                </span>
                <button
                    v-if="!isSearching && matchedNodes.length > 0"
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
            <div class="demo-controls">
                <label class="demo-control-label">
                    <input type="checkbox" v-model="folderSelectable" />
                    允许选中文件夹 (非叶子节点)
                </label>
                <label class="demo-control-label">
                    选择模式:
                    <select v-model="selectionMode">
                        <option value="single">单选 (Single)</option>
                        <option value="multiple">多选 (Multiple)</option>
                    </select>
                </label>
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
                :selection-mode="selectionMode"
                :folder-selectable="folderSelectable"
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
        const isSearching = ref(false);
        const selectionMode = ref<'single' | 'multiple'>('multiple');
        const folderSelectable = ref(true);
        let searchTimer: any = null;

        loadRootPage();

        function loadRootPage() {
            // Disabled if we are showing search results
            if (searchKeyword.value.trim()) return;

            const remaining = TOTAL_ROOT_COUNT - rootLoadedCount.value;
            const count = Math.min(PAGE_SIZE, remaining);

            for (let i = 0; i < count; i++) {
                const index = rootLoadedCount.value + i + 1;
                const id = `root-${index}`;
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
                const childIndex = currentLoaded + i + 1;
                const childId = `${node.id}-child-${childIndex}`;
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

        async function mockBackendSearch(keyword: string): Promise<TreeNodeData[]> {
            // Simulate network delay
            await new Promise((r) => setTimeout(r, 600));

            // Generate a fake tree structure containing the keyword
            const keywordStr = keyword.toLowerCase();
            const rootId = `search-root-mock-${keywordStr}`;
            const childId = `search-child-mock-${keywordStr}`;
            const grandChildId = `search-match-mock-${keywordStr}`;

            // Create a fake match so tracking still works (in reality the backend would flag these)
            const matchedNode: TreeNodeData = {
                id: grandChildId,
                label: `模拟匹配的节点 - 包含 ${keywordStr}`,
                isLeaf: true,
            };

            // Store it so the UI can highlight it via isMatched check
            matchedNodes.value = [matchedNode];

            const result: TreeNodeData[] = [
                {
                    id: rootId,
                    label: '搜索结果根级 (Mock)',
                    isLeaf: false,
                    hasMore: false,
                    children: [
                        {
                            id: childId,
                            label: '展开查看匹配项',
                            isLeaf: false,
                            hasMore: false,
                            children: [matchedNode]
                        }
                    ]
                }
            ];

            return result;
        }

        function onSearch() {
            const keyword = searchKeyword.value.trim();

            if (searchTimer) clearTimeout(searchTimer);

            if (!keyword) {
                clearSearch();
                return;
            }

            isSearching.value = true;
            searchTimer = setTimeout(async () => {
                try {
                    // Call the fake backend search
                    const resultTree = await mockBackendSearch(keyword);

                    // If user changed input while fetching, abort updating
                    if (searchKeyword.value.trim() !== keyword) return;

                    // 1. Clear existing tree data
                    treeData.splice(0, treeData.length);
                    loadedCountMap.clear();
                    // 2. Insert the backend search result tree
                    treeData.push(...resultTree);
                    // 3. Disable root pagination for search results
                    hasMoreRoot.value = false;

                    // 4. Automatically expand the path to the mocked matched node
                    const newExpandedKeys = new Set<string | number>();
                    // In a real app, backend might return a list of path IDs to expand
                    // We know our mock structure: result[0].id and result[0].children[0].id
                    newExpandedKeys.add(resultTree[0].id);
                    if (resultTree[0].children && resultTree[0].children.length > 0) {
                        newExpandedKeys.add(resultTree[0].children[0].id);
                    }
                    expandedKeys.value = newExpandedKeys;
                } finally {
                    isSearching.value = false;
                }
            }, 300); // 300ms debounce
        }

        function clearSearch() {
            if (searchTimer) clearTimeout(searchTimer);
            searchKeyword.value = '';
            matchedNodes.value = [];
            expandedKeys.value = new Set();
            isSearching.value = false;

            // Restore root pagination state
            treeData.splice(0, treeData.length);
            rootLoadedCount.value = 0;
            hasMoreRoot.value = true;
            loadedCountMap.clear();
            loadRootPage();
        }

        function isMatched(node: TreeNodeData): boolean {
            if (!searchKeyword.value.trim() || matchedNodes.value.length === 0) return false;
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
            isSearching,
            selectionMode,
            folderSelectable,
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

.demo-controls {
    display: flex;
    gap: 20px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.demo-control-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #e2e8f0;
    cursor: pointer;
}

.demo-control-label input[type="checkbox"] {
    cursor: pointer;
}

.demo-control-label select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
}

.demo-control-label select option {
    background: #2d3748;
    color: #fff;
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
