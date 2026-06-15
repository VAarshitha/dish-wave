import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Smartphone, CheckCircle2, Loader2, ShieldCheck, Copy, Check } from "lucide-react";
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
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

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

  function copyUpi() {
    if (!restaurant.upi_id) return;
    navigator.clipboard?.writeText(restaurant.upi_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-16">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl animate-blob" aria-hidden />
      <AppHeader title="Complete payment" subtitle={`Order #${order.order_number}`} showCart={false} />
      <div className="relative mx-auto max-w-md px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-glass-border bg-[var(--gradient-card)] p-7 text-center shadow-elevated"
        >
          <div className="relative mx-auto inline-flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary-bg shadow-glow"
            >
              <Smartphone className="h-7 w-7 text-primary-foreground" />
            </motion.span>
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Amount to pay
          </p>
          <motion.p
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", damping: 18 }}
            className="mt-1 text-5xl font-black tracking-tight tabular-nums"
          >
            {formatCurrency(Number(order.total), restaurant.currency_symbol)}
          </motion.p>

          <button
            onClick={copyUpi}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs font-medium transition hover:bg-white/[0.08]"
          >
            <span className="text-muted-foreground">Pay to</span>
            <span className="text-foreground">{restaurant.upi_id ?? "—"}</span>
            {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
          </button>

          {upiUrl ? (
            <motion.a
              href={upiUrl}
              onClick={() => setOpened(true)}
              whileTap={{ scale: 0.97 }}
              className="relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full gradient-primary-bg px-5 py-4 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Smartphone className="h-4 w-4" />
              Pay with UPI app
            </motion.a>
          ) : (
            <p className="mt-4 text-sm text-destructive">
              UPI not configured. Ask the restaurant to set their UPI ID.
            </p>
          )}

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-success" />
            PhonePe · Google Pay · Paytm · BHIM
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <button
            onClick={confirmPayment}
            disabled={submitting}
            className={`flex w-full items-center justify-center gap-2 rounded-full border py-3.5 text-sm font-semibold transition disabled:opacity-60 ${
              opened
                ? "border-success/50 bg-success/10 text-success hover:bg-success/15 shadow-glow-success"
                : "border-glass-border bg-white/[0.05] hover:bg-white/[0.08]"
            }`}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className={`h-4 w-4 ${opened ? "text-success" : ""}`} />
            )}
            I've completed payment
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            The restaurant will verify your payment before preparing the order.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
