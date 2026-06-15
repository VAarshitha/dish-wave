import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-hWVsMvJ8.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DzV5ca47.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
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
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const claimOwnerRole_createServerFn_handler = createServerRpc({
  id: "267c3512babcdca1069a07bc2a72be73584fa13de292aec8b3abd8c6ea32b2ca",
  name: "claimOwnerRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => claimOwnerRole.__executeServer(opts));
const claimOwnerRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(claimOwnerRole_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    count,
    error: countErr
  } = await supabaseAdmin.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "owner");
  if (countErr) throw new Error(countErr.message);
  if ((count ?? 0) > 0) {
    await supabaseAdmin.from("user_roles").upsert({
      user_id: context.userId,
      role: "kitchen"
    }, {
      onConflict: "user_id,role"
    });
    return {
      granted: "kitchen",
      bootstrapped: false
    };
  }
  const {
    error
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: context.userId,
    role: "owner"
  });
  if (error) throw new Error(error.message);
  return {
    granted: "owner",
    bootstrapped: true
  };
});
const getMyRoles_createServerFn_handler = createServerRpc({
  id: "bc043367e3258bc0750efadc2962d5983ded7a90f892e25e8da034f07aee469d",
  name: "getMyRoles",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getMyRoles.__executeServer(opts));
const getMyRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyRoles_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  return {
    roles: (data ?? []).map((r) => r.role)
  };
});
export {
  claimOwnerRole_createServerFn_handler,
  getMyRoles_createServerFn_handler
};
