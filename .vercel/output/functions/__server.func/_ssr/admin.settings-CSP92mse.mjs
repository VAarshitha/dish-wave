import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-CLDxxxcm.mjs";
import { D as DEMO_RESTAURANT_ID } from "./router-BEfqKPEM.mjs";
import { w as Save } from "../_libs/lucide-react.mjs";
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
function SettingsPage() {
  const [name, setName] = reactExports.useState("");
  const [upiId, setUpiId] = reactExports.useState("");
  const [payee, setPayee] = reactExports.useState("");
  const [tagline, setTagline] = reactExports.useState("");
  const [pickup, setPickup] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.from("restaurants").select("name,upi_id,upi_payee_name,tagline,pickup_instructions").eq("id", DEMO_RESTAURANT_ID).single();
      if (data) {
        setName(data.name ?? "");
        setUpiId(data.upi_id ?? "");
        setPayee(data.upi_payee_name ?? "");
        setTagline(data.tagline ?? "");
        setPickup(data.pickup_instructions ?? "");
      }
    })();
  }, []);
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("restaurants").update({
      name,
      tagline,
      upi_id: upiId,
      upi_payee_name: payee,
      pickup_instructions: pickup
    }).eq("id", DEMO_RESTAURANT_ID);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure the restaurant name and UPI ID used for customer payments." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "mt-6 grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Restaurant name", value: name, onChange: setName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tagline", value: tagline, onChange: setTagline }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "UPI ID", value: upiId, onChange: setUpiId, placeholder: "restaurant@upi" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "UPI payee name", value: payee, onChange: setPayee }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Pickup instructions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: pickup, onChange: (e) => setPickup(e.target.value), rows: 3, className: "mt-1.5 w-full rounded-xl border border-glass-border bg-white/[0.04] p-3 text-sm focus:border-primary/50 focus:outline-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving, className: "inline-flex w-fit items-center gap-2 rounded-full gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        saving ? "Saving…" : saved ? "Saved" : "Save changes"
      ] })
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), placeholder, className: "mt-1.5 w-full rounded-xl border border-glass-border bg-white/[0.04] px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none" })
  ] });
}
export {
  SettingsPage as component
};
