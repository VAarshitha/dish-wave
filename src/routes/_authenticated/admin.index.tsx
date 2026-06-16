import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, ChefHat, Bell, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, relativeTime } from "@/lib/format";
import { STATUS_LABELS, type OrderStatus } from "@/lib/orders.queries";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOrders,
});

type AdminOrder = {
  id: string;
  order_number: number;
  serial_number: string | null;
  customer_name: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: "border-primary/40 bg-primary/10 text-primary",
  preparing: "border-accent/40 bg-accent/10 text-accent",
  ready: "border-success/40 bg-success/10 text-success",
  completed: "border-glass-border bg-white/5 text-muted-foreground",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
};

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async (): Promise<AdminOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,serial_number,customer_name,total,status,created_at")
        .order("created_at", { ascending: false })
        .limit(150);
      if (error) throw error;
      return (data ?? []) as AdminOrder[];
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    const ch = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () =>
        qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  async function setStatus(id: string, status: OrderStatus) {
    const patch: { status: OrderStatus; ready_at?: string; completed_at?: string } = { status };
    if (status === "ready") patch.ready_at = new Date().toISOString();
    if (status === "completed") patch.completed_at = new Date().toISOString();
    await supabase.from("orders").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
  }

  const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const past = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Live queue. Mark orders as preparing, ready or completed.
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black tabular-nums">{active.length}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Active</p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          In progress
        </h2>
        <div className="grid gap-3">
          {active.length === 0 ? (
            <p className="rounded-2xl border border-glass-border bg-white/[0.02] p-8 text-center text-sm text-muted-foreground">
              No active orders right now.
            </p>
          ) : (
            active.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-glass-border bg-[var(--gradient-card)] p-4"
              >
                <div className="min-w-[5.5rem]">
                  <p className="text-2xl font-black text-gradient-primary">
                    {o.serial_number ?? `S${o.order_number}`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    <Clock className="mr-0.5 inline h-3 w-3" /> {relativeTime(o.created_at)}
                  </p>
                </div>
                <div className="min-w-[7rem]">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold">{formatCurrency(Number(o.total))}</p>
                </div>
                <div className="min-w-[8rem]">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span
                    className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[o.status]}`}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                  {o.status === "received" && (
                    <button
                      onClick={() => setStatus(o.id, "preparing")}
                      className="inline-flex items-center gap-1 rounded-full gradient-primary-bg px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
                    >
                      <ChefHat className="h-3 w-3" /> Start preparing
                    </button>
                  )}
                  {o.status === "preparing" && (
                    <button
                      onClick={() => setStatus(o.id, "ready")}
                      className="inline-flex items-center gap-1 rounded-full gradient-success-bg px-3 py-1.5 text-xs font-semibold text-success-foreground"
                    >
                      <Bell className="h-3 w-3" /> Mark ready
                    </button>
                  )}
                  {o.status === "ready" && (
                    <button
                      onClick={() => setStatus(o.id, "completed")}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Picked up
                    </button>
                  )}
                  <button
                    onClick={() => setStatus(o.id, "cancelled")}
                    className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/5 hover:text-destructive"
                  >
                    <XCircle className="h-3 w-3" /> Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Past today
          </h2>
          <div className="grid gap-2">
            {past.slice(0, 30).map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-glass-border bg-white/[0.02] px-4 py-2.5 text-sm opacity-80"
              >
                <span className="min-w-[3rem] font-bold tabular-nums">{o.serial_number ?? `S${o.order_number}`}</span>
                <span className="text-xs text-muted-foreground">{relativeTime(o.created_at)}</span>
                <span className="ml-auto text-xs">{formatCurrency(Number(o.total))}</span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] ${STATUS_COLORS[o.status]}`}>
                  {STATUS_LABELS[o.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
