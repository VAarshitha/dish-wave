import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, d as useNavigate, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { h as ChefHat, s as LayoutDashboard, U as Utensils, t as Settings, u as SquareKanban, q as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function AdminLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const navigate = useNavigate();
  const tabs = [{
    to: "/_authenticated/admin",
    label: "Orders",
    icon: LayoutDashboard,
    exact: true
  }, {
    to: "/_authenticated/admin/menu",
    label: "Menu",
    icon: Utensils
  }, {
    to: "/_authenticated/admin/settings",
    label: "Settings",
    icon: Settings
  }, {
    to: "/_authenticated/kitchen",
    label: "Kitchen",
    icon: SquareKanban
  }];
  async function signOut() {
    await supabase.auth.signOut();
    navigate({
      to: "/auth"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 glass-strong", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-7 w-7 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4" }) }),
          "Albaik · Admin"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "ml-4 hidden gap-1 sm:flex", children: tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${active ? "bg-primary/15 text-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-3.5 w-3.5" }),
            t.label
          ] }, t.to);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
          " Sign out"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden", children: tabs.map((t) => {
        const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: t.to, className: `flex-none whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${active ? "bg-primary/15 text-foreground" : "text-muted-foreground"}`, children: t.label }, t.to);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-6xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};
