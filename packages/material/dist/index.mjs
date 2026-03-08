var i = Object.defineProperty;
var o = (r, e, t) => e in r ? i(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var a = (r, e, t) => o(r, typeof e != "symbol" ? e + "" : e, t);
import { LoggerFactory as g } from "@lowcode/utils-logger";
const s = g.getLogger("MaterialRegistry");
class l {
  constructor() {
    a(this, "materials", /* @__PURE__ */ new Map());
  }
  register(e) {
    this.materials.has(e.componentName) && s.warn(`Material ${e.componentName} already registered. Overwriting.`), this.materials.set(e.componentName, e), s.info(`Material registered: ${e.componentName}`);
  }
  get(e) {
    return this.materials.get(e);
  }
  getAll() {
    return Array.from(this.materials.values());
  }
}
export {
  l as MaterialRegistry
};
