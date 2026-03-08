<template>
    <div
        class="vtree-node-row"
        :class="{
            'vtree-node-row--load-more': flatNode.isLoadMore,
            'vtree-node-row--loading': loading,
            'vtree-node-row--selected': selected && !flatNode.isLoadMore
        }"
        :style="{ paddingLeft: flatNode.level * indent + 'px' }"
    >
        <!-- Auto-loading sentinel row (replaces the old "Load More" button) -->
        <template v-if="flatNode.isLoadMore">
            <div class="vtree-auto-load-indicator">
                <span class="vtree-spinner"></span>
                <span class="vtree-auto-load-text">加载中...</span>
                <span
                    v-if="
                        flatNode.node?.totalChildren &&
                        flatNode.node?.children?.length
                    "
                    class="vtree-auto-load-count"
                >
                    ({{ flatNode.node.children.length }} /
                    {{ flatNode.node.totalChildren }})
                </span>
            </div>
        </template>

        <!-- Normal node row -->
        <template v-else>
            <span
                class="vtree-expand-icon"
                :class="{
                    'vtree-expand-icon--expanded': flatNode.expanded,
                    'vtree-expand-icon--leaf':
                        flatNode.isLeaf || !flatNode.hasChildren
                }"
                @click.stop="onToggle"
            >
                <template v-if="flatNode.hasChildren && !flatNode.isLeaf">
                    <span v-if="nodeLoading" class="vtree-spinner"></span>
                    <svg
                        v-else
                        class="vtree-chevron"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                    >
                        <path
                            d="M6 4l4 4-4 4"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </template>
                <span v-else class="vtree-leaf-spacer"></span>
            </span>
            <span
                class="vtree-node-label"
                @click.stop="onLabelClick"
            >
                <slot :node="flatNode.node!">
                    {{ flatNode.node!.label }}
                </slot>
            </span>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { FlatNode } from './types';

export default defineComponent({
    name: 'TreeNodeRow',
    props: {
        flatNode: {
            type: Object as PropType<FlatNode>,
            required: true
        },
        indent: {
            type: Number,
            default: 20
        },
        loading: {
            type: Boolean,
            default: false
        },
        nodeLoading: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    emits: ['toggle', 'node-click', 'select'],
    setup(props, { emit }) {
        function onToggle() {
            if (props.flatNode.hasChildren && !props.flatNode.isLeaf) {
                emit('toggle', props.flatNode.node!);
            }
        }

        function onLabelClick() {
            if (props.flatNode.node) {
                emit('node-click', props.flatNode.node);
                emit('select', props.flatNode.node);
            }
        }

        return { onToggle, onLabelClick };
    }
});
</script>
