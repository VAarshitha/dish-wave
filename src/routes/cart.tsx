import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, Tag, Clock, ShoppingBag, X, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/customer/AppHeader";
import {
  useCart,
  updateQty,
  removeLine,
  cartTotal,
  lineTotal,
  useTable,
  clearCart,
} from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { restaurantQuery, menuItemsQuery } from "@/lib/menu.queries";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "@/lib/restaurant";

const TAX_RATE = 0.05; // 5% GST

const COUPONS: Record<string, { off: number; label: string }> = {
  ALBAIK10: { off: 0.1, label: "10% off your meal" },
  WELCOME20: { off: 0.2, label: "Welcome — 20% off" },
};

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — Albaik" }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(menuItemsQuery);
  },
  component: CartPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => null,
});

function CartPage() {
  const cart = useCart();
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const { data: items } = useSuspenseQuery(menuItemsQuery);
  const table = useTable();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const subtotal = cartTotal(cart.lines);
  const discount = appliedCoupon ? subtotal * (COUPONS[appliedCoupon]?.off ?? 0) : 0;
  const taxableBase = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableBase * TAX_RATE * 100) / 100;
  const total = Math.round((taxableBase + tax) * 100) / 100;

  // Estimated prep time = max of selected items
  const prepTime = useMemo(() => {
    if (cart.lines.length === 0) return 0;
    const map = new Map(items.map((i) => [i.id, i.prep_time_min]));
    return Math.max(...cart.lines.map((l) => map.get(l.itemId) ?? 12), 8);
  }, [cart.lines, items]);

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setErr(null);
    } else if (code) {
      setErr("Invalid coupon code");
    }
  }

  async function placeOrder() {
    if (cart.lines.length === 0) return;
    setSubmitting(true);
    setErr(null);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          restaurant_id: DEMO_RESTAURANT_ID,
          table_id: table?.id ?? null,
          table_label: table?.label ?? null,
          customer_name: name || null,
          customer_phone: phone || null,
          subtotal,
          tax,
          total,
          status: "pending_payment",
          payment_status: "pending",
        })
        .select("id")
        .single();
      if (error || !order) throw error ?? new Error("Order failed");

      const rows = cart.lines.map((l) => ({
        order_id: order.id,
        item_id: l.itemId,
        name_snapshot: l.name,
        price_snapshot: l.price,
        qty: l.qty,
        addons: l.addons,
        special_instructions: l.specialInstructions ?? null,
        line_total: lineTotal(l),
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(rows);
      if (itemsErr) throw itemsErr;

      clearCart();
      navigate({ to: "/pay/$orderId", params: { orderId: order.id } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pb-40">
      <AppHeader title="Your cart" subtitle={table?.label ?? "Self pickup"} backTo="/menu" showCart={false} />
      <div className="mx-auto max-w-3xl px-4 pt-5">
        {cart.lines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 text-center"
          >
            <div className="relative mx-auto inline-flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/15 animate-pulse-ring" />
              <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] text-3xl">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </span>
            </div>
            <p className="mt-5 text-base font-semibold">Your cart is empty</p>
            <p className="mt-1 text-xs text-muted-foreground">Pick something delicious from the menu.</p>
            <Link
              to="/menu"
              className="mt-6 inline-flex rounded-full gradient-primary-bg px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Browse menu
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Pickup info card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex items-center gap-3 rounded-2xl border border-glass-border bg-white/[0.03] px-3.5 py-2.5"
            >
              <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full gradient-primary-bg text-primary-foreground">
                <Clock className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Ready in ~{prepTime} min</p>
                <p className="text-[11px] text-muted-foreground">Self pickup · {table?.label ?? "at the counter"}</p>
              </div>
            </motion.div>

            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {cart.lines.map((l) => (
                  <motion.div
                    key={l.key}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, scale: 0.95 }}
                    transition={{ type: "spring", damping: 26, stiffness: 320 }}
                    className="flex gap-3 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-3 shadow-card"
                  >
                    <div className="h-20 w-20 flex-none overflow-hidden rounded-2xl bg-muted">
                      {l.imageUrl ? (
                        <img src={l.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{l.name}</p>
                          {l.addons.length > 0 && (
                            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                              + {l.addons.map((a) => a.name).join(", ")}
                            </p>
                          )}
                          {l.specialInstructions && (
                            <p className="mt-0.5 line-clamp-1 text-[11px] italic text-muted-foreground">
                              "{l.specialInstructions}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeLine(l.key)}
                          aria-label="Remove"
                          className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center gap-0.5 rounded-full bg-white/5 p-0.5">
                          <button
                            onClick={() => updateQty(l.key, -1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <motion.span
                            key={l.qty}
                            initial={{ scale: 0.7, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 18, stiffness: 360 }}
                            className="w-5 text-center text-xs font-semibold tabular-nums"
                          >
                            {l.qty}
                          </motion.span>
                          <button
                            onClick={() => updateQty(l.key, +1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <motion.span
                          key={lineTotal(l)}
                          initial={{ y: -4, opacity: 0.5 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-sm font-semibold tabular-nums"
                        >
                          {formatCurrency(lineTotal(l))}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Coupon */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4"
            >
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Tag className="h-3.5 w-3.5" /> Apply coupon
              </h3>
              {appliedCoupon ? (
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-success/40 bg-success/10 px-3.5 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-success">{appliedCoupon} applied</p>
                    <p className="text-[11px] text-success/80">{COUPONS[appliedCoupon].label}</p>
                  </div>
                  <button
                    onClick={() => { setAppliedCoupon(null); setCoupon(""); }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/5"
                    aria-label="Remove coupon"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Try ALBAIK10"
                    className="flex-1 rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2.5 text-sm uppercase placeholder:text-muted-foreground/60 placeholder:normal-case focus:border-primary/50 focus:outline-none"
                  />
                  <button
                    onClick={applyCoupon}
                    className="rounded-xl border border-glass-border bg-white/[0.05] px-4 text-sm font-semibold transition hover:bg-white/[0.08]"
                  >
                    Apply
                  </button>
                </div>
              )}
            </motion.div>

            {/* Customer details */}
            <div className="mt-4 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your details (optional)
              </h3>
              <div className="mt-3 grid gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-4 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4 shadow-card">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bill summary
              </h3>
              <div className="mt-3 grid gap-2 text-sm">
                <Row label="Subtotal" value={formatCurrency(subtotal, restaurant.currency_symbol)} />
                {discount > 0 && (
                  <Row
                    label={`Discount (${appliedCoupon})`}
                    value={`− ${formatCurrency(discount, restaurant.currency_symbol)}`}
                    accent="success"
                  />
                )}
                <Row
                  label="GST (5%)"
                  value={formatCurrency(tax, restaurant.currency_symbol)}
                  muted
                />
                <div className="mt-1 border-t border-glass-border pt-3" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold">Total</span>
                  <motion.span
                    key={total}
                    initial={{ y: -4, opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xl font-bold tabular-nums tracking-tight"
                  >
                    {formatCurrency(total, restaurant.currency_symbol)}
                  </motion.span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-success" />
                Secured by UPI · No commission, no service charge
              </div>
            </div>

            {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
          </>
        )}
      </div>

      {cart.lines.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3"
        >
          <div className="mx-auto max-w-3xl">
            <motion.button
              onClick={placeOrder}
              whileTap={{ scale: 0.97 }}
              disabled={submitting}
              className="relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-full gradient-primary-bg px-6 py-4 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              <span className="tabular-nums">{formatCurrency(total)}</span>
              <span className="inline-flex items-center gap-1.5">
                {submitting ? "Placing order…" : "Continue to UPI payment"}
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: "success";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span
        className={`tabular-nums ${
          accent === "success" ? "text-success" : muted ? "text-muted-foreground" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
