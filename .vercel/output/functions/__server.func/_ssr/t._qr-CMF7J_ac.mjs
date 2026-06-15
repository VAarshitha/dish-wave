import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { s as setTable } from "./cart-Chd1RMsz.mjs";
import { R as Route$7 } from "./router-BEfqKPEM.mjs";
import { i as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function QrEntry() {
  const {
    qr
  } = Route$7.useParams();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    (async () => {
      const {
        data,
        error
      } = await supabase.from("restaurant_tables").select("id,label").eq("qr_token", qr).eq("is_active", true).maybeSingle();
      if (error || !data) {
        navigate({
          to: "/menu"
        });
        return;
      }
      setTable({
        id: data.id,
        label: data.label
      });
      navigate({
        to: "/menu"
      });
    })();
  }, [qr, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Opening menu…" })
  ] }) });
}
export {
  QrEntry as component
};
