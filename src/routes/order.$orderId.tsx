import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Bell, CheckCircle2, ChefHat, Sparkles, MapPin, Wallet, Receipt } from "lucide-react";
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
  received: { label: "Order received", icon: Receipt, tip: "Show your serial number at the counter to pay." },
  preparing: { label: "Preparing", icon: ChefHat, tip: "Our chefs are gathering ingredients." },
  ready: { label: "Ready for pickup", icon: Bell, tip: "Walk to the counter — your feast is hot!" },
  completed: { label: "Completed", icon: CheckCircle2, tip: "Enjoy your meal." },
  cancelled: { label: "Cancelled", icon: CheckCircle2, tip: "" },
};

const COOKING_TIPS = [
  "Did you know? Our chicken is marinated for 12 hours.",
  "Tip: every batch is freshly cooked — never reheated.",
  "Our peri peri is hand-blended in small batches.",
  "Hot food tastes better. We promise it'll be worth the wait.",
  "Fun fact: Albaik means 'the best' in Arabic.",
  "Our oil is filtered every 4 hours for that perfect crunch.",
];

function OrderPage() {
  const { orderId } = Route.useParams();
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const { refetch } = useQuery(orderQuery(orderId));
  const { data } = useSuspenseQuery(orderQuery(orderId));
  const { order, items } = data;

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

  useEffect(() => {
    if (order.status === "ready") {
      try { navigator.vibrate?.([200, 80, 200, 80, 200]); } catch { /* noop */ }
      try {
        const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 880; g.gain.value = 0.05;
        o.start(); o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
        o.stop(ctx.currentTime + 0.5);
      } catch { /* noop */ }
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.3 }, colors: ["#f5c54a", "#ff7a45", "#ffe2a8", "#7dd3a8"] });
      setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 } }), 300);
    }
  }, [order.status]);

  const status = order.status as OrderStatus;
  const currentIdx = CUSTOMER_PROGRESS.indexOf(status);
  const isReady = status === "ready" || status === "completed";

  const stepsLeft = Math.max(0, CUSTOMER_PROGRESS.length - 1 - currentIdx);
  const etaMin = Math.max(2, stepsLeft * 4);

  const serial = order.serial_number ?? `S${order.order_number}`;

  return (
    <div className="relative min-h-screen overflow-hidden pb-16">
      {!isReady && (
        <>
          <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-blob" aria-hidden />
          <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl animate-blob" style={{ animationDelay: "4s" }} aria-hidden />
        </>
      )}

      <AppHeader title={`Order ${serial}`} subtitle="Self pickup" showCart={false} />

      <div className="relative mx-auto max-w-md px-5 pt-6">
        {/* Serial number card — always visible at top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 overflow-hidden rounded-[28px] border border-glass-border bg-[var(--gradient-card)] p-5 text-center shadow-elevated"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
            Your serial number
          </p>
          <motion.p
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 14 }}
            className="mt-1 text-6xl font-black leading-none tracking-tight text-gradient-primary"
          >
            {serial}
          </motion.p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] text-muted-foreground">
            <Wallet className="h-3 w-3" />
            Show this at the billing counter to pay
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isReady ? (
            <ReadyCelebration
              key="ready"
              serial={serial}
              pickupInstructions={restaurant.pickup_instructions ?? ""}
            />
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[28px] border border-glass-border bg-[var(--gradient-card)] p-6 text-center shadow-elevated"
            >
              <CurrentStageCard status={status} />

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/[0.04] px-3.5 py-1.5 text-[11px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="font-semibold tabular-nums">~{etaMin} min</span>
                <span className="text-muted-foreground">estimated</span>
              </div>

              <div className="mt-6 grid gap-2.5 text-left">
                {CUSTOMER_PROGRESS.map((s, i) => {
                  const Meta = STAGE_META[s];
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  return (
                    <motion.div
                      key={s}
                      layout
                      initial={false}
                      animate={{ scale: active ? 1.01 : 1 }}
                      transition={{ type: "spring", damping: 22, stiffness: 320 }}
                      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-sm transition-colors duration-300 ${
                        active
                          ? "border-primary/50 bg-primary/10 shadow-glow"
                          : done
                            ? "border-success/30 bg-success/5"
                            : "border-glass-border bg-white/[0.02]"
                      }`}
                    >
                      <span
                        className={`relative flex h-8 w-8 flex-none items-center justify-center rounded-full ${
                          done
                            ? "gradient-success-bg text-success-foreground"
                            : active
                              ? "gradient-primary-bg text-primary-foreground"
                              : "bg-white/5 text-muted-foreground"
                        }`}
                      >
                        {active && <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />}
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <Meta.icon className="h-4 w-4" />}
                      </span>
                      <span className={`flex-1 ${active ? "font-semibold" : done ? "text-muted-foreground line-through" : ""}`}>
                        {STATUS_LABELS[s]}
                      </span>
                      {active && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Now</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isReady && currentIdx >= 1 && <CookingTip />}

        <div className="mt-5 rounded-3xl border border-glass-border bg-white/[0.03] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your order</h3>
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
                <span className="text-muted-foreground tabular-nums">
                  {formatCurrency(Number(it.line_total))}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-glass-border pt-3 text-base font-bold">
            <span>Total to pay</span>
            <span className="tabular-nums">{formatCurrency(Number(order.total), restaurant.currency_symbol)}</span>
          </div>
        </div>

        <Link
          to="/menu"
          className="mt-5 block text-center text-xs text-muted-foreground transition hover:text-foreground"
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
  const isCooking = status === "preparing";
  return (
    <div className="relative">
      <div className="relative mx-auto inline-flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style={{ animationDelay: "0.6s" }} />
        {isCooking && (
          <>
            <span className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/60 blur-sm animate-steam" />
            <span className="absolute -top-2 left-1/3 h-1.5 w-1.5 rounded-full bg-white/40 blur-sm animate-steam" style={{ animationDelay: "0.8s" }} />
            <span className="absolute -top-2 right-1/3 h-1.5 w-1.5 rounded-full bg-white/40 blur-sm animate-steam" style={{ animationDelay: "1.6s" }} />
          </>
        )}
        <motion.span
          animate={isCooking ? { rotate: [0, -6, 6, -4, 4, 0] } : { y: [0, -6, 0] }}
          transition={{ duration: isCooking ? 1.4 : 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-flex h-24 w-24 items-center justify-center rounded-full gradient-primary-bg shadow-glow"
        >
          <Icon className="h-10 w-10 text-primary-foreground" />
        </motion.span>
      </div>
      <motion.h2
        key={status}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-2xl font-bold tracking-tight"
      >
        {Meta.label}
      </motion.h2>
      <motion.p
        key={`${status}-tip`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-2 text-sm text-muted-foreground"
      >
        {Meta.tip}
      </motion.p>
    </div>
  );
}

function CookingTip() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % COOKING_TIPS.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 overflow-hidden rounded-2xl border border-glass-border bg-white/[0.03] px-4 py-3"
    >
      <div className="flex items-start gap-2.5">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none text-primary animate-sparkle" />
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-[12px] leading-relaxed text-muted-foreground"
          >
            {COOKING_TIPS[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ReadyCelebration({ serial, pickupInstructions }: { serial: string; pickupInstructions: string }) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 18, stiffness: 220 }}
      className="relative overflow-hidden rounded-[28px] border-2 p-8 text-center shadow-glow-success"
      style={{ borderColor: "var(--success)", background: "var(--gradient-success)" }}
    >
      <div className="pointer-events-none absolute inset-0 shine-overlay" />

      <div className="relative mx-auto inline-flex h-32 w-32 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-white/30 animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" style={{ animationDelay: "0.6s" }} />
        <motion.span
          animate={{ rotate: [0, -14, 14, -10, 10, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-flex h-28 w-28 items-center justify-center rounded-full bg-white text-success shadow-elevated"
        >
          <Bell className="h-12 w-12" />
        </motion.span>
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-success-foreground/85">
        Ready for pickup
      </p>
      <motion.p
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 14 }}
        className="mt-2 text-7xl font-black leading-none tracking-tight text-success-foreground"
      >
        {serial}
      </motion.p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-success-foreground">
        <MapPin className="h-3.5 w-3.5" /> Billing counter
      </div>

      {pickupInstructions && (
        <p className="mt-4 text-sm leading-relaxed text-success-foreground/90">{pickupInstructions}</p>
      )}
    </motion.div>
  );
}
