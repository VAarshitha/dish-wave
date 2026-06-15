import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { r as relativeTime, f as formatCurrency } from "./format-B1uvLlm3.mjs";
import { S as STATUS_LABELS } from "./router-BEfqKPEM.mjs";
import { C as Clock, n as CircleCheck, v as CircleX } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-router.mjs";
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
function AdminOrders() {
  const qc = useQueryClient();
  const {
    data: orders = [],
    isLoading
  } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("orders").select("id,order_number,table_label,customer_name,total,status,payment_status,created_at").order("created_at", {
        ascending: false
      }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 5e3
  });
  reactExports.useEffect(() => {
    const ch = supabase.channel("admin-orders").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "orders"
    }, () => qc.invalidateQueries({
      queryKey: ["admin", "orders"]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  async function verifyPayment(id) {
    await supabase.from("orders").update({
      payment_status: "verified",
      payment_verified_at: (/* @__PURE__ */ new Date()).toISOString(),
      status: "payment_verified"
    }).eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin", "orders"]
    });
  }
  async function rejectPayment(id) {
    await supabase.from("orders").update({
      payment_status: "failed",
      status: "cancelled"
    }).eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin", "orders"]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex items-end justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Verify payments and track every order in real time." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }),
      orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 rounded-2xl border border-glass-border bg-[var(--gradient-card)] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[7rem]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-bold", children: [
            "#",
            o.order_number
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mr-0.5 inline h-3 w-3" }),
            " ",
            relativeTime(o.created_at)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[10rem]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Table" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: o.table_label ?? "—" }),
          o.customer_name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: o.customer_name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[7rem]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: formatCurrency(Number(o.total)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[10rem]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-white/5 px-2 py-0.5 text-[11px]", children: STATUS_LABELS[o.status] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-2", children: o.payment_status === "submitted" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => verifyPayment(o.id), className: "inline-flex items-center gap-1 rounded-full gradient-success-bg px-3 py-1.5 text-xs font-semibold text-success-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            " Verify payment"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => rejectPayment(o.id), className: "inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
            " Reject"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2 py-0.5 text-[11px] ${o.payment_status === "verified" ? "bg-success/15 text-success" : o.payment_status === "failed" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"}`, children: o.payment_status }) })
      ] }, o.id)),
      !isLoading && orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-12 text-center text-sm text-muted-foreground", children: "No orders yet." })
    ] })
  ] });
}
export {
  AdminOrders as component
};
