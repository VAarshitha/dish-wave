import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useSuspenseQuery, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as confetti } from "../_libs/canvas-confetti.mjs";
import { A as AppHeader } from "./AppHeader-DWMiTBOw.mjs";
import { d as Route$5, o as orderQuery, C as CUSTOMER_PROGRESS, S as STATUS_LABELS, r as restaurantQuery } from "./router-BEfqKPEM.mjs";
import { f as formatCurrency } from "./format-B1uvLlm3.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { n as CircleCheck, B as Bell, a as Sparkles, F as Flame, h as ChefHat, o as ClipboardCheck, p as MapPin, V as Volume2 } from "../_libs/lucide-react.mjs";
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
const STAGE_META = {
  pending_payment: {
    label: "Awaiting payment",
    icon: ClipboardCheck,
    tip: "Complete UPI payment to start."
  },
  payment_submitted: {
    label: "Verifying payment",
    icon: ClipboardCheck,
    tip: "Restaurant is confirming your payment…"
  },
  payment_verified: {
    label: "Order received",
    icon: CircleCheck,
    tip: "We've got your order. Hold tight."
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    tip: "Our chefs are gathering ingredients."
  },
  cooking: {
    label: "Cooking",
    icon: Flame,
    tip: "Sizzling on the grill right now."
  },
  quality_check: {
    label: "Quality check",
    icon: Sparkles,
    tip: "Final taste & temperature check."
  },
  ready: {
    label: "Ready for pickup",
    icon: Bell,
    tip: "Walk to the counter — your feast is hot!"
  },
  completed: {
    label: "Completed",
    icon: CircleCheck,
    tip: "Enjoy your meal."
  },
  cancelled: {
    label: "Cancelled",
    icon: CircleCheck,
    tip: ""
  }
};
const COOKING_TIPS = ["Did you know? Our chicken is marinated for 12 hours.", "Tip: every batch is freshly cooked — never reheated.", "Our peri peri is hand-blended in small batches.", "Hot food tastes better. We promise it'll be worth the wait.", "Fun fact: Albaik means 'the best' in Arabic. Coincidence? We think not.", "Our oil is filtered every 4 hours for that perfect crunch."];
function OrderPage() {
  const {
    orderId
  } = Route$5.useParams();
  const {
    data: restaurant
  } = useSuspenseQuery(restaurantQuery);
  const {
    refetch
  } = useQuery(orderQuery(orderId));
  const {
    data
  } = useSuspenseQuery(orderQuery(orderId));
  const {
    order,
    items
  } = data;
  reactExports.useEffect(() => {
    const ch = supabase.channel(`order-${orderId}`).on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "orders",
      filter: `id=eq.${orderId}`
    }, () => refetch()).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [orderId, refetch]);
  reactExports.useEffect(() => {
    if (order.status === "ready") {
      try {
        navigator.vibrate?.([200, 80, 200, 80, 200]);
      } catch {
      }
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.value = 0.05;
        o.start();
        o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18);
        g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + 0.45);
        o.stop(ctx.currentTime + 0.5);
      } catch {
      }
      confetti({
        particleCount: 140,
        spread: 90,
        origin: {
          y: 0.3
        },
        colors: ["#f5c54a", "#ff7a45", "#ffe2a8", "#7dd3a8"]
      });
      setTimeout(() => confetti({
        particleCount: 80,
        spread: 120,
        origin: {
          y: 0.4
        }
      }), 300);
    }
  }, [order.status]);
  const currentIdx = CUSTOMER_PROGRESS.indexOf(order.status);
  const isReady = order.status === "ready" || order.status === "completed";
  const stepsLeft = Math.max(0, CUSTOMER_PROGRESS.length - 1 - currentIdx);
  const etaMin = Math.max(2, stepsLeft * 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden pb-16", children: [
    !isReady && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-blob", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl animate-blob", style: {
        animationDelay: "4s"
      }, "aria-hidden": true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, { title: `Order #${order.order_number}`, subtitle: order.table_label ?? "Self pickup", showCart: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-md px-5 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isReady ? /* @__PURE__ */ jsxRuntimeExports.jsx(ReadyCelebration, { orderNumber: order.order_number, pickupInstructions: restaurant.pickup_instructions ?? "", tableLabel: order.table_label ?? "the counter" }, "ready") : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        scale: 0.96
      }, transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }, className: "relative overflow-hidden rounded-[28px] border border-glass-border bg-[var(--gradient-card)] p-6 text-center shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CurrentStageCard, { status: order.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/[0.04] px-3.5 py-1.5 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold tabular-nums", children: [
            "~",
            etaMin,
            " min"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "estimated" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-2.5 text-left", children: CUSTOMER_PROGRESS.map((s, i) => {
          const Meta = STAGE_META[s];
          const done = i < currentIdx;
          const active = i === currentIdx;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, initial: false, animate: {
            scale: active ? 1.01 : 1
          }, transition: {
            type: "spring",
            damping: 22,
            stiffness: 320
          }, className: `flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-sm transition-colors duration-300 ${active ? "border-primary/50 bg-primary/10 shadow-glow" : done ? "border-success/30 bg-success/5" : "border-glass-border bg-white/[0.02]"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `relative flex h-8 w-8 flex-none items-center justify-center rounded-full ${done ? "gradient-success-bg text-success-foreground" : active ? "gradient-primary-bg text-primary-foreground" : "bg-white/5 text-muted-foreground"}`, children: [
              active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" }),
              done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Meta.icon, { className: "h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-1 ${active ? "font-semibold" : done ? "text-muted-foreground line-through" : ""}`, children: STATUS_LABELS[s] }),
            active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-primary", children: "Now" })
          ] }, s);
        }) })
      ] }, "progress") }),
      !isReady && currentIdx >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(CookingTip, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-3xl border border-glass-border bg-white/[0.03] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Your order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              it.qty,
              "× ",
              it.name_snapshot
            ] }),
            it.addons?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block truncate text-[11px] text-muted-foreground", children: [
              "+ ",
              it.addons.map((a) => a.name).join(", ")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground tabular-nums", children: formatCurrency(Number(it.line_total)) })
        ] }, it.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-between border-t border-glass-border pt-3 text-base font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatCurrency(Number(order.total), restaurant.currency_symbol) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", className: "mt-5 block text-center text-xs text-muted-foreground transition hover:text-foreground", children: "Order something else →" })
    ] })
  ] });
}
function CurrentStageCard({
  status
}) {
  const Meta = STAGE_META[status];
  const Icon = Meta.icon;
  const isCooking = status === "cooking" || status === "preparing";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto inline-flex h-28 w-28 items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring", style: {
        animationDelay: "0.6s"
      } }),
      isCooking && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/60 blur-sm animate-steam" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 left-1/3 h-1.5 w-1.5 rounded-full bg-white/40 blur-sm animate-steam", style: {
          animationDelay: "0.8s"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 right-1/3 h-1.5 w-1.5 rounded-full bg-white/40 blur-sm animate-steam", style: {
          animationDelay: "1.6s"
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { animate: isCooking ? {
        rotate: [0, -6, 6, -4, 4, 0]
      } : {
        y: [0, -6, 0]
      }, transition: {
        duration: isCooking ? 1.4 : 3,
        repeat: Infinity,
        ease: "easeInOut"
      }, className: "relative inline-flex h-24 w-24 items-center justify-center rounded-full gradient-primary-bg shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-10 w-10 text-primary-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h2, { initial: {
      opacity: 0,
      y: 6
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mt-6 text-2xl font-bold tracking-tight", children: Meta.label }, status),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, transition: {
      delay: 0.15
    }, className: "mt-2 text-sm text-muted-foreground", children: Meta.tip }, `${status}-tip`)
  ] });
}
function CookingTip() {
  const [idx, setIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % COOKING_TIPS.length), 4500);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0,
    y: 10
  }, animate: {
    opacity: 1,
    y: 0
  }, className: "mt-4 overflow-hidden rounded-2xl border border-glass-border bg-white/[0.03] px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mt-0.5 h-3.5 w-3.5 flex-none text-primary animate-sparkle" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      y: -8
    }, transition: {
      duration: 0.4
    }, className: "text-[12px] leading-relaxed text-muted-foreground", children: COOKING_TIPS[idx] }, idx) })
  ] }) });
}
function ReadyCelebration({
  orderNumber,
  pickupInstructions,
  tableLabel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    scale: 0.85,
    opacity: 0
  }, animate: {
    scale: 1,
    opacity: 1
  }, transition: {
    type: "spring",
    damping: 18,
    stiffness: 220
  }, className: "relative overflow-hidden rounded-[28px] border-2 p-8 text-center shadow-glow-success", style: {
    borderColor: "var(--success)",
    background: "var(--gradient-success)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 shine-overlay" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto inline-flex h-32 w-32 items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-white/30 animate-pulse-ring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-white/20 animate-pulse-ring", style: {
        animationDelay: "0.6s"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { animate: {
        rotate: [0, -14, 14, -10, 10, 0]
      }, transition: {
        duration: 1.1,
        repeat: Infinity,
        ease: "easeInOut"
      }, className: "relative inline-flex h-28 w-28 items-center justify-center rounded-full bg-white text-success shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-12 w-12" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs font-bold uppercase tracking-[0.24em] text-success-foreground/85", children: "Ready for pickup" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.p, { initial: {
      scale: 0.6,
      opacity: 0
    }, animate: {
      scale: 1,
      opacity: 1
    }, transition: {
      delay: 0.2,
      type: "spring",
      damping: 14
    }, className: "mt-2 text-7xl font-black leading-none tracking-tight text-success-foreground", children: [
      "#",
      orderNumber
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-success-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
      " ",
      tableLabel
    ] }),
    pickupInstructions && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm leading-relaxed text-success-foreground/90", children: pickupInstructions }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/menu", className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-success shadow-elevated transition active:scale-[0.98]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" }),
      "Collect your order"
    ] })
  ] });
}
export {
  OrderPage as component
};
