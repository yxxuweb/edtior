var g = Object.defineProperty;
var l = (o, t, r) => t in o ? g(o, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[t] = r;
var c = (o, t, r) => l(o, typeof t != "symbol" ? t + "" : t, r);
var s = /* @__PURE__ */ ((o) => (o[o.DEBUG = 0] = "DEBUG", o[o.INFO = 1] = "INFO", o[o.WARN = 2] = "WARN", o[o.ERROR = 3] = "ERROR", o[o.OFF = 4] = "OFF", o))(s || {});
class f {
  constructor(t, r) {
    c(this, "namespace");
    c(this, "config");
    this.namespace = t, this.config = r;
  }
  setLevel(t) {
    this.config.level = t;
  }
  log(t, r, ...e) {
    if (!(t < this.config.level))
      for (const i of this.config.adapters)
        i.log(t, this.namespace, r, ...e);
  }
  debug(t, ...r) {
    this.log(s.DEBUG, t, ...r);
  }
  info(t, ...r) {
    this.log(s.INFO, t, ...r);
  }
  warn(t, ...r) {
    this.log(s.WARN, t, ...r);
  }
  error(t, ...r) {
    this.log(s.ERROR, t, ...r);
  }
}
class R {
  log(t, r, e, ...i) {
    const n = `[${(/* @__PURE__ */ new Date()).toISOString()}] [${s[t]}] [${r}]`;
    switch (t) {
      case s.DEBUG:
        console.debug(n, e, ...i);
        break;
      case s.INFO:
        console.info(n, e, ...i);
        break;
      case s.WARN:
        console.warn(n, e, ...i);
        break;
      case s.ERROR:
        console.error(n, e, ...i);
        break;
    }
  }
}
const a = Symbol.for("@lowcode/utils-logger/registry");
class p {
  static get registry() {
    const t = typeof window < "u" ? window : global;
    return t[a] || (t[a] = {
      loggers: /* @__PURE__ */ new Map(),
      config: {
        level: s.INFO,
        adapters: [new R()]
      }
    }), t[a];
  }
  static configure(t) {
    const r = this.registry;
    t.level !== void 0 && (r.config.level = t.level), t.adapters !== void 0 && (r.config.adapters = t.adapters);
  }
  static getLogger(t) {
    const r = this.registry;
    return r.loggers.has(t) || r.loggers.set(t, new f(t, { ...r.config })), r.loggers.get(t);
  }
}
export {
  R as ConsoleAdapter,
  s as LogLevel,
  f as Logger,
  p as LoggerFactory
};
