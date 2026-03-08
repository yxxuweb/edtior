import { defineComponent as R, openBlock as u, createElementBlock as h, normalizeStyle as m, normalizeClass as T, createElementVNode as N, toDisplayString as M, createCommentVNode as z, Fragment as b, withModifiers as $, renderSlot as H, createTextVNode as B, ref as L, reactive as A, computed as p, watch as K, nextTick as D, resolveComponent as G, renderList as J, createBlock as P, withCtx as Q } from "vue";
function U(e, o, s = !1) {
  const i = [];
  function a(v, f, d) {
    for (const l of v) {
      const c = o.has(l.id), k = l.isLeaf === !0, C = !k && (l.children && l.children.length > 0 || l.hasMore === !0 || l.isLeaf === void 0);
      i.push({
        key: String(l.id),
        node: l,
        level: f,
        expanded: c,
        parentId: d,
        isLoadMore: !1,
        hasChildren: C,
        isLeaf: k
      }), c && !k && (l.children && l.children.length > 0 && a(l.children, f + 1, l.id), l.hasMore && i.push({
        key: `__load_more_${l.id}`,
        node: l,
        level: f + 1,
        expanded: !1,
        parentId: l.id,
        isLoadMore: !0,
        hasChildren: !1,
        isLeaf: !1
      }));
    }
  }
  return a(e, 0, null), s && i.push({
    key: "__load_more_root",
    node: null,
    level: 0,
    expanded: !1,
    parentId: null,
    isLoadMore: !0,
    hasChildren: !1,
    isLeaf: !1
  }), i;
}
const W = R({
  name: "TreeNodeRow",
  props: {
    flatNode: {
      type: Object,
      required: !0
    },
    indent: {
      type: Number,
      default: 20
    },
    loading: {
      type: Boolean,
      default: !1
    },
    nodeLoading: {
      type: Boolean,
      default: !1
    },
    selected: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["toggle", "node-click", "select"],
  setup(e, { emit: o }) {
    function s() {
      e.flatNode.hasChildren && !e.flatNode.isLeaf && o("toggle", e.flatNode.node);
    }
    function i() {
      e.flatNode.node && (o("node-click", e.flatNode.node), o("select", e.flatNode.node));
    }
    return { onToggle: s, onLabelClick: i };
  }
}), E = (e, o) => {
  const s = e.__vccOpts || e;
  for (const [i, a] of o)
    s[i] = a;
  return s;
}, X = {
  key: 0,
  class: "vtree-auto-load-indicator"
}, Z = {
  key: 0,
  class: "vtree-auto-load-count"
}, x = {
  key: 0,
  class: "vtree-spinner"
}, ee = {
  key: 1,
  class: "vtree-chevron",
  viewBox: "0 0 16 16",
  width: "16",
  height: "16"
}, te = {
  key: 1,
  class: "vtree-leaf-spacer"
};
function oe(e, o, s, i, a, v) {
  var f, d, l;
  return u(), h("div", {
    class: T(["vtree-node-row", {
      "vtree-node-row--load-more": e.flatNode.isLoadMore,
      "vtree-node-row--loading": e.loading,
      "vtree-node-row--selected": e.selected && !e.flatNode.isLoadMore
    }]),
    style: m({ paddingLeft: e.flatNode.level * e.indent + "px" })
  }, [
    e.flatNode.isLoadMore ? (u(), h("div", X, [
      o[2] || (o[2] = N("span", { class: "vtree-spinner" }, null, -1)),
      o[3] || (o[3] = N("span", { class: "vtree-auto-load-text" }, "加载中...", -1)),
      (f = e.flatNode.node) != null && f.totalChildren && ((l = (d = e.flatNode.node) == null ? void 0 : d.children) != null && l.length) ? (u(), h("span", Z, " (" + M(e.flatNode.node.children.length) + " / " + M(e.flatNode.node.totalChildren) + ") ", 1)) : z("", !0)
    ])) : (u(), h(b, { key: 1 }, [
      N("span", {
        class: T(["vtree-expand-icon", {
          "vtree-expand-icon--expanded": e.flatNode.expanded,
          "vtree-expand-icon--leaf": e.flatNode.isLeaf || !e.flatNode.hasChildren
        }]),
        onClick: o[0] || (o[0] = $((...c) => e.onToggle && e.onToggle(...c), ["stop"]))
      }, [
        e.flatNode.hasChildren && !e.flatNode.isLeaf ? (u(), h(b, { key: 0 }, [
          e.nodeLoading ? (u(), h("span", x)) : (u(), h("svg", ee, [...o[4] || (o[4] = [
            N("path", {
              d: "M6 4l4 4-4 4",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])]))
        ], 64)) : (u(), h("span", te))
      ], 2),
      N("span", {
        class: "vtree-node-label",
        onClick: o[1] || (o[1] = $((...c) => e.onLabelClick && e.onLabelClick(...c), ["stop"]))
      }, [
        H(e.$slots, "default", {
          node: e.flatNode.node
        }, () => [
          B(M(e.flatNode.node.label), 1)
        ])
      ])
    ], 64))
  ], 6);
}
const ne = /* @__PURE__ */ E(W, [["render", oe]]), le = R({
  name: "VirtualTree",
  components: { TreeNodeRow: ne },
  props: {
    data: {
      type: Array,
      required: !0
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
      type: Object,
      default: () => /* @__PURE__ */ new Set()
    },
    loadChildren: {
      type: Function,
      default: void 0
    },
    /** Async callback to load more root-level nodes */
    loadRoot: {
      type: Function,
      default: void 0
    },
    /** If true, more root-level nodes can be loaded via loadRoot */
    hasMoreRoot: {
      type: Boolean,
      default: !1
    },
    /** Number of extra items to render above/below the viewport */
    overscan: {
      type: Number,
      default: 5
    },
    /** Set of node IDs that are currently selected */
    selectedKeys: {
      type: Object,
      default: () => /* @__PURE__ */ new Set()
    },
    /** Selection mode: 'single' or 'multiple' */
    selectionMode: {
      type: String,
      default: "single"
    }
  },
  emits: ["expand", "collapse", "node-click", "select", "update:selectedKeys"],
  setup(e, { emit: o }) {
    const s = L(
      new Set(e.defaultExpandedKeys)
    ), i = L(
      new Set(e.selectedKeys)
    ), a = A(/* @__PURE__ */ new Set()), v = L(null), f = L(0), d = p(
      () => U(e.data, s.value, e.hasMoreRoot)
    ), l = p(
      () => d.value.length * e.itemHeight
    ), c = p(() => {
      const t = Math.floor(f.value / e.itemHeight);
      return Math.max(0, t - e.overscan);
    }), k = p(() => {
      const t = Math.ceil(e.height / e.itemHeight), n = Math.floor(f.value / e.itemHeight) + t + e.overscan;
      return Math.min(d.value.length, n);
    }), C = p(
      () => d.value.slice(c.value, k.value)
    ), I = p(() => c.value * e.itemHeight);
    function V() {
      v.value && (f.value = v.value.scrollTop);
    }
    function _(t) {
      return t.isLoadMore ? t.node ? `__load_more_${t.node.id}` : "__load_more_root" : "";
    }
    function S(t, n) {
      for (const r of t) {
        if (r.id === n) return r;
        if (r.children) {
          const g = S(r.children, n);
          if (g) return g;
        }
      }
      return null;
    }
    async function j(t) {
      const n = new Set(s.value), r = String(t.id), g = `__load_more_${t.id}`;
      if (n.has(t.id))
        n.delete(t.id), s.value = n, o("collapse", t);
      else if (n.add(t.id), s.value = n, o("expand", t), !t.isLeaf && (!t.children || t.children.length === 0) && e.loadChildren) {
        if (a.has(r) || a.has(g))
          return;
        a.add(r), a.add(g);
        try {
          const y = await e.loadChildren(t), w = S(e.data, t.id);
          w && (w.children = y.children, w.hasMore = y.hasMore);
        } finally {
          a.delete(r), D(() => {
            a.delete(g);
          });
        }
      }
    }
    async function O(t) {
      if (!e.loadChildren) return;
      const n = `__load_more_${t.id}`, r = String(t.id);
      if (!(a.has(n) || a.has(r))) {
        a.add(n);
        try {
          const g = await e.loadChildren(t), y = S(e.data, t.id);
          y && (y.children || (y.children = []), y.children.push(...g.children), y.hasMore = g.hasMore);
        } finally {
          a.delete(n);
        }
      }
    }
    async function F() {
      if (!e.loadRoot) return;
      const t = "__load_more_root";
      if (!a.has(t)) {
        a.add(t);
        try {
          await e.loadRoot();
        } finally {
          a.delete(t);
        }
      }
    }
    K(
      C,
      (t) => {
        for (const n of t)
          n.isLoadMore && (n.node ? O(n.node) : F());
      },
      { flush: "post" }
    );
    function Y(t) {
      o("node-click", t);
    }
    function q(t) {
      const n = new Set(i.value), r = n.has(t.id);
      e.selectionMode === "single" ? (n.clear(), r || n.add(t.id)) : r ? n.delete(t.id) : n.add(t.id), i.value = n, o("select", t, n), o("update:selectedKeys", n);
    }
    return K(
      () => e.selectedKeys,
      (t) => {
        t && (i.value = new Set(t));
      }
    ), K(
      () => e.defaultExpandedKeys,
      (t) => {
        t && (s.value = new Set(t));
      }
    ), {
      scrollContainer: v,
      flatList: d,
      totalHeight: l,
      visibleItems: C,
      offsetY: I,
      loadingKeys: a,
      internalSelectedKeys: i,
      onScroll: V,
      onToggle: j,
      onNodeClick: Y,
      onSelect: q,
      getLoadMoreKey: _
    };
  }
});
function ae(e, o, s, i, a, v) {
  const f = G("TreeNodeRow");
  return u(), h("div", {
    class: "vtree-container",
    style: m({ height: e.height + "px" }),
    ref: "scrollContainer",
    onScroll: o[0] || (o[0] = (...d) => e.onScroll && e.onScroll(...d))
  }, [
    N("div", {
      class: "vtree-phantom",
      style: m({ height: e.totalHeight + "px" })
    }, null, 4),
    N("div", {
      class: "vtree-visible-area",
      style: m({ transform: `translateY(${e.offsetY}px)` })
    }, [
      (u(!0), h(b, null, J(e.visibleItems, (d) => {
        var l;
        return u(), P(f, {
          key: d.key,
          "flat-node": d,
          indent: e.indent,
          loading: e.loadingKeys.has(e.getLoadMoreKey(d)),
          "node-loading": e.loadingKeys.has(String((l = d.node) == null ? void 0 : l.id)),
          selected: d.node ? e.internalSelectedKeys.has(d.node.id) : !1,
          style: m({ height: e.itemHeight + "px" }),
          onToggle: e.onToggle,
          onNodeClick: e.onNodeClick,
          onSelect: e.onSelect
        }, {
          default: Q(({ node: c }) => [
            H(e.$slots, "default", { node: c }, () => [
              B(M(c.label), 1)
            ])
          ]),
          _: 3
        }, 8, ["flat-node", "indent", "loading", "node-loading", "selected", "style", "onToggle", "onNodeClick", "onSelect"]);
      }), 128))
    ], 4)
  ], 36);
}
const ie = /* @__PURE__ */ E(le, [["render", ae]]);
export {
  ne as TreeNodeRow,
  ie as VirtualTree,
  U as flattenTree
};
