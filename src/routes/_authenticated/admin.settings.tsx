import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "@/lib/restaurant";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [payee, setPayee] = useState("");
  const [tagline, setTagline] = useState("");
  const [pickup, setPickup] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("restaurants")
        .select("name,upi_id,upi_payee_name,tagline,pickup_instructions")
        .eq("id", DEMO_RESTAURANT_ID)
        .single();
      if (data) {
        setName(data.name ?? "");
        setUpiId(data.upi_id ?? "");
        setPayee(data.upi_payee_name ?? "");
        setTagline(data.tagline ?? "");
        setPickup(data.pickup_instructions ?? "");
      }
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase
      .from("restaurants")
      .update({
        name,
        tagline,
        upi_id: upiId,
        upi_payee_name: payee,
        pickup_instructions: pickup,
      })
      .eq("id", DEMO_RESTAURANT_ID);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">
        Configure the restaurant name and UPI ID used for customer payments.
      </p>
      <form onSubmit={save} className="mt-6 grid gap-4">
        <Field label="Restaurant name" value={name} onChange={setName} />
        <Field label="Tagline" value={tagline} onChange={setTagline} />
        <Field label="UPI ID" value={upiId} onChange={setUpiId} placeholder="restaurant@upi" />
        <Field label="UPI payee name" value={payee} onChange={setPayee} />
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pickup instructions
          </label>
          <textarea
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-glass-border bg-white/[0.04] p-3 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-fit items-center gap-2 rounded-full gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-glass-border bg-white/[0.04] px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
      />
    </div>
  );
}
