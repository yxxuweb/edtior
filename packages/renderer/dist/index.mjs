var a = Object.defineProperty;
var l = (n, e, r) => e in n ? a(n, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[e] = r;
var o = (n, e, r) => l(n, typeof e != "symbol" ? e + "" : e, r);
import { LoggerFactory as p } from "@lowcode/utils-logger";
function i(n) {
  const e = {};
  for (const [r, t] of Object.entries(n))
    t && typeof t == "object" && t.type === "JSExpression" || t && typeof t == "object" && t.type === "JSFunction" ? e[r] = t.value : e[r] = t;
  return e;
}
const s = p.getLogger("Renderer");
class m {
  constructor(e, r = "edit") {
    o(this, "renderClass");
    o(this, "mode");
    o(this, "containers", /* @__PURE__ */ new Map());
    o(this, "rootContainer", null);
    this.renderClass = e, this.mode = r, s.info(`Renderer created in ${r} mode`);
  }
  /**
   * Render a node tree into the given root container.
   */
  render(e, r) {
    s.info("Starting render from root node:", e.id), this.rootContainer = r, r.innerHTML = "", this.containers.clear();
    const t = this.renderNode(e);
    r.appendChild(t), s.info("Render complete");
  }
  /**
   * Recursively render a single node and its children.
   * Creates a DOM container, delegates component mounting to the
   * framework render class, then recurses into children.
   */
  renderNode(e) {
    const r = i(e.props), t = document.createElement("div");
    t.setAttribute("data-node-id", e.id), this.containers.set(e.id, t), this.renderClass.renderComponent({
      componentName: e.componentName,
      props: r,
      container: t,
      node: e,
      mode: this.mode
    });
    for (const d of e.children) {
      const c = this.renderNode(d);
      t.appendChild(c);
    }
    return t;
  }
  /**
   * Update a specific node's rendered component with new props.
   */
  updateNode(e, r) {
    const t = i(r);
    this.renderClass.updateComponent(e, t);
  }
  /**
   * Get the DOM container for a specific node.
   */
  getContainer(e) {
    return this.containers.get(e);
  }
  /**
   * Destroy the renderer and clean up all resources.
   */
  destroy() {
    s.info("Destroying renderer");
    for (const [e] of this.containers)
      this.renderClass.destroyComponent(e);
    this.containers.clear(), this.rootContainer && (this.rootContainer.innerHTML = "", this.rootContainer = null), s.info("Renderer destroyed");
  }
}
export {
  m as Renderer,
  i as computeProps
};
