var s = Object.defineProperty;
var i = (e, t, a) => t in e ? s(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var r = (e, t, a) => i(e, typeof t != "symbol" ? t + "" : t, a);
import { LoggerFactory as c } from "@lowcode/utils-logger";
const n = c.getLogger("PluginManager");
class l {
  constructor(t) {
    r(this, "plugins", /* @__PURE__ */ new Map());
    r(this, "contextFactory");
    this.contextFactory = t;
  }
  async use(t) {
    if (this.plugins.has(t.name)) {
      n.warn(`Plugin ${t.name} already registered.`);
      return;
    }
    n.info(`Loading plugin: ${t.name}`);
    const a = this.contextFactory(t.name);
    try {
      await t.init(a), this.plugins.set(t.name, t), n.info(`Plugin ${t.name} loaded.`);
    } catch (o) {
      n.error(`Failed to load plugin ${t.name}`, o);
    }
  }
  get(t) {
    return this.plugins.get(t);
  }
}
export {
  l as PluginManager
};
