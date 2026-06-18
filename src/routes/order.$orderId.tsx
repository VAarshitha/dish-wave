import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Wallet, MapPin } from "lucide-react";
import { AppHeader } from "@/components/customer/AppHeader";
import { orderQuery } from "@/lib/orders.queries";
import { restaurantQuery } from "@/lib/menu.queries";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({ meta: [{ title: "Order placed — Albaik Madanapalle" }] }),
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(orderQuery(params.orderId));
  },
  component: OrderPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Order not found.</div>,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const { data } = useSuspenseQuery(orderQuery(orderId));
  const { order, items } = data;

  const serial = order.serial_number ?? `S${order.order_number}`;

  return (
    <div className="relative min-h-screen overflow-hidden pb-16">
      <AppHeader title="Order placed" subtitle="Pay at counter" showCart={false} />

      <div className="relative mx-auto max-w-md px-5 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[28px] border border-glass-border bg-[var(--gradient-card)] p-7 text-center shadow-elevated"
        >
          <div className="relative mx-auto inline-flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-success/30 animate-pulse-ring" />
            <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full gradient-success-bg text-success-foreground">
              <CheckCircle2 className="h-7 w-7" />
            </span>
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight">Order Placed Successfully</h2>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
            Daily Serial Number
          </p>
          <motion.p
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 14 }}
            className="mt-1 text-7xl font-black leading-none tracking-tight text-gradient-primary"
          >
            {serial}
          </motion.p>

          <div className="mt-6 rounded-2xl border border-glass-border bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Total Amount
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums">
              {formatCurrency(Number(order.total), restaurant.currency_symbol)}
            </p>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full gradient-primary-bg px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow">
            <Wallet className="h-4 w-4" /> Pay at Counter
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Thank you for choosing <span className="font-semibold text-foreground">{restaurant.name}</span>
          </p>
        </motion.div>

        <div className="mt-5 rounded-3xl border border-glass-border bg-white/[0.03] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your order
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="font-medium">
                    {it.qty}× {it.name_snapshot}
                  </span>
                  {it.addons?.length > 0 && (
                    <span className="block truncate text-[11px] text-muted-foreground">
                      + {it.addons.map((a) => a.name).join(", ")}
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatCurrency(Number(it.line_total))}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-glass-border pt-3 text-base font-bold">
            <span>Total to pay</span>
            <span className="tabular-nums">
              {formatCurrency(Number(order.total), restaurant.currency_symbol)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-glass-border bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-primary" />
          <span>Show your serial number <span className="font-semibold text-foreground">{serial}</span> at the billing counter to pay.</span>
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
