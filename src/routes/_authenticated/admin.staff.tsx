import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, KeyRound, Power } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "@/lib/restaurant";

export const Route = createFileRoute("/_authenticated/admin/staff")({
  head: () => ({ meta: [{ title: "Kitchen Staff — Albaik" }] }),
  component: AdminStaff,
});

type Staff = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

function AdminStaff() {
  const qc = useQueryClient();
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["admin", "kitchen_staff"],
    queryFn: async (): Promise<Staff[]> => {
      const { data, error } = await supabase
        .from("kitchen_staff")
        .select("id,name,is_active,created_at")
        .eq("restaurant_id", DEMO_RESTAURANT_ID)
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as Staff[];
    },
  });

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addStaff(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Name is required");
    if (!/^\d{4,6}$/.test(pin)) return setError("PIN must be 4–6 digits");
    setBusy(true);
    const { error } = await supabase.rpc("admin_create_kitchen_staff", {
      _restaurant_id: DEMO_RESTAURANT_ID,
      _name: name.trim(),
      _pin: pin,
    });
    setBusy(false);
    if (error) return setError(error.message);
    setName(""); setPin("");
    qc.invalidateQueries({ queryKey: ["admin", "kitchen_staff"] });
  }

  async function resetPin(id: string) {
    const newPin = prompt("New PIN (4–6 digits)");
    if (!newPin) return;
    if (!/^\d{4,6}$/.test(newPin)) return alert("PIN must be 4–6 digits");
    const { error } = await supabase.rpc("admin_reset_kitchen_pin", { _staff_id: id, _pin: newPin });
    if (error) alert(error.message);
    else qc.invalidateQueries({ queryKey: ["admin", "kitchen_staff"] });
  }

  async function toggleActive(id: string, active: boolean) {
    const { error } = await supabase.rpc("admin_set_kitchen_active", { _staff_id: id, _active: !active });
    if (error) alert(error.message);
    else qc.invalidateQueries({ queryKey: ["admin", "kitchen_staff"] });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Kitchen Staff</h1>
      <p className="text-sm text-muted-foreground">
        Manage kitchen tablet PINs. PINs are stored as secure hashes — they cannot be read back.
      </p>

      <form
        onSubmit={addStaff}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-glass-border bg-[var(--gradient-card)] p-4"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chef Karan"
            className="w-full rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>
        <div className="w-[140px]">
          <label className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">PIN (4–6 digits)</label>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="••••"
            className="w-full rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2 text-sm tracking-widest focus:border-primary/50 focus:outline-none"
          />
        </div>
        <button
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full gradient-primary-bg px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add staff
        </button>
        {error && <p className="basis-full text-xs text-destructive">{error}</p>}
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-glass-border">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && staff.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No staff yet. Add the first one above.</td></tr>
            )}
            {staff.map((s) => (
              <tr key={s.id} className="border-t border-glass-border">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    s.is_active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  }`}>{s.is_active ? "Active" : "Disabled"}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => resetPin(s.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1 text-xs hover:bg-white/[0.08]"
                    >
                      <KeyRound className="h-3 w-3" /> Reset PIN
                    </button>
                    <button
                      onClick={() => toggleActive(s.id, s.is_active)}
                      className="inline-flex items-center gap-1 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1 text-xs hover:bg-white/[0.08]"
                    >
                      <Power className="h-3 w-3" /> {s.is_active ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
