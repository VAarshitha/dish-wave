import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppHeader } from "./AppHeader-DWMiTBOw.mjs";
import { b as Route$6, r as restaurantQuery, o as orderQuery } from "./router-BEfqKPEM.mjs";
import { f as formatCurrency } from "./format-B1uvLlm3.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { k as Smartphone, l as Check, m as Copy, g as ShieldCheck, i as LoaderCircle, n as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "./cart-Chd1RMsz.mjs";
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
function buildUpiUrl(opts) {
  const params = new URLSearchParams({
    pa: opts.payeeVpa,
    pn: opts.payeeName,
    am: opts.amount.toFixed(2),
    cu: "INR",
    tn: opts.note
  });
  if (opts.txnRef) params.set("tr", opts.txnRef);
  return `upi://pay?${params.toString()}`;
}
function PayPage() {
  const {
    orderId
  } = Route$6.useParams();
  const {
    data: restaurant
  } = useSuspenseQuery(restaurantQuery);
  const {
    data: {
      order
    }
  } = useSuspenseQuery(orderQuery(orderId));
  const navigate = useNavigate();
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [opened, setOpened] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const upiUrl = restaurant.upi_id ? buildUpiUrl({
    payeeVpa: restaurant.upi_id,
    payeeName: restaurant.upi_payee_name ?? restaurant.name,
    amount: Number(order.total),
    note: `Order #${order.order_number}`,
    txnRef: `ORD${order.order_number}`
  }) : null;
  async function confirmPayment() {
    setSubmitting(true);
    await supabase.from("orders").update({
      status: "payment_submitted",
      payment_status: "submitted",
      payment_submitted_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", orderId);
    navigate({
      to: "/order/$orderId",
      params: {
        orderId
      }
    });
  }
  function copyUpi() {
    if (!restaurant.upi_id) return;
    navigator.clipboard?.writeText(restaurant.upi_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl animate-blob", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, { title: "Complete payment", subtitle: `Order #${order.order_number}`, showCart: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-md px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }, className: "relative overflow-hidden rounded-[28px] border border-glass-border bg-[var(--gradient-card)] p-7 text-center shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto inline-flex h-20 w-20 items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { animate: {
            y: [0, -4, 0]
          }, transition: {
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut"
          }, className: "relative inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary-bg shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-7 w-7 text-primary-foreground" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground", children: "Amount to pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
          scale: 0.85,
          opacity: 0
        }, animate: {
          scale: 1,
          opacity: 1
        }, transition: {
          delay: 0.15,
          type: "spring",
          damping: 18
        }, className: "mt-1 text-5xl font-black tracking-tight tabular-nums", children: formatCurrency(Number(order.total), restaurant.currency_symbol) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: copyUpi, className: "mt-4 inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs font-medium transition hover:bg-white/[0.08]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Pay to" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: restaurant.upi_id ?? "—" }),
          copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3 text-muted-foreground" })
        ] }),
        upiUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.a, { href: upiUrl, onClick: () => setOpened(true), whileTap: {
          scale: 0.97
        }, className: "relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full gradient-primary-bg px-5 py-4 text-sm font-semibold text-primary-foreground shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }),
          "Pay with UPI app"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-destructive", children: "UPI not configured. Ask the restaurant to set their UPI ID." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3 text-success" }),
          "PhonePe · Google Pay · Paytm · BHIM"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 8
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.1
      }, className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: confirmPayment, disabled: submitting, className: `flex w-full items-center justify-center gap-2 rounded-full border py-3.5 text-sm font-semibold transition disabled:opacity-60 ${opened ? "border-success/50 bg-success/10 text-success hover:bg-success/15 shadow-glow-success" : "border-glass-border bg-white/[0.05] hover:bg-white/[0.08]"}`, children: [
          submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: `h-4 w-4 ${opened ? "text-success" : ""}` }),
          "I've completed payment"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-[11px] text-muted-foreground", children: "The restaurant will verify your payment before preparing the order." })
      ] })
    ] })
  ] });
}
export {
  PayPage as component
};
