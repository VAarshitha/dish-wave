import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, ChefHat, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KITCHEN_STATUS_FLOW, STATUS_LABELS, type OrderStatus } from "@/lib/orders.queries";
import { formatCurrency, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/kitchen")({
  head: () => ({ meta: [{ title: "Kitchen — Albaik" }] }),
  component: KitchenPage,
});

type KOrder = {
  id: string;
  order_number: number;
  table_label: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
};
type KItem = { id: string; order_id: string; name_snapshot: string; qty: number };

function KitchenPage() {
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["kitchen", "orders"],
    queryFn: async (): Promise<KOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,table_label,total,status,created_at")
        .in("status", ["payment_verified", "preparing", "cooking", "quality_check", "ready"])
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as KOrder[];
    },
  });
  const orderIds = orders.map((o) => o.id);
  const { data: items = [] } = useQuery({
    queryKey: ["kitchen", "items", orderIds.join(",")],
    queryFn: async (): Promise<KItem[]> => {
      if (orderIds.length === 0) return [];
      const { data, error } = await supabase
        .from("order_items")
        .select("id,order_id,name_snapshot,qty")
        .in("order_id", orderIds);
      if (error) throw error;
      return (data ?? []) as KItem[];
    },
    enabled: orderIds.length > 0,
  });

  useEffect(() => {
    const ch = supabase
      .channel("kitchen-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () =>
        qc.invalidateQueries({ queryKey: ["kitchen", "orders"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  async function advance(id: string, status: OrderStatus) {
    const idx = KITCHEN_STATUS_FLOW.indexOf(status);
    const next = KITCHEN_STATUS_FLOW[idx + 1] ?? status;
    const patch: { status: OrderStatus; ready_at?: string; completed_at?: string } = { status: next };
    if (next === "ready") patch.ready_at = new Date().toISOString();
    if (next === "completed") patch.completed_at = new Date().toISOString();
    await supabase.from("orders").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["kitchen", "orders"] });
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const columns: { key: OrderStatus; label: string }[] = [
    { key: "payment_verified", label: "New" },
    { key: "preparing", label: "Preparing" },
    { key: "cooking", label: "Cooking" },
    { key: "quality_check", label: "QC" },
    { key: "ready", label: "Ready" },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass-strong">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </span>
            Kitchen Display
          </span>
          <Link
            to="/_authenticated/admin"
            className="ml-auto rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]"
          >
            Admin
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {columns.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.key);
            return (
              <div key={col.key} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {col.label}
                  </h2>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
                    {colOrders.length}
                  </span>
                </div>
                <AnimatePresence>
                  {colOrders.map((o) => {
                    const orderItems = items.filter((i) => i.order_id === o.id);
                    return (
                      <motion.div
                        key={o.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`rounded-2xl border p-3 ${
                          col.key === "ready"
                            ? "border-success/40 bg-success/10 shadow-glow"
                            : "border-glass-border bg-[var(--gradient-card)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold">#{o.order_number}</p>
                          <span className="text-[11px] text-muted-foreground">
                            {relativeTime(o.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {o.table_label ?? "—"} · {formatCurrency(Number(o.total))}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {orderItems.map((it) => (
                            <li key={it.id}>
                              <span className="font-semibold">{it.qty}×</span> {it.name_snapshot}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => advance(o.id, o.status)}
                          className={`mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${
                            col.key === "ready"
                              ? "gradient-success-bg text-success-foreground"
                              : "gradient-primary-bg text-primary-foreground shadow-glow"
                          }`}
                        >
                          {col.key === "ready" ? (
                            <>
                              <Bell className="h-3 w-3" /> Picked up
                            </>
                          ) : (
                            <>
                              Next: {STATUS_LABELS[KITCHEN_STATUS_FLOW[KITCHEN_STATUS_FLOW.indexOf(o.status) + 1]]}{" "}
                              <ChevronRight className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
