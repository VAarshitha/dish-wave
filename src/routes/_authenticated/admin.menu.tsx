import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "@/lib/restaurant";
import { formatCurrency } from "@/lib/format";
import { ADMIN_PASSCODE } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: AdminMenu,
});

type Row = {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  is_bestseller: boolean;
  is_veg: boolean;
  category_id: string | null;
};

function AdminMenu() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["admin", "menu"],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id,name,price,is_available,is_bestseller,is_veg,category_id")
        .eq("restaurant_id", DEMO_RESTAURANT_ID)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");

  async function toggleAvailable(id: string, current: boolean) {
    const { error } = await supabase.rpc("admin_set_menu_available", {
      _passcode: ADMIN_PASSCODE,
      _item_id: id,
      _available: !current,
    });
    if (error) {
      alert(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin", "menu"] });
    qc.invalidateQueries({ queryKey: ["menu_items", DEMO_RESTAURANT_ID] });
  }

  async function savePrice(id: string) {
    const n = Number(editPrice);
    if (!Number.isFinite(n) || n < 0) {
      alert("Invalid price");
      return;
    }
    const { error } = await supabase.rpc("admin_update_menu_price", {
      _passcode: ADMIN_PASSCODE,
      _item_id: id,
      _price: n,
    });
    if (error) {
      alert(error.message);
      return;
    }
    setEditingId(null);
    qc.invalidateQueries({ queryKey: ["admin", "menu"] });
    qc.invalidateQueries({ queryKey: ["menu_items", DEMO_RESTAURANT_ID] });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Menu</h1>
      <p className="text-sm text-muted-foreground">
        Update prices and toggle items in or out of stock instantly.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-glass-border">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Available</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-glass-border">
                <td className="px-4 py-3 font-medium">{i.name}</td>
                <td className="px-4 py-3">
                  {editingId === i.id ? (
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-20 rounded-lg border border-glass-border bg-white/[0.05] px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => savePrice(i.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-success/20 text-success"
                        aria-label="Save"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-muted-foreground"
                        aria-label="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(i.id);
                        setEditPrice(String(i.price));
                      }}
                      className="rounded px-1 py-0.5 hover:bg-white/5"
                    >
                      {formatCurrency(Number(i.price))}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {i.is_bestseller ? "★ Best · " : ""}
                  {i.is_veg ? "Veg" : "Non-veg"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleAvailable(i.id, i.is_available)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      i.is_available
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i.is_available ? "In stock" : "Out of stock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
