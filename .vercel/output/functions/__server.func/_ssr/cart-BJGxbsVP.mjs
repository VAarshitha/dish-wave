import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppHeader } from "./AppHeader-DWMiTBOw.mjs";
import { a as useCart, u as useTable, c as cartTotal, r as removeLine, d as updateQty, l as lineTotal, e as clearCart } from "./cart-Chd1RMsz.mjs";
import { f as formatCurrency } from "./format-B1uvLlm3.mjs";
import { r as restaurantQuery, m as menuItemsQuery, D as DEMO_RESTAURANT_ID } from "./router-BEfqKPEM.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { c as ShoppingBag, C as Clock, e as Trash2, M as Minus, P as Plus, f as Tag, X, g as ShieldCheck, A as ArrowRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const TAX_RATE = 0.05;
const COUPONS = {
  ALBAIK10: {
    off: 0.1,
    label: "10% off your meal"
  },
  WELCOME20: {
    off: 0.2,
    label: "Welcome — 20% off"
  }
};
function CartPage() {
  const cart = useCart();
  const {
    data: restaurant
  } = useSuspenseQuery(restaurantQuery);
  const {
    data: items
  } = useSuspenseQuery(menuItemsQuery);
  const table = useTable();
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [coupon, setCoupon] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState(null);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const subtotal = cartTotal(cart.lines);
  const discount = appliedCoupon ? subtotal * (COUPONS[appliedCoupon]?.off ?? 0) : 0;
  const taxableBase = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableBase * TAX_RATE * 100) / 100;
  const total = Math.round((taxableBase + tax) * 100) / 100;
  const prepTime = reactExports.useMemo(() => {
    if (cart.lines.length === 0) return 0;
    const map = new Map(items.map((i) => [i.id, i.prep_time_min]));
    return Math.max(...cart.lines.map((l) => map.get(l.itemId) ?? 12), 8);
  }, [cart.lines, items]);
  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setErr(null);
    } else if (code) {
      setErr("Invalid coupon code");
    }
  }
  async function placeOrder() {
    if (cart.lines.length === 0) return;
    setSubmitting(true);
    setErr(null);
    try {
      const {
        data: order,
        error
      } = await supabase.from("orders").insert({
        restaurant_id: DEMO_RESTAURANT_ID,
        table_id: table?.id ?? null,
        table_label: table?.label ?? null,
        customer_name: name || null,
        customer_phone: phone || null,
        subtotal,
        tax,
        total,
        status: "pending_payment",
        payment_status: "pending"
      }).select("id").single();
      if (error || !order) throw error ?? new Error("Order failed");
      const rows = cart.lines.map((l) => ({
        order_id: order.id,
        item_id: l.itemId,
        name_snapshot: l.name,
        price_snapshot: l.price,
        qty: l.qty,
        addons: l.addons,
        special_instructions: l.specialInstructions ?? null,
        line_total: lineTotal(l)
      }));
      const {
        error: itemsErr
      } = await supabase.from("order_items").insert(rows);
      if (itemsErr) throw itemsErr;
      clearCart();
      navigate({
        to: "/pay/$orderId",
        params: {
          orderId: order.id
        }
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, { title: "Your cart", subtitle: table?.label ?? "Self pickup", backTo: "/menu", showCart: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 pt-5", children: cart.lines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mt-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto inline-flex h-24 w-24 items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-primary/15 animate-pulse-ring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] text-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-8 w-8 text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base font-semibold", children: "Your cart is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Pick something delicious from the menu." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", className: "mt-6 inline-flex rounded-full gradient-primary-bg px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow", children: "Browse menu" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 8
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "mb-3 flex items-center gap-3 rounded-2xl border border-glass-border bg-white/[0.03] px-3.5 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-8 w-8 flex-none items-center justify-center rounded-full gradient-primary-bg text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold", children: [
            "Ready in ~",
            prepTime,
            " min"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            "Self pickup · ",
            table?.label ?? "at the counter"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: cart.lines.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        x: -60,
        scale: 0.95
      }, transition: {
        type: "spring",
        damping: 26,
        stiffness: 320
      }, className: "flex gap-3 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-3 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 flex-none overflow-hidden rounded-2xl bg-muted", children: l.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: l.imageUrl, alt: "", className: "h-full w-full object-cover" }) : null }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: l.name }),
              l.addons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 line-clamp-1 text-[11px] text-muted-foreground", children: [
                "+ ",
                l.addons.map((a) => a.name).join(", ")
              ] }),
              l.specialInstructions && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 line-clamp-1 text-[11px] italic text-muted-foreground", children: [
                '"',
                l.specialInstructions,
                '"'
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeLine(l.key), "aria-label": "Remove", className: "inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-0.5 rounded-full bg-white/5 p-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQty(l.key, -1), className: "inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90", "aria-label": "Decrease", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { initial: {
                scale: 0.7,
                opacity: 0.5
              }, animate: {
                scale: 1,
                opacity: 1
              }, transition: {
                type: "spring",
                damping: 18,
                stiffness: 360
              }, className: "w-5 text-center text-xs font-semibold tabular-nums", children: l.qty }, l.qty),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQty(l.key, 1), className: "inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90", "aria-label": "Increase", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { initial: {
              y: -4,
              opacity: 0.5
            }, animate: {
              y: 0,
              opacity: 1
            }, className: "text-sm font-semibold tabular-nums", children: formatCurrency(lineTotal(l)) }, lineTotal(l))
          ] })
        ] })
      ] }, l.key)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 8
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "mt-5 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" }),
          " Apply coupon"
        ] }),
        appliedCoupon ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between rounded-2xl border border-success/40 bg-success/10 px-3.5 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-success", children: [
              appliedCoupon,
              " applied"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-success/80", children: COUPONS[appliedCoupon].label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setAppliedCoupon(null);
            setCoupon("");
          }, className: "inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/5", "aria-label": "Remove coupon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: coupon, onChange: (e) => setCoupon(e.target.value), placeholder: "Try ALBAIK10", className: "flex-1 rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2.5 text-sm uppercase placeholder:text-muted-foreground/60 placeholder:normal-case focus:border-primary/50 focus:outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: applyCoupon, className: "rounded-xl border border-glass-border bg-white/[0.05] px-4 text-sm font-semibold transition hover:bg-white/[0.08]", children: "Apply" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Your details (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name", className: "w-full rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value), inputMode: "tel", placeholder: "Phone number", className: "w-full rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Bill summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Subtotal", value: formatCurrency(subtotal, restaurant.currency_symbol) }),
          discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: `Discount (${appliedCoupon})`, value: `− ${formatCurrency(discount, restaurant.currency_symbol)}`, accent: "success" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "GST (5%)", value: formatCurrency(tax, restaurant.currency_symbol), muted: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 border-t border-glass-border pt-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { initial: {
              y: -4,
              opacity: 0.5
            }, animate: {
              y: 0,
              opacity: 1
            }, className: "text-xl font-bold tabular-nums tracking-tight", children: formatCurrency(total, restaurant.currency_symbol) }, total)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3 text-success" }),
          "Secured by UPI · No commission, no service charge"
        ] })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-destructive", children: err })
    ] }) }),
    cart.lines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      y: 80,
      opacity: 0
    }, animate: {
      y: 0,
      opacity: 1
    }, transition: {
      type: "spring",
      damping: 24,
      stiffness: 280
    }, className: "fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { onClick: placeOrder, whileTap: {
      scale: 0.97
    }, disabled: submitting, className: "relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-full gradient-primary-bg px-6 py-4 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatCurrency(total) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
        submitting ? "Placing order…" : "Continue to UPI payment",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }) }) })
  ] });
}
function Row({
  label,
  value,
  muted,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: muted ? "text-muted-foreground" : "", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tabular-nums ${accent === "success" ? "text-success" : muted ? "text-muted-foreground" : ""}`, children: value })
  ] });
}
export {
  CartPage as component
};
