var v = Object.defineProperty;
var y = (r, t, e) => t in r ? v(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var i = (r, t, e) => y(r, typeof t != "symbol" ? t + "" : t, e);
import { Selection as w, Document as B } from "@lowcode/model";
export * from "@lowcode/model";
import { MaterialRegistry as T } from "@lowcode/material";
export * from "@lowcode/material";
import { PluginManager as x } from "@lowcode/plugin";
export * from "@lowcode/plugin";
import { Renderer as L } from "@lowcode/renderer";
export * from "@lowcode/renderer";
import { LoggerFactory as h } from "@lowcode/utils-logger";
import { applyPatches as d } from "immer";
function C(r) {
  return { all: r = r || /* @__PURE__ */ new Map(), on: function(t, e) {
    var n = r.get(t);
    n ? n.push(e) : r.set(t, [e]);
  }, off: function(t, e) {
    var n = r.get(t);
    n && (e ? n.splice(n.indexOf(e) >>> 0, 1) : r.set(t, []));
  }, emit: function(t, e) {
    var n = r.get(t);
    n && n.slice().map(function(s) {
      s(e);
    }), (n = r.get("*")) && n.slice().map(function(s) {
      s(t, e);
    });
  } };
}
const m = h.getLogger("EventBus");
class D {
  constructor() {
    i(this, "emitter");
    this.emitter = C(), m.debug("EventBus initialized");
  }
  on(t, e) {
    this.emitter.on(t, e);
  }
  off(t, e) {
    this.emitter.off(t, e);
  }
  emit(t, e) {
    m.debug(`[Event] ${t}`, e), this.emitter.emit(t, e);
  }
}
const g = h.getLogger("History");
class P {
  constructor(t, e) {
    i(this, "past", []);
    i(this, "future", []);
    i(this, "manager");
    i(this, "eventBus");
    this.manager = t, this.eventBus = e, this.eventBus.on("transaction:commit", ({ transaction: n }) => {
      this.push(n);
    });
  }
  push(t) {
    this.past.push(t), this.future = [], g.debug(`Transaction pushed to history: ${t.name}`), this.eventBus.emit("history:change", { undoLength: this.past.length, redoLength: this.future.length });
  }
  undo() {
    if (this.past.length === 0) return;
    const t = this.past.pop();
    g.debug(`Undo executing: ${t.name}`), this.manager.applyInverse(t), this.future.push(t), this.eventBus.emit("history:undo", { transaction: t }), this.eventBus.emit("history:change", { undoLength: this.past.length, redoLength: this.future.length });
  }
  redo() {
    if (this.future.length === 0) return;
    const t = this.future.pop();
    g.debug(`Redo executing: ${t.name}`), this.manager.applyForward(t), this.past.push(t), this.eventBus.emit("history:redo", { transaction: t }), this.eventBus.emit("history:change", { undoLength: this.past.length, redoLength: this.future.length });
  }
  clear() {
    this.past = [], this.future = [], this.eventBus.emit("history:change", { undoLength: 0, redoLength: 0 });
  }
}
const $ = h.getLogger("Skeleton");
class b {
  constructor() {
    i(this, "items", []);
  }
  add(t) {
    $.debug(`Adding item to ${t.area}`, t), this.items.push(t);
  }
  remove(t) {
    const e = this.items.indexOf(t);
    e > -1 && this.items.splice(e, 1);
  }
}
const E = h.getLogger("Transaction");
class k {
  constructor(t) {
    i(this, "id");
    i(this, "name");
    i(this, "timestamp");
    i(this, "ops", []);
    this.id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, this.name = t, this.timestamp = Date.now();
  }
  addOp(t) {
    this.ops.push(t);
  }
}
class I {
  constructor(t, e) {
    i(this, "currentTransaction", null);
    i(this, "eventBus");
    i(this, "getDocument");
    this.eventBus = t, this.getDocument = e, this.eventBus.on("node:change", this.handleNodeChange.bind(this));
  }
  get current() {
    return this.currentTransaction;
  }
  start(t = "Auto Transaction") {
    return this.currentTransaction ? (E.warn(`Transaction already active: ${this.currentTransaction.name}. Proceeding within existing transaction.`), this.currentTransaction) : (this.currentTransaction = new k(t), this.currentTransaction);
  }
  commit() {
    if (!this.currentTransaction) return;
    const t = this.currentTransaction;
    this.currentTransaction = null, t.ops.length > 0 && this.eventBus.emit("transaction:commit", { transaction: t });
  }
  rollback() {
    if (!this.currentTransaction) return;
    const t = this.currentTransaction;
    this.currentTransaction = null, t.ops.length > 0 && (this.applyInverse(t), this.eventBus.emit("transaction:rollback", { transaction: t }));
  }
  handleNodeChange(t) {
    const { node: e, patches: n, inversePatches: s } = t, o = !this.currentTransaction;
    o && this.start("Auto Prop Change"), this.currentTransaction.addOp({
      nodeId: e.id,
      type: "change",
      patches: n,
      inversePatches: s
    }), o && this.commit();
  }
  // Abstract method to apply inverse operations for rollback or undo
  applyInverse(t) {
    const e = this.getDocument();
    if (e) {
      for (let n = t.ops.length - 1; n >= 0; n--) {
        const s = t.ops[n];
        if (s.type === "change" && s.inversePatches) {
          const o = e.getNode(s.nodeId);
          if (o) {
            const c = o._props, u = d(c, s.inversePatches);
            o._props = u, this.eventBus.emit("node:change:system", { node: o, props: u });
          }
        }
      }
      this.eventBus.emit("engine:ready", void 0);
    }
  }
  applyForward(t) {
    const e = this.getDocument();
    if (e) {
      for (const n of t.ops)
        if (n.type === "change" && n.patches) {
          const s = e.getNode(n.nodeId);
          if (s) {
            const o = s._props, c = d(o, n.patches);
            s._props = c, this.eventBus.emit("node:change:system", { node: s, props: c });
          }
        }
      this.eventBus.emit("engine:ready", void 0);
    }
  }
}
const p = h.getLogger("Engine"), a = class a {
  constructor(t = {}) {
    i(this, "currentDocument", null);
    i(this, "events");
    i(this, "material");
    i(this, "selection");
    i(this, "history");
    i(this, "transaction");
    i(this, "plugins");
    i(this, "skeleton");
    i(this, "renderer");
    this.events = new D(), this.material = new T(), this.skeleton = new b(), this.transaction = new I(this.events, () => this.currentDocument), this.history = new P(this.transaction, this.events);
    const e = {
      emitSelectionChange: (s) => {
        this.events.emit("selection:change", { selected: s });
      }
    };
    this.selection = new w(e);
    const n = (s) => ({
      engine: this,
      events: this.events,
      skeleton: this.skeleton,
      logger: h.getLogger(s)
    });
    this.plugins = new x(n), this.renderer = t.renderClass ? new L(t.renderClass, t.mode || "edit") : null, p.info("Engine instance created"), this.events.emit("engine:init", void 0);
  }
  /**
   * Backward-compatible singleton access.
   * For new code, prefer `new Engine(config)`.
   */
  static getInstance(t) {
    return a.instance || (a.instance = new a(t)), a.instance;
  }
  /**
   * Reset the singleton instance (primarily for testing).
   */
  static resetInstance() {
    a.instance = null;
  }
  /**
   * Load a document from schema.
   */
  load(t) {
    p.info("Loading schema...");
    const e = {
      emitNodeChange: (n, s, o, c, u, f) => {
        this.events.emit("node:change", { node: n, key: s, value: o, oldValue: c, patches: u, inversePatches: f });
      },
      emitNodeAdd: (n, s, o) => {
        this.events.emit("node:add", { node: n, parent: s, index: o });
      },
      emitNodeRemove: (n, s, o) => {
        this.events.emit("node:remove", { node: n, parent: s, index: o });
      }
    };
    this.currentDocument = new B(t, e), this.events.emit("engine:ready", void 0);
  }
  /**
   * Render the current document into a DOM container.
   * Requires a renderClass to be configured.
   */
  render(t) {
    if (!this.renderer)
      throw new Error("Cannot render: no renderClass configured. Pass renderClass in Engine config.");
    if (!this.currentDocument)
      throw new Error("Cannot render: no document loaded. Call engine.load(schema) first.");
    this.renderer.render(this.currentDocument.root, t);
  }
};
i(a, "instance", null);
let l = a;
export {
  l as Engine,
  D as EventBus,
  P as History,
  b as Skeleton
};
