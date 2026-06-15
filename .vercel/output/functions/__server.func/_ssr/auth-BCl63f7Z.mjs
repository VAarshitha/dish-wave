import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link, u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-hWVsMvJ8.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DzV5ca47.mjs";
import "../_libs/seroval.mjs";
import { h as ChefHat, i as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const claimOwnerRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("267c3512babcdca1069a07bc2a72be73584fa13de292aec8b3abd8c6ea32b2ca"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("bc043367e3258bc0750efadc2962d5983ded7a90f892e25e8da034f07aee469d"));
function AuthPage() {
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const navigate = useNavigate();
  const claimOwner = useServerFn(claimOwnerRole);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
      try {
        await claimOwner();
      } catch {
      }
      navigate({
        to: "/_authenticated/admin"
      });
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-8 flex items-center justify-center gap-2 text-sm font-semibold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-8 w-8 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4" }) }),
      "Albaik Staff"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-6 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: mode === "signin" ? "Sign in" : "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: mode === "signin" ? "Access admin and kitchen dashboards." : "The first user becomes the owner." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-5 grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", className: "w-full rounded-xl border border-glass-border bg-white/[0.04] px-4 py-3 text-sm focus:border-primary/50 focus:outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password (min 6 chars)", className: "w-full rounded-xl border border-glass-border bg-white/[0.04] px-4 py-3 text-sm focus:border-primary/50 focus:outline-none" }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: err }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "mt-2 flex items-center justify-center gap-2 rounded-full gradient-primary-bg py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60", children: [
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null,
          mode === "signin" ? "Sign in" : "Create account"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode((m) => m === "signin" ? "signup" : "signin"), className: "mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground", children: mode === "signin" ? "Need an account? Create one" : "Have an account? Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 block text-center text-xs text-muted-foreground hover:text-foreground", children: "← Back to customer app" })
  ] }) });
}
export {
  AuthPage as component
};
