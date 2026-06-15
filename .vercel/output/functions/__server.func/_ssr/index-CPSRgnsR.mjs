import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { h as ChefHat, a as Sparkles, j as Table2 } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const heroImg = "/assets/hero-chicken-B6e23nDv.jpg";
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto flex min-h-screen max-w-4xl flex-col px-5 pb-12 pt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-8 w-8 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4" }) }),
          "Albaik"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "rounded-full border border-glass-border bg-white/[0.04] px-4 py-2 text-xs text-muted-foreground transition hover:text-foreground", children: "Staff sign in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mt-10 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.6
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
            "Premium QR Ordering"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 text-5xl font-bold leading-tight sm:text-6xl", children: [
            "Scan Once.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary", children: "Choose Your Table." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xl text-base text-muted-foreground", children: "Browse the menu, pay instantly with any UPI app, then pick up your order when it's ready. Fast, simple and completely contactless." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          scale: 0.97
        }, animate: {
          opacity: 1,
          scale: 1
        }, transition: {
          delay: 0.2,
          duration: 0.6
        }, className: "relative mt-10 overflow-hidden rounded-3xl border border-glass-border shadow-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "Albaik", width: 1536, height: 1024, fetchPriority: "high", className: "aspect-[16/9] w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: "Welcome to Albaik" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Please select your table to begin ordering." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0
        }, animate: {
          opacity: 1
        }, transition: {
          delay: 0.35
        }, className: "mt-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Select Your Table" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Choose the table you're currently sitting at." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0
        }, animate: {
          opacity: 1
        }, transition: {
          delay: 0.45
        }, className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5", children: Array.from({
          length: 20
        }, (_, i) => i + 1).map((table) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/t/$qr", params: {
          qr: `albaik-t${table}`
        }, className: "group rounded-2xl border border-glass-border bg-white/[0.04] p-5 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Table2, { className: "mx-auto h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-base font-semibold", children: [
            "Table ",
            table
          ] })
        ] }, table)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-4 sm:grid-cols-3", children: [["Choose Table", "Select your table before placing an order."], ["Pay with UPI", "PhonePe, Google Pay, Paytm and any UPI app."], ["Live Order Tracking", "Track your food preparation in real time."]].map(([title, desc]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-glass-border bg-white/[0.03] p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: desc })
        ] }, title)) })
      ] })
    ] })
  ] });
}
export {
  Landing as component
};
