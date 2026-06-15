import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useCart, c as cartTotal } from "./cart-Chd1RMsz.mjs";
import { d as ChevronLeft, c as ShoppingBag } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
function AppHeader({
  title,
  subtitle,
  backTo,
  showCart = true
}) {
  const cart = useCart();
  const count = cart.lines.reduce((s, l) => s + l.qty, 0);
  const total = cartTotal(cart.lines);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 glass-strong", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center gap-3 px-4 py-3", children: [
    backTo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: backTo,
        className: "-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5",
        "aria-label": "Back",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
      }
    ) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate text-base font-semibold leading-tight", children: title }),
      subtitle ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: subtitle }) : null
    ] }),
    showCart && count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/cart",
        className: "inline-flex items-center gap-2 rounded-full gradient-primary-bg px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5" }),
          count,
          " · ₹",
          Math.round(total)
        ]
      }
    ) }) : null
  ] }) });
}
export {
  AppHeader as A
};
