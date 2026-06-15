import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { S as STATUS_LABELS, K as KITCHEN_STATUS_FLOW } from "./router-BEfqKPEM.mjs";
import { r as relativeTime, f as formatCurrency } from "./format-B1uvLlm3.mjs";
import { h as ChefHat, q as LogOut, B as Bell, r as ChevronRight } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
function KitchenPage() {
  const qc = useQueryClient();
  const {
    data: orders = []
  } = useQuery({
    queryKey: ["kitchen", "orders"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("orders").select("id,order_number,table_label,total,status,created_at").in("status", ["payment_verified", "preparing", "cooking", "quality_check", "ready"]).order("created_at");
      if (error) throw error;
      return data ?? [];
    }
  });
  const orderIds = orders.map((o) => o.id);
  const {
    data: items = []
  } = useQuery({
    queryKey: ["kitchen", "items", orderIds.join(",")],
    queryFn: async () => {
      if (orderIds.length === 0) return [];
      const {
        data,
        error
      } = await supabase.from("order_items").select("id,order_id,name_snapshot,qty").in("order_id", orderIds);
      if (error) throw error;
      return data ?? [];
    },
    enabled: orderIds.length > 0
  });
  reactExports.useEffect(() => {
    const ch = supabase.channel("kitchen-feed").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "orders"
    }, () => qc.invalidateQueries({
      queryKey: ["kitchen", "orders"]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  async function advance(id, status) {
    const idx = KITCHEN_STATUS_FLOW.indexOf(status);
    const next = KITCHEN_STATUS_FLOW[idx + 1] ?? status;
    const patch = {
      status: next
    };
    if (next === "ready") patch.ready_at = (/* @__PURE__ */ new Date()).toISOString();
    if (next === "completed") patch.completed_at = (/* @__PURE__ */ new Date()).toISOString();
    await supabase.from("orders").update(patch).eq("id", id);
    qc.invalidateQueries({
      queryKey: ["kitchen", "orders"]
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }
  const columns = [{
    key: "payment_verified",
    label: "New"
  }, {
    key: "preparing",
    label: "Preparing"
  }, {
    key: "cooking",
    label: "Cooking"
  }, {
    key: "quality_check",
    label: "QC"
  }, {
    key: "ready",
    label: "Ready"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 glass-strong", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-7 w-7 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4" }) }),
        "Kitchen Display"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/_authenticated/admin", className: "ml-auto rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]", children: "Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
        " Sign out"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-7xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-3 xl:grid-cols-5", children: columns.map((col) => {
      const colOrders = orders.filter((o) => o.status === col.key);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: col.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-white/5 px-2 py-0.5 text-[11px]", children: colOrders.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: colOrders.map((o) => {
          const orderItems = items.filter((i) => i.order_id === o.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, initial: {
            opacity: 0,
            y: 8
          }, animate: {
            opacity: 1,
            y: 0
          }, exit: {
            opacity: 0,
            scale: 0.95
          }, className: `rounded-2xl border p-3 ${col.key === "ready" ? "border-success/40 bg-success/10 shadow-glow" : "border-glass-border bg-[var(--gradient-card)]"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold", children: [
                "#",
                o.order_number
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: relativeTime(o.created_at) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
              o.table_label ?? "—",
              " · ",
              formatCurrency(Number(o.total))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1 text-sm", children: orderItems.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                it.qty,
                "×"
              ] }),
              " ",
              it.name_snapshot
            ] }, it.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => advance(o.id, o.status), className: `mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${col.key === "ready" ? "gradient-success-bg text-success-foreground" : "gradient-primary-bg text-primary-foreground shadow-glow"}`, children: col.key === "ready" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3 w-3" }),
              " Picked up"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Next: ",
              STATUS_LABELS[KITCHEN_STATUS_FLOW[KITCHEN_STATUS_FLOW.indexOf(o.status) + 1]],
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
            ] }) })
          ] }, o.id);
        }) })
      ] }, col.key);
    }) }) })
  ] });
}
export {
  KitchenPage as component
};
