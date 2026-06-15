import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Bell, CheckCircle2, ChefHat, ClipboardCheck, Flame, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/customer/AppHeader";
import {
  orderQuery,
  CUSTOMER_PROGRESS,
  STATUS_LABELS,
  type OrderStatus,
} from "@/lib/orders.queries";
import { restaurantQuery } from "@/lib/menu.queries";
import { formatCurrency } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({ meta: [{ title: "Order status — Albaik" }] }),
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(orderQuery(params.orderId));
  },
  component: OrderPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Order not found.</div>,
});

const STAGE_META: Record<OrderStatus, { label: string; icon: typeof Bell; tip: string }> = {
  pending_payment: { label: "Awaiting payment", icon: ClipboardCheck, tip: "Complete UPI payment to start." },
  payment_submitted: { label: "Verifying payment", icon: ClipboardCheck, tip: "Restaurant is confirming your payment…" },
  payment_verified: { label: "Order received", icon: CheckCircle2, tip: "We've got your order. Hold tight." },
  preparing: { label: "Preparing", icon: ChefHat, tip: "Our chefs are gathering ingredients." },
  cooking: { label: "Cooking", icon: Flame, tip: "Sizzling on the grill right now." },
  quality_check: { label: "Quality check", icon: Sparkles, tip: "Final taste & temperature check." },
  ready: { label: "Ready for pickup", icon: Bell, tip: "Walk to the counter — your feast is hot!" },
  completed: { label: "Completed", icon: CheckCircle2, tip: "Enjoy your meal." },
  cancelled: { label: "Cancelled", icon: CheckCircle2, tip: "" },
};

function OrderPage() {
  const { orderId } = Route.useParams();
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const { refetch } = useQuery(orderQuery(orderId));
  const { data } = useSuspenseQuery(orderQuery(orderId));
  const { order, items } = data;

  // Realtime subscription
  useEffect(() => {
    const ch = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [orderId, refetch]);

  // Celebrate when ready
  useEffect(() => {
    if (order.status === "ready") {
      try {
        navigator.vibrate?.([200, 80, 200]);
      } catch {}
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.3 },
        colors: ["#f5c54a", "#ff7a45", "#ffe2a8"],
      });
    }
  }, [order.status]);

  const currentIdx = CUSTOMER_PROGRESS.indexOf(order.status as OrderStatus);
  const isReady = order.status === "ready" || order.status === "completed";

  return (
    <div className="min-h-screen pb-16">
      <AppHeader
        title={`Order #${order.order_number}`}
        subtitle={order.table_label ?? "Self pickup"}
        showCart={false}
      />
      <div className="mx-auto max-w-md px-5 pt-6">
        <AnimatePresence mode="wait">
          {isReady ? (
            <ReadyCelebration key="ready" orderNumber={order.order_number} pickupInstructions={restaurant.pickup_instructions ?? ""} />
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-6 text-center shadow-elevated"
            >
              <CurrentStageCard status={order.status as OrderStatus} />
              <div className="mt-6 grid gap-2.5">
                {CUSTOMER_PROGRESS.map((s, i) => {
                  const Meta = STAGE_META[s];
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div
                      key={s}
                      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left text-sm transition ${
                        active
                          ? "border-primary/50 bg-primary/10 shadow-glow"
                          : done
                            ? "border-success/30 bg-success/5"
                            : "border-glass-border bg-white/[0.02]"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 flex-none items-center justify-center rounded-full ${
                          done
                            ? "gradient-success-bg text-success-foreground"
                            : active
                              ? "gradient-primary-bg text-primary-foreground"
                              : "bg-white/5 text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Meta.icon className="h-3.5 w-3.5" />}
                      </span>
                      <span className={`flex-1 ${active ? "font-semibold" : ""}`}>
                        {STATUS_LABELS[s]}
                      </span>
                      {active && <span className="text-[10px] uppercase tracking-wider text-primary">Now</span>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 rounded-3xl border border-glass-border bg-white/[0.03] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your order
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="font-medium">{it.qty}× {it.name_snapshot}</span>
                  {it.addons?.length > 0 && (
                    <span className="block truncate text-[11px] text-muted-foreground">
                      + {it.addons.map((a) => a.name).join(", ")}
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(Number(it.line_total))}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-glass-border pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(Number(order.total), restaurant.currency_symbol)}</span>
          </div>
        </div>

        <Link
          to="/menu"
          className="mt-5 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Order something else →
        </Link>
      </div>
    </div>
  );
}

function CurrentStageCard({ status }: { status: OrderStatus }) {
  const Meta = STAGE_META[status];
  const Icon = Meta.icon;
  return (
    <div className="relative">
      <div className="relative mx-auto inline-flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style={{ animationDelay: "0.6s" }} />
        <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full gradient-primary-bg shadow-glow animate-float">
          <Icon className="h-8 w-8 text-primary-foreground" />
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight">{Meta.label}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{Meta.tip}</p>
    </div>
  );
}

function ReadyCelebration({
  orderNumber,
  pickupInstructions,
}: {
  orderNumber: number;
  pickupInstructions: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 18, stiffness: 220 }}
      className="relative overflow-hidden rounded-3xl border-2 p-7 text-center shadow-elevated"
      style={{ borderColor: "var(--success)", background: "var(--gradient-success)" }}
    >
      <div className="relative mx-auto inline-flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-white/30 animate-pulse-ring" />
        <motion.span
          animate={{ rotate: [0, -12, 12, -10, 10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-white text-success shadow-elevated"
        >
          <Bell className="h-10 w-10" />
        </motion.span>
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-success-foreground/80">
        Ready for pickup
      </p>
      <p className="mt-2 text-6xl font-bold leading-none tracking-tight text-success-foreground">
        #{orderNumber}
      </p>
      <p className="mt-5 text-sm text-success-foreground/90">{pickupInstructions}</p>
    </motion.div>
  );
}
