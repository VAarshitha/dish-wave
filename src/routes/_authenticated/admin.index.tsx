import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, relativeTime } from "@/lib/format";
import { STATUS_LABELS, type OrderStatus, type PaymentStatus } from "@/lib/orders.queries";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOrders,
});

type AdminOrder = {
  id: string;
  order_number: number;
  table_label: string | null;
  customer_name: string | null;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
};

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async (): Promise<AdminOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,table_label,customer_name,total,status,payment_status,created_at")
        .order("created_at", { ascending: false })
        .limit(100);
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

  async function verifyPayment(id: string) {
    await supabase
      .from("orders")
      .update({
        payment_status: "verified",
        payment_verified_at: new Date().toISOString(),
        status: "payment_verified",
      })
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
  }
  async function rejectPayment(id: string) {
    await supabase
      .from("orders")
      .update({ payment_status: "failed", status: "cancelled" })
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Verify payments and track every order in real time.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {orders.map((o) => (
          <div
            key={o.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-glass-border bg-[var(--gradient-card)] p-4"
          >
            <div className="min-w-[7rem]">
              <p className="text-lg font-bold">#{o.order_number}</p>
              <p className="text-[11px] text-muted-foreground">
                <Clock className="mr-0.5 inline h-3 w-3" /> {relativeTime(o.created_at)}
              </p>
            </div>
            <div className="min-w-[10rem]">
              <p className="text-xs text-muted-foreground">Table</p>
              <p className="text-sm font-medium">{o.table_label ?? "—"}</p>
              {o.customer_name && (
                <p className="text-[11px] text-muted-foreground">{o.customer_name}</p>
              )}
            </div>
            <div className="min-w-[7rem]">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold">{formatCurrency(Number(o.total))}</p>
            </div>
            <div className="min-w-[10rem]">
              <p className="text-xs text-muted-foreground">Status</p>
              <span className="inline-block rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
                {STATUS_LABELS[o.status]}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {o.payment_status === "submitted" ? (
                <>
                  <button
                    onClick={() => verifyPayment(o.id)}
                    className="inline-flex items-center gap-1 rounded-full gradient-success-bg px-3 py-1.5 text-xs font-semibold text-success-foreground"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Verify payment
                  </button>
                  <button
                    onClick={() => rejectPayment(o.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive"
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </button>
                </>
              ) : (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    o.payment_status === "verified"
                      ? "bg-success/15 text-success"
                      : o.payment_status === "failed"
                        ? "bg-destructive/15 text-destructive"
                        : "bg-warning/15 text-warning"
                  }`}
                >
                  {o.payment_status}
                </span>
              )}
            </div>
          </div>
        ))}
        {!isLoading && orders.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
