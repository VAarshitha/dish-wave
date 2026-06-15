import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { AppHeader } from "@/components/customer/AppHeader";
import { orderQuery } from "@/lib/orders.queries";
import { restaurantQuery } from "@/lib/menu.queries";
import { buildUpiUrl } from "@/lib/upi";
import { formatCurrency } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pay/$orderId")({
  head: () => ({ meta: [{ title: "Pay — Albaik" }] }),
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(orderQuery(params.orderId));
  },
  component: PayPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Order not found.</div>,
});

function PayPage() {
  const { orderId } = Route.useParams();
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const { data: { order } } = useSuspenseQuery(orderQuery(orderId));
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const upiUrl = restaurant.upi_id
    ? buildUpiUrl({
        payeeVpa: restaurant.upi_id,
        payeeName: restaurant.upi_payee_name ?? restaurant.name,
        amount: Number(order.total),
        note: `Order #${order.order_number}`,
        txnRef: `ORD${order.order_number}`,
      })
    : null;

  async function confirmPayment() {
    setSubmitting(true);
    await supabase
      .from("orders")
      .update({
        status: "payment_submitted",
        payment_status: "submitted",
        payment_submitted_at: new Date().toISOString(),
      })
      .eq("id", orderId);
    navigate({ to: "/order/$orderId", params: { orderId } });
  }

  return (
    <div className="min-h-screen pb-12">
      <AppHeader title="Complete payment" subtitle={`Order #${order.order_number}`} showCart={false} />
      <div className="mx-auto max-w-md px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-6 text-center shadow-elevated"
        >
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary-bg shadow-glow">
            <Smartphone className="h-7 w-7 text-primary-foreground" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            Amount to pay
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight">
            {formatCurrency(Number(order.total), restaurant.currency_symbol)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pay to <span className="text-foreground">{restaurant.upi_id ?? "—"}</span>
          </p>

          {upiUrl ? (
            <a
              href={upiUrl}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full gradient-primary-bg px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Smartphone className="h-4 w-4" />
              Pay with UPI app
            </a>
          ) : (
            <p className="mt-4 text-sm text-destructive">
              UPI not configured. Ask the restaurant to set their UPI ID.
            </p>
          )}

          <p className="mt-5 text-[11px] text-muted-foreground">
            Opens PhonePe, Google Pay, Paytm, or BHIM — whichever is installed.
            Complete payment, then return here.
          </p>
        </motion.div>

        <button
          onClick={confirmPayment}
          disabled={submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-glass-border bg-white/[0.05] py-3.5 text-sm font-semibold transition hover:bg-white/[0.08] disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-success" />
          )}
          I've completed payment
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          The restaurant will verify your payment before preparing the order.
        </p>
      </div>
    </div>
  );
}
