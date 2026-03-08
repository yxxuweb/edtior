var d = Object.defineProperty;
var l = (s, e, t) => e in s ? d(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var i = (s, e, t) => l(s, typeof e != "symbol" ? e + "" : e, t);
import { LoggerFactory as n } from "@lowcode/utils-logger";
import { enablePatches as m } from "immer";
m();
const c = n.getLogger("Node");
class o {
  constructor(e, t) {
    i(this, "id");
    i(this, "componentName");
    i(this, "_props");
    i(this, "_children");
    // Internal pointers
    i(this, "document", null);
    i(this, "parent", null);
    this.id = e.id, this.componentName = e.componentName, this._props = e.props || {}, this.document = t || null, this._children = (e.children || []).map((r) => {
      const h = new o(r, t);
      return h.parent = this, h;
    }), c.debug(`Node created: ${this.id}`);
  }
  get props() {
    return this._props;
  }
  get children() {
    return this._children;
  }
  get index() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  setProp(e, t) {
    const r = this._props[e];
    r !== t && (c.debug(`setProp: ${this.id}.${e} = ${t}`), this._props = produce(this._props, (h) => {
      h[e] = t;
    }), this.document && this.document.emitter && this.document.emitter.emitNodeChange(this, e, t, r));
  }
  appendChild(e) {
    this.insertChild(e, this._children.length);
  }
  insertChild(e, t) {
    e.parent && e.remove(), e.parent = this, e.document = this.document, this._children.splice(t, 0, e), this.document && (this.document.registerNode(e), this.document.emitter && this.document.emitter.emitNodeAdd(e, this, t));
  }
  insertBefore(e, t) {
    const r = this._children.indexOf(t);
    if (r === -1)
      throw new Error(`Reference node ${t.id} is not a child of ${this.id}`);
    this.insertChild(e, r);
  }
  remove() {
    if (!this.parent) return;
    const e = this.parent._children.indexOf(this);
    e > -1 && (this.parent._children.splice(e, 1), this.document && (this.document.emitter && this.document.emitter.emitNodeRemove(this, this.parent, e), this.document.unregisterNode(this)), this.parent = null);
  }
  exportSchema() {
    const e = {
      id: this.id,
      componentName: this.componentName
    };
    return Object.keys(this._props).length > 0 && (e.props = { ...this._props }), this._children.length > 0 && (e.children = this._children.map((t) => t.exportSchema())), e;
  }
}
const p = n.getLogger("Document");
class _ {
  constructor(e, t) {
    i(this, "root");
    // O(1) Lookup Map
    i(this, "nodeMap", /* @__PURE__ */ new Map());
    // Optional emitter to connect to Engine EventBus
    i(this, "emitter");
    this.emitter = t, this.root = new o(e, this), p.info("Document initialized with root:", this.root.id), this.registerNode(this.root);
  }
  getNode(e) {
    return this.nodeMap.get(e) || null;
  }
  /** 
   * Internal method called by Node.insertChild / constructor.
   * Recursively registers a node and its tree into the map.
   */
  registerNode(e) {
    this.nodeMap.set(e.id, e), e.document = this;
    for (const t of e.children)
      this.registerNode(t);
  }
  /**
   * Internal method called by Node.remove.
   * Recursively unregisters a node and its tree from the map.
   */
  unregisterNode(e) {
    for (const t of e.children)
      this.unregisterNode(t);
    this.nodeMap.delete(e.id), e.document = null;
  }
  exportSchema() {
    return this.root.exportSchema();
  }
}
const u = n.getLogger("Selection");
class N {
  constructor(e) {
    i(this, "emitter");
    i(this, "_selected", []);
    this.emitter = e;
  }
  get selected() {
    return this._selected;
  }
  get first() {
    return this._selected[0];
  }
  select(e) {
    this._selected.length === 1 && this._selected[0] === e || (this._selected = [e], this.emitChange());
  }
  add(e) {
    this._selected.includes(e) || (this._selected.push(e), this.emitChange());
  }
  remove(e) {
    const t = this._selected.indexOf(e);
    t > -1 && (this._selected.splice(t, 1), this.emitChange());
  }
  clear() {
    this._selected.length !== 0 && (this._selected = [], this.emitChange());
  }
  emitChange() {
    const e = this._selected.map((t) => t.id);
    u.debug("Selection changed:", e), this.emitter.emitSelectionChange(e);
  }
}
export {
  _ as Document,
  o as Node,
  N as Selection
};
