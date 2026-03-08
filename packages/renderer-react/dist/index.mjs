var pr = Object.defineProperty;
var hr = (s, o, l) => o in s ? pr(s, o, { enumerable: !0, configurable: !0, writable: !0, value: l }) : s[o] = l;
var X = (s, o, l) => hr(s, typeof o != "symbol" ? o + "" : o, l);
import Se, { createContext as gr, useRef as yr, useEffect as Oe, useState as Pe, useContext as mr } from "react";
import { createRoot as Er } from "react-dom/client";
var Z = { exports: {} }, $ = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Te;
function Rr() {
  if (Te) return $;
  Te = 1;
  var s = Se, o = Symbol.for("react.element"), l = Symbol.for("react.fragment"), f = Object.prototype.hasOwnProperty, d = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, x = { key: !0, ref: !0, __self: !0, __source: !0 };
  function _(b, h, T) {
    var g, E = {}, O = null, Y = null;
    T !== void 0 && (O = "" + T), h.key !== void 0 && (O = "" + h.key), h.ref !== void 0 && (Y = h.ref);
    for (g in h) f.call(h, g) && !x.hasOwnProperty(g) && (E[g] = h[g]);
    if (b && b.defaultProps) for (g in h = b.defaultProps, h) E[g] === void 0 && (E[g] = h[g]);
    return { $$typeof: o, type: b, key: O, ref: Y, props: E, _owner: d.current };
  }
  return $.Fragment = l, $.jsx = _, $.jsxs = _, $;
}
var W = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var we;
function br() {
  return we || (we = 1, process.env.NODE_ENV !== "production" && function() {
    var s = Se, o = Symbol.for("react.element"), l = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), _ = Symbol.for("react.provider"), b = Symbol.for("react.context"), h = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), g = Symbol.for("react.suspense_list"), E = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), Y = Symbol.for("react.offscreen"), Q = Symbol.iterator, ke = "@@iterator";
    function De(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = Q && e[Q] || e[ke];
      return typeof r == "function" ? r : null;
    }
    var k = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function y(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
          t[n - 1] = arguments[n];
        Fe("error", e, t);
      }
    }
    function Fe(e, r, t) {
      {
        var n = k.ReactDebugCurrentFrame, u = n.getStackAddendum();
        u !== "" && (r += "%s", t = t.concat([u]));
        var c = t.map(function(i) {
          return String(i);
        });
        c.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, c);
      }
    }
    var Ae = !1, Ie = !1, $e = !1, We = !1, Ye = !1, ee;
    ee = Symbol.for("react.module.reference");
    function Me(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === f || e === x || Ye || e === d || e === T || e === g || We || e === Y || Ae || Ie || $e || typeof e == "object" && e !== null && (e.$$typeof === O || e.$$typeof === E || e.$$typeof === _ || e.$$typeof === b || e.$$typeof === h || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ee || e.getModuleId !== void 0));
    }
    function Le(e, r, t) {
      var n = e.displayName;
      if (n)
        return n;
      var u = r.displayName || r.name || "";
      return u !== "" ? t + "(" + u + ")" : t;
    }
    function re(e) {
      return e.displayName || "Context";
    }
    function w(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && y("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case f:
          return "Fragment";
        case l:
          return "Portal";
        case x:
          return "Profiler";
        case d:
          return "StrictMode";
        case T:
          return "Suspense";
        case g:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case b:
            var r = e;
            return re(r) + ".Consumer";
          case _:
            var t = e;
            return re(t._context) + ".Provider";
          case h:
            return Le(e, e.render, "ForwardRef");
          case E:
            var n = e.displayName || null;
            return n !== null ? n : w(e.type) || "Memo";
          case O: {
            var u = e, c = u._payload, i = u._init;
            try {
              return w(i(c));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var P = Object.assign, A = 0, te, ne, ae, oe, ie, se, ue;
    function le() {
    }
    le.__reactDisabledLog = !0;
    function Ue() {
      {
        if (A === 0) {
          te = console.log, ne = console.info, ae = console.warn, oe = console.error, ie = console.group, se = console.groupCollapsed, ue = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: le,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        A++;
      }
    }
    function Ve() {
      {
        if (A--, A === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: P({}, e, {
              value: te
            }),
            info: P({}, e, {
              value: ne
            }),
            warn: P({}, e, {
              value: ae
            }),
            error: P({}, e, {
              value: oe
            }),
            group: P({}, e, {
              value: ie
            }),
            groupCollapsed: P({}, e, {
              value: se
            }),
            groupEnd: P({}, e, {
              value: ue
            })
          });
        }
        A < 0 && y("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var N = k.ReactCurrentDispatcher, B;
    function M(e, r, t) {
      {
        if (B === void 0)
          try {
            throw Error();
          } catch (u) {
            var n = u.stack.trim().match(/\n( *(at )?)/);
            B = n && n[1] || "";
          }
        return `
` + B + e;
      }
    }
    var J = !1, L;
    {
      var Ne = typeof WeakMap == "function" ? WeakMap : Map;
      L = new Ne();
    }
    function ce(e, r) {
      if (!e || J)
        return "";
      {
        var t = L.get(e);
        if (t !== void 0)
          return t;
      }
      var n;
      J = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var c;
      c = N.current, N.current = null, Ue();
      try {
        if (r) {
          var i = function() {
            throw Error();
          };
          if (Object.defineProperty(i.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(i, []);
            } catch (R) {
              n = R;
            }
            Reflect.construct(e, [], i);
          } else {
            try {
              i.call();
            } catch (R) {
              n = R;
            }
            e.call(i.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (R) {
            n = R;
          }
          e();
        }
      } catch (R) {
        if (R && n && typeof R.stack == "string") {
          for (var a = R.stack.split(`
`), m = n.stack.split(`
`), v = a.length - 1, p = m.length - 1; v >= 1 && p >= 0 && a[v] !== m[p]; )
            p--;
          for (; v >= 1 && p >= 0; v--, p--)
            if (a[v] !== m[p]) {
              if (v !== 1 || p !== 1)
                do
                  if (v--, p--, p < 0 || a[v] !== m[p]) {
                    var C = `
` + a[v].replace(" at new ", " at ");
                    return e.displayName && C.includes("<anonymous>") && (C = C.replace("<anonymous>", e.displayName)), typeof e == "function" && L.set(e, C), C;
                  }
                while (v >= 1 && p >= 0);
              break;
            }
        }
      } finally {
        J = !1, N.current = c, Ve(), Error.prepareStackTrace = u;
      }
      var F = e ? e.displayName || e.name : "", j = F ? M(F) : "";
      return typeof e == "function" && L.set(e, j), j;
    }
    function Be(e, r, t) {
      return ce(e, !1);
    }
    function Je(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function U(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return ce(e, Je(e));
      if (typeof e == "string")
        return M(e);
      switch (e) {
        case T:
          return M("Suspense");
        case g:
          return M("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case h:
            return Be(e.render);
          case E:
            return U(e.type, r, t);
          case O: {
            var n = e, u = n._payload, c = n._init;
            try {
              return U(c(u), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var I = Object.prototype.hasOwnProperty, fe = {}, de = k.ReactDebugCurrentFrame;
    function V(e) {
      if (e) {
        var r = e._owner, t = U(e.type, e._source, r ? r.type : null);
        de.setExtraStackFrame(t);
      } else
        de.setExtraStackFrame(null);
    }
    function qe(e, r, t, n, u) {
      {
        var c = Function.call.bind(I);
        for (var i in e)
          if (c(e, i)) {
            var a = void 0;
            try {
              if (typeof e[i] != "function") {
                var m = Error((n || "React class") + ": " + t + " type `" + i + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[i] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw m.name = "Invariant Violation", m;
              }
              a = e[i](r, i, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (v) {
              a = v;
            }
            a && !(a instanceof Error) && (V(u), y("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, i, typeof a), V(null)), a instanceof Error && !(a.message in fe) && (fe[a.message] = !0, V(u), y("Failed %s type: %s", t, a.message), V(null));
          }
      }
    }
    var Ke = Array.isArray;
    function q(e) {
      return Ke(e);
    }
    function ze(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function Ge(e) {
      try {
        return ve(e), !1;
      } catch {
        return !0;
      }
    }
    function ve(e) {
      return "" + e;
    }
    function pe(e) {
      if (Ge(e))
        return y("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", ze(e)), ve(e);
    }
    var he = k.ReactCurrentOwner, He = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ge, ye;
    function Xe(e) {
      if (I.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function Ze(e) {
      if (I.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function Qe(e, r) {
      typeof e.ref == "string" && he.current;
    }
    function er(e, r) {
      {
        var t = function() {
          ge || (ge = !0, y("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function rr(e, r) {
      {
        var t = function() {
          ye || (ye = !0, y("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var tr = function(e, r, t, n, u, c, i) {
      var a = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: o,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: i,
        // Record the component responsible for creating this element.
        _owner: c
      };
      return a._store = {}, Object.defineProperty(a._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(a, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: n
      }), Object.defineProperty(a, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: u
      }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
    };
    function nr(e, r, t, n, u) {
      {
        var c, i = {}, a = null, m = null;
        t !== void 0 && (pe(t), a = "" + t), Ze(r) && (pe(r.key), a = "" + r.key), Xe(r) && (m = r.ref, Qe(r, u));
        for (c in r)
          I.call(r, c) && !He.hasOwnProperty(c) && (i[c] = r[c]);
        if (e && e.defaultProps) {
          var v = e.defaultProps;
          for (c in v)
            i[c] === void 0 && (i[c] = v[c]);
        }
        if (a || m) {
          var p = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          a && er(i, p), m && rr(i, p);
        }
        return tr(e, a, m, u, n, he.current, i);
      }
    }
    var K = k.ReactCurrentOwner, me = k.ReactDebugCurrentFrame;
    function D(e) {
      if (e) {
        var r = e._owner, t = U(e.type, e._source, r ? r.type : null);
        me.setExtraStackFrame(t);
      } else
        me.setExtraStackFrame(null);
    }
    var z;
    z = !1;
    function G(e) {
      return typeof e == "object" && e !== null && e.$$typeof === o;
    }
    function Ee() {
      {
        if (K.current) {
          var e = w(K.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function ar(e) {
      return "";
    }
    var Re = {};
    function or(e) {
      {
        var r = Ee();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function be(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = or(r);
        if (Re[t])
          return;
        Re[t] = !0;
        var n = "";
        e && e._owner && e._owner !== K.current && (n = " It was passed a child from " + w(e._owner.type) + "."), D(e), y('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), D(null);
      }
    }
    function _e(e, r) {
      {
        if (typeof e != "object")
          return;
        if (q(e))
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            G(n) && be(n, r);
          }
        else if (G(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var u = De(e);
          if (typeof u == "function" && u !== e.entries)
            for (var c = u.call(e), i; !(i = c.next()).done; )
              G(i.value) && be(i.value, r);
        }
      }
    }
    function ir(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === h || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === E))
          t = r.propTypes;
        else
          return;
        if (t) {
          var n = w(r);
          qe(t, e.props, "prop", n, e);
        } else if (r.PropTypes !== void 0 && !z) {
          z = !0;
          var u = w(r);
          y("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", u || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && y("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function sr(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== "children" && n !== "key") {
            D(e), y("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), D(null);
            break;
          }
        }
        e.ref !== null && (D(e), y("Invalid attribute `ref` supplied to `React.Fragment`."), D(null));
      }
    }
    var Ce = {};
    function xe(e, r, t, n, u, c) {
      {
        var i = Me(e);
        if (!i) {
          var a = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var m = ar();
          m ? a += m : a += Ee();
          var v;
          e === null ? v = "null" : q(e) ? v = "array" : e !== void 0 && e.$$typeof === o ? (v = "<" + (w(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : v = typeof e, y("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", v, a);
        }
        var p = nr(e, r, t, u, c);
        if (p == null)
          return p;
        if (i) {
          var C = r.children;
          if (C !== void 0)
            if (n)
              if (q(C)) {
                for (var F = 0; F < C.length; F++)
                  _e(C[F], e);
                Object.freeze && Object.freeze(C);
              } else
                y("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              _e(C, e);
        }
        if (I.call(r, "key")) {
          var j = w(e), R = Object.keys(r).filter(function(vr) {
            return vr !== "key";
          }), H = R.length > 0 ? "{key: someKey, " + R.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ce[j + H]) {
            var dr = R.length > 0 ? "{" + R.join(": ..., ") + ": ...}" : "{}";
            y(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, H, j, dr, j), Ce[j + H] = !0;
          }
        }
        return e === f ? sr(p) : ir(p), p;
      }
    }
    function ur(e, r, t) {
      return xe(e, r, t, !0);
    }
    function lr(e, r, t) {
      return xe(e, r, t, !1);
    }
    var cr = lr, fr = ur;
    W.Fragment = f, W.jsx = cr, W.jsxs = fr;
  }()), W;
}
process.env.NODE_ENV === "production" ? Z.exports = Rr() : Z.exports = br();
var S = Z.exports;
const je = gr(null), Sr = ({ engine: s, className: o, style: l }) => {
  const f = yr(null);
  return Oe(() => {
    f.current && s.currentDocument && s.render(f.current);
    const d = () => {
      f.current && s.currentDocument && s.render(f.current);
    };
    return s.events.on("engine:ready", d), () => {
      s.events.off("engine:ready", d);
    };
  }, [s]), /* @__PURE__ */ S.jsx(je.Provider, { value: s, children: /* @__PURE__ */ S.jsx(
    "div",
    {
      ref: f,
      className: o,
      style: { width: "100%", height: "100%", ...l }
    }
  ) });
};
function _r(s) {
  const [o, l] = Pe([]);
  return Oe(() => {
    if (!s) return;
    l(s.selection.selected.map((d) => d.id));
    const f = (d) => {
      l(d.selected);
    };
    return s.events.on("selection:change", f), () => {
      s.events.off("selection:change", f);
    };
  }, [s]), o;
}
const Cr = ({ node: s, children: o }) => {
  const l = mr(je), f = _r(l), [d, x] = Pe(!1), _ = f.includes(s.id), b = (E) => {
    E.stopPropagation(), E.preventDefault(), l && l.selection.select(s);
  }, h = (E) => {
    E.stopPropagation(), x(!0);
  }, T = () => {
    x(!1);
  };
  let g = "1px dashed transparent";
  return _ ? g = "2px solid #1890ff" : d && (g = "1px dashed #1890ff"), /* @__PURE__ */ S.jsxs(
    "div",
    {
      className: `lowcode-node-wrapper ${_ ? "selected" : ""}`,
      "data-node-id": s.id,
      onClick: b,
      onMouseEnter: h,
      onMouseLeave: T,
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        outline: g,
        outlineOffset: "-1px",
        // Keep outline inside bounds
        transition: "outline 0.2s",
        cursor: "pointer"
      },
      children: [
        (d || _) && /* @__PURE__ */ S.jsx("div", { style: {
          position: "absolute",
          top: -20,
          left: -1,
          background: "#1890ff",
          color: "white",
          fontSize: "12px",
          padding: "2px 6px",
          borderRadius: "2px 2px 0 0",
          zIndex: 10,
          pointerEvents: "none"
        }, children: s.componentName }),
        /* @__PURE__ */ S.jsx("div", { style: { pointerEvents: "none", height: "100%" }, children: o })
      ]
    }
  );
};
class Or {
  constructor() {
    X(this, "registry", /* @__PURE__ */ new Map());
    X(this, "roots", /* @__PURE__ */ new Map());
  }
  /**
   * Register a React component corresponding to a componentName in the schema
   */
  registerComponent(o, l) {
    this.registry.set(o, l);
  }
  getComponent(o) {
    return this.registry.get(o);
  }
  renderComponent({ componentName: o, props: l, container: f, node: d, mode: x }) {
    const _ = this.getComponent(o);
    if (!_) {
      console.warn(`[ReactRenderClass] Component not found: ${o}`), this.mountElement(
        /* @__PURE__ */ S.jsxs("div", { style: { color: "red", border: "1px solid red", padding: "4px" }, children: [
          "Unknown Component: ",
          o
        ] }),
        f,
        d.id
      );
      return;
    }
    let b = /* @__PURE__ */ S.jsx(_, { ...l });
    x === "edit" && (b = /* @__PURE__ */ S.jsx(Cr, { node: d, children: b })), this.mountElement(b, f, d.id);
  }
  updateComponent(o, l) {
    this.roots.get(o) && console.warn(`[ReactRenderClass] updateComponent not fully implemented yet for node ${o}`);
  }
  destroyComponent(o) {
    const l = this.roots.get(o);
    l && (l.unmount(), this.roots.delete(o));
  }
  mountElement(o, l, f) {
    let d = this.roots.get(f);
    d || (d = Er(l), this.roots.set(f, d)), d.render(o);
  }
}
export {
  je as EngineContext,
  Cr as NodeWrapper,
  Or as ReactRenderClass,
  Sr as Renderer,
  _r as useSelection
};
