import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "@/lib/restaurant";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: AdminMenu,
});

function AdminMenu() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["admin", "menu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id,name,price,is_available,is_bestseller,is_veg,category_id")
        .eq("restaurant_id", DEMO_RESTAURANT_ID)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  async function toggleAvailable(id: string, current: boolean) {
    await supabase.from("menu_items").update({ is_available: !current }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "menu"] });
    qc.invalidateQueries({ queryKey: ["menu_items", DEMO_RESTAURANT_ID] });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Menu</h1>
      <p className="text-sm text-muted-foreground">Toggle items in or out of stock instantly.</p>
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
                <td className="px-4 py-3">{formatCurrency(Number(i.price))}</td>
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
