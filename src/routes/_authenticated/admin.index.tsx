import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Calendar, ChefHat, Bell, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, relativeTime } from "@/lib/format";
import { STATUS_LABELS, type OrderStatus } from "@/lib/orders.queries";
import { ADMIN_PASSCODE } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOrders,
});

type AdminOrder = {
  id: string;
  order_number: number;
  serial_number: string | null;
  serial_date: string | null;
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

type Filter = "today" | "yesterday" | "7d" | "custom";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function shiftDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function AdminOrders() {
  const qc = useQueryClient();
  const today = todayISO();
  const [filter, setFilter] = useState<Filter>("today");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  const range = useMemo(() => {
    if (filter === "today") return { from: today, to: today };
    if (filter === "yesterday") {
      const y = shiftDays(today, -1);
      return { from: y, to: y };
    }
    if (filter === "7d") return { from: shiftDays(today, -6), to: today };
    return { from, to };
  }, [filter, from, to, today]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders", range.from, range.to],
    queryFn: async (): Promise<AdminOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,serial_number,serial_date,total,status,created_at")
        .gte("serial_date", range.from)
        .lte("serial_date", range.to)
        .order("created_at", { ascending: false })
        .limit(500);
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
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  async function setStatus(id: string, status: OrderStatus) {
    const { error } = await supabase.rpc("set_order_status_passcode", {
      _passcode: ADMIN_PASSCODE,
      _order_id: id,
      _status: status,
    });
    if (error) {
      alert(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
  }

  const isToday = filter === "today";
  const active = isToday
    ? orders.filter((o) => o.status !== "completed" && o.status !== "cancelled")
    : [];
  const archive = isToday
    ? orders.filter((o) => o.status === "completed" || o.status === "cancelled")
    : orders;

  const archiveLabel = isToday ? "Past today" : "Archived orders";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Today's active queue plus archived history.
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black tabular-nums">{isToday ? active.length : orders.length}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {isToday ? "Active" : "Orders"}
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {([
          ["today", "Today"],
          ["yesterday", "Yesterday"],
          ["7d", "Last 7 days"],
          ["custom", "Custom"],
        ] as ReadonlyArray<[Filter, string]>).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === k
                ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
                : "border-glass-border bg-white/[0.03] text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
        {filter === "custom" && (
          <div className="ml-2 flex items-center gap-2">
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-glass-border bg-white/[0.04] px-2 py-1 text-xs"
            />
            <span className="text-xs text-muted-foreground">→</span>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-glass-border bg-white/[0.04] px-2 py-1 text-xs"
            />
          </div>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {isToday && (
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
      )}

      {archive.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {archiveLabel}
          </h2>
          <div className="grid gap-2">
            {archive.map((o) => {
              const d = new Date(o.created_at);
              return (
                <div
                  key={o.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-glass-border bg-white/[0.02] px-4 py-2.5 text-sm opacity-90"
                >
                  <span className="min-w-[3rem] font-bold tabular-nums">
                    {o.serial_number ?? `S${o.order_number}`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {d.toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="ml-auto text-xs">{formatCurrency(Number(o.total))}</span>
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] ${STATUS_COLORS[o.status]}`}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
