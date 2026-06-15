import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-uawI2o-5.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$d = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$d.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const DEMO_RESTAURANT_ID = "00000000-0000-0000-0000-00000000a1ba";
const restaurantQuery = queryOptions({
  queryKey: ["restaurant", DEMO_RESTAURANT_ID],
  queryFn: async () => {
    const { data, error } = await supabase.from("restaurants").select("id,name,tagline,currency_symbol,upi_id,upi_payee_name,pickup_instructions").eq("id", DEMO_RESTAURANT_ID).single();
    if (error) throw error;
    return data;
  },
  staleTime: 6e4
});
const categoriesQuery = queryOptions({
  queryKey: ["categories", DEMO_RESTAURANT_ID],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("id,name,emoji,sort_order").eq("restaurant_id", DEMO_RESTAURANT_ID).eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 6e4
});
const menuItemsQuery = queryOptions({
  queryKey: ["menu_items", DEMO_RESTAURANT_ID],
  queryFn: async () => {
    const { data, error } = await supabase.from("menu_items").select(
      "id,category_id,name,description,price,image_url,prep_time_min,calories,spice_level,is_veg,is_bestseller,is_recommended,is_new,tags,sort_order"
    ).eq("restaurant_id", DEMO_RESTAURANT_ID).eq("is_available", true).order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 6e4
});
function addonsForItemQuery(itemId) {
  return queryOptions({
    queryKey: ["addons", itemId],
    queryFn: async () => {
      const { data, error } = await supabase.from("item_addons").select("id,item_id,name,price,sort_order").eq("item_id", itemId).eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 6e4
  });
}
const $$splitNotFoundComponentImporter$4 = () => import("./menu-D4uAacyi.mjs");
const $$splitErrorComponentImporter$4 = () => import("./menu-DT5IZjgB.mjs");
const $$splitComponentImporter$c = () => import("./menu-CXQ3SGc1.mjs");
const Route$c = createFileRoute("/menu")({
  head: () => ({
    meta: [{
      title: "Menu — Albaik"
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
    context.queryClient.ensureQueryData(menuItemsQuery);
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$4, "notFoundComponent")
});
const $$splitNotFoundComponentImporter$3 = () => import("./cart-BsY6gr2x.mjs");
const $$splitErrorComponentImporter$3 = () => import("./cart-gw7CWNCf.mjs");
const $$splitComponentImporter$b = () => import("./cart-BJGxbsVP.mjs");
const Route$b = createFileRoute("/cart")({
  head: () => ({
    meta: [{
      title: "Your cart — Albaik"
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(menuItemsQuery);
  },
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$3, "notFoundComponent")
});
const $$splitComponentImporter$a = () => import("./auth-BCl63f7Z.mjs");
const Route$a = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Staff sign in — Albaik"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./route-BFsOu0JM.mjs");
const Route$9 = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-CPSRgnsR.mjs");
const Route$8 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Albaik — Scan. Order. Pick up."
    }, {
      name: "description",
      content: "Premium QR-based restaurant ordering. Scan once, choose your table, browse the menu, pay with UPI, and pick up when ready."
    }, {
      property: "og:title",
      content: "Albaik — Scan. Order. Pick up."
    }, {
      property: "og:description",
      content: "Premium QR ordering experience."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitErrorComponentImporter$2 = () => import("./t._qr-oIo32mUP.mjs");
const $$splitNotFoundComponentImporter$2 = () => import("./t._qr-CPb6EZW-.mjs");
const $$splitComponentImporter$7 = () => import("./t._qr-CMF7J_ac.mjs");
const Route$7 = createFileRoute("/t/$qr")({
  head: () => ({
    meta: [{
      title: "Loading menu…"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
function orderQuery(orderId) {
  return queryOptions({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const [orderRes, itemsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("id", orderId).single(),
        supabase.from("order_items").select("*").eq("order_id", orderId).order("created_at")
      ]);
      if (orderRes.error) throw orderRes.error;
      if (itemsRes.error) throw itemsRes.error;
      return {
        order: orderRes.data,
        items: itemsRes.data ?? []
      };
    }
  });
}
const STATUS_LABELS = {
  pending_payment: "Awaiting payment",
  payment_submitted: "Verifying payment",
  payment_verified: "Order received",
  preparing: "Preparing",
  cooking: "Cooking",
  quality_check: "Quality check",
  ready: "Ready for pickup",
  completed: "Completed",
  cancelled: "Cancelled"
};
const KITCHEN_STATUS_FLOW = [
  "payment_verified",
  "preparing",
  "cooking",
  "quality_check",
  "ready",
  "completed"
];
const CUSTOMER_PROGRESS = [
  "payment_verified",
  "preparing",
  "cooking",
  "quality_check",
  "ready"
];
const $$splitNotFoundComponentImporter$1 = () => import("./pay._orderId-CVKXMwi9.mjs");
const $$splitErrorComponentImporter$1 = () => import("./pay._orderId-gw7CWNCf.mjs");
const $$splitComponentImporter$6 = () => import("./pay._orderId-BVsxhH-s.mjs");
const Route$6 = createFileRoute("/pay/$orderId")({
  head: () => ({
    meta: [{
      title: "Pay — Albaik"
    }]
  }),
  loader: ({
    context,
    params
  }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(orderQuery(params.orderId));
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
const $$splitNotFoundComponentImporter = () => import("./order._orderId-CVKXMwi9.mjs");
const $$splitErrorComponentImporter = () => import("./order._orderId-gw7CWNCf.mjs");
const $$splitComponentImporter$5 = () => import("./order._orderId-BOgxhCop.mjs");
const Route$5 = createFileRoute("/order/$orderId")({
  head: () => ({
    meta: [{
      title: "Order status — Albaik"
    }]
  }),
  loader: ({
    context,
    params
  }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(orderQuery(params.orderId));
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$4 = () => import("./kitchen-B-R6cHAQ.mjs");
const Route$4 = createFileRoute("/_authenticated/kitchen")({
  head: () => ({
    meta: [{
      title: "Kitchen — Albaik"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin-DuRYCCYv.mjs");
const Route$3 = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{
      title: "Admin — Albaik"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.index-C0jmunR8.mjs");
const Route$2 = createFileRoute("/_authenticated/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.settings-CSP92mse.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.menu-BjoTkQl9.mjs");
const Route = createFileRoute("/_authenticated/admin/menu")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const MenuRoute = Route$c.update({
  id: "/menu",
  path: "/menu",
  getParentRoute: () => Route$d
});
const CartRoute = Route$b.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$d
});
const AuthRoute = Route$a.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$d
});
const AuthenticatedRouteRoute = Route$9.update({
  id: "/_authenticated",
  getParentRoute: () => Route$d
});
const IndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$d
});
const TQrRoute = Route$7.update({
  id: "/t/$qr",
  path: "/t/$qr",
  getParentRoute: () => Route$d
});
const PayOrderIdRoute = Route$6.update({
  id: "/pay/$orderId",
  path: "/pay/$orderId",
  getParentRoute: () => Route$d
});
const OrderOrderIdRoute = Route$5.update({
  id: "/order/$orderId",
  path: "/order/$orderId",
  getParentRoute: () => Route$d
});
const AuthenticatedKitchenRoute = Route$4.update({
  id: "/kitchen",
  path: "/kitchen",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminRoute = Route$3.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminIndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminSettingsRoute = Route$1.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminMenuRoute = Route.update({
  id: "/menu",
  path: "/menu",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminMenuRoute,
  AuthenticatedAdminSettingsRoute,
  AuthenticatedAdminIndexRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  AuthenticatedKitchenRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute,
  CartRoute,
  MenuRoute,
  OrderOrderIdRoute,
  PayOrderIdRoute,
  TQrRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  CUSTOMER_PROGRESS as C,
  DEMO_RESTAURANT_ID as D,
  KITCHEN_STATUS_FLOW as K,
  Route$7 as R,
  STATUS_LABELS as S,
  addonsForItemQuery as a,
  Route$6 as b,
  categoriesQuery as c,
  Route$5 as d,
  router as e,
  menuItemsQuery as m,
  orderQuery as o,
  restaurantQuery as r
};
