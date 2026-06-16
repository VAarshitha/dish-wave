import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Tag, Clock, ShoppingBag, X, ShieldCheck, Wallet } from "lucide-react";
import { AppHeader } from "@/components/customer/AppHeader";
import { useCart, updateQty, removeLine, cartTotal, lineTotal, clearCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { restaurantQuery, menuItemsQuery } from "@/lib/menu.queries";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "@/lib/restaurant";

const TAX_RATE = 0.05;

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
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const subtotal = cartTotal(cart.lines);
  const discount = appliedCoupon ? subtotal * (COUPONS[appliedCoupon]?.off ?? 0) : 0;
  const taxableBase = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableBase * TAX_RATE * 100) / 100;
  const total = Math.round((taxableBase + tax) * 100) / 100;

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
      const itemsPayload = cart.lines.map((l) => ({
        item_id: l.itemId,
        name_snapshot: l.name,
        price_snapshot: l.price,
        qty: l.qty,
        addons: l.addons,
        special_instructions: l.specialInstructions ?? "",
        line_total: lineTotal(l),
      }));

      const { data, error } = await supabase.rpc("place_order", {
        _restaurant_id: DEMO_RESTAURANT_ID,
        _subtotal: subtotal,
        _tax: tax,
        _total: total,
        _notes: appliedCoupon ? `Coupon: ${appliedCoupon}` : null,
        _items: itemsPayload as unknown as never,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.id) throw new Error("Could not create order");

      clearCart();
      navigate({ to: "/order/$orderId", params: { orderId: row.id } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pb-40">
      <AppHeader title="Your cart" subtitle="Pay at counter" backTo="/menu" showCart={false} />
      <div className="mx-auto max-w-3xl px-4 pt-5">
        {cart.lines.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-20 text-center">
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
                <p className="text-[11px] text-muted-foreground">Self pickup at the counter</p>
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
                      {l.imageUrl ? <img src={l.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
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
                        <span className="text-sm font-bold tabular-nums">
                          {formatCurrency(lineTotal(l), restaurant.currency_symbol)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Coupon */}
            <div className="mt-4 rounded-2xl border border-glass-border bg-white/[0.03] p-3">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Coupon code</span>
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="ALBAIK10"
                  disabled={!!appliedCoupon}
                  className="flex-1 rounded-xl border border-glass-border bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-wider placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none disabled:opacity-50"
                />
                {appliedCoupon ? (
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCoupon("");
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-glass-border bg-white/[0.04] px-3 text-[11px] hover:bg-white/[0.08]"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                ) : (
                  <button
                    onClick={applyCoupon}
                    className="rounded-xl bg-white/10 px-3 text-xs font-semibold hover:bg-white/15"
                  >
                    Apply
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-[11px] font-semibold text-success">
                  ✓ {COUPONS[appliedCoupon].label}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-4 rounded-2xl border border-glass-border bg-white/[0.03] p-4">
              <Row label="Subtotal" value={formatCurrency(subtotal, restaurant.currency_symbol)} />
              {discount > 0 && <Row label={`Discount (${appliedCoupon})`} value={`− ${formatCurrency(discount, restaurant.currency_symbol)}`} success />}
              <Row label="GST (5%)" value={formatCurrency(tax, restaurant.currency_symbol)} />
              <div className="my-2 border-t border-glass-border" />
              <Row label="Total" value={formatCurrency(total, restaurant.currency_symbol)} bold />
            </div>

            {/* Payment notice */}
            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-glass-border bg-white/[0.03] px-3.5 py-2.5">
              <Wallet className="mt-0.5 h-4 w-4 flex-none text-primary" />
              <div className="text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Pay at the counter.</span> Once you place
                the order you'll get a serial number — show it at the billing counter to pay and collect.
              </div>
            </div>

            {err && (
              <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {err}
              </p>
            )}
          </>
        )}
      </div>

      {/* Sticky place-order bar */}
      {cart.lines.length > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-glass-border bg-background/85 px-4 py-3 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground">Total</p>
              <p className="text-lg font-black tabular-nums">{formatCurrency(total, restaurant.currency_symbol)}</p>
            </div>
            <button
              onClick={placeOrder}
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full gradient-primary-bg px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition active:scale-[0.985] disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />
              {submitting ? "Placing…" : "Place order"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Row({ label, value, bold, success }: { label: string; value: string; bold?: boolean; success?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? "text-base font-bold" : "text-xs"}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className={`tabular-nums ${success ? "text-success" : ""}`}>{value}</span>
    </div>
  );
}
