import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
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
import { restaurantQuery } from "@/lib/menu.queries";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "@/lib/restaurant";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — Albaik" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(restaurantQuery),
  component: CartPage,
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  notFoundComponent: () => null,
});

function CartPage() {
  const cart = useCart();
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const table = useTable();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const total = cartTotal(cart.lines);

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
          subtotal: total,
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
          <div className="mt-20 text-center">
            <div className="text-6xl">🛒</div>
            <p className="mt-3 text-sm text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/menu"
              className="mt-5 inline-flex rounded-full gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {cart.lines.map((l) => (
                  <motion.div
                    key={l.key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="flex gap-3 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-3"
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
                          className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-0.5">
                          <button
                            onClick={() => updateQty(l.key, -1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-semibold">{l.qty}</span>
                          <button
                            onClick={() => updateQty(l.key, +1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatCurrency(lineTotal(l))}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4">
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

            <div className="mt-4 rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(total, restaurant.currency_symbol)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(total, restaurant.currency_symbol)}</span>
              </div>
            </div>

            {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
          </>
        )}
      </div>

      {cart.lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-5 pt-3">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={placeOrder}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full gradient-primary-bg py-4 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Continue to UPI payment"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
