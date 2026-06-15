import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { D as DEMO_RESTAURANT_ID } from "./router-BEfqKPEM.mjs";
import { f as formatCurrency } from "./format-B1uvLlm3.mjs";
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
function AdminMenu() {
  const qc = useQueryClient();
  const {
    data: items = []
  } = useQuery({
    queryKey: ["admin", "menu"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("menu_items").select("id,name,price,is_available,is_bestseller,is_veg,category_id").eq("restaurant_id", DEMO_RESTAURANT_ID).order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  async function toggleAvailable(id, current) {
    await supabase.from("menu_items").update({
      is_available: !current
    }).eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin", "menu"]
    });
    qc.invalidateQueries({
      queryKey: ["menu_items", DEMO_RESTAURANT_ID]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Menu" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Toggle items in or out of stock instantly." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border border-glass-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/[0.03] text-left text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Item" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Tags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Available" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-glass-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: i.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: formatCurrency(Number(i.price)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: [
          i.is_bestseller ? "★ Best · " : "",
          i.is_veg ? "Veg" : "Non-veg"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleAvailable(i.id, i.is_available), className: `rounded-full px-3 py-1 text-xs font-semibold ${i.is_available ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`, children: i.is_available ? "In stock" : "Out of stock" }) })
      ] }, i.id)) })
    ] }) })
  ] });
}
export {
  AdminMenu as component
};
