import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, X } from "lucide-react";
import type { MenuItem } from "@/lib/menu.queries";
import { addonsForItemQuery } from "@/lib/menu.queries";
import { addToCart, type CartAddon } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { VegBadge } from "./VegBadge";

export function ItemSheet({
  item,
  open,
  onClose,
}: {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [addons, setAddons] = useState<CartAddon[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setQty(1);
      setAddons([]);
      setNotes("");
    }
  }, [open, item?.id]);

  const { data: itemAddons = [] } = useQuery({
    ...addonsForItemQuery(item?.id ?? ""),
    enabled: !!item?.id && open,
  });

  const lineBase = item?.price ?? 0;
  const addonSum = useMemo(() => addons.reduce((s, a) => s + a.price, 0), [addons]);
  const total = (lineBase + addonSum) * qty;

  function toggleAddon(a: { name: string; price: number }) {
    setAddons((prev) =>
      prev.find((x) => x.name === a.name)
        ? prev.filter((x) => x.name !== a.name)
        : [...prev, a],
    );
  }

  function handleAdd() {
    if (!item) return;
    addToCart({
      itemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.image_url,
      qty,
      addons,
      specialInstructions: notes || undefined,
    });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="relative z-10 mx-auto w-full max-w-md overflow-hidden rounded-t-3xl border border-glass-border glass-strong sm:rounded-3xl"
          >
            <div className="relative h-56 w-full overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl opacity-40">
                  🍽
                </div>
              )}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-5">
              <div className="flex items-center gap-2">
                <VegBadge isVeg={item.is_veg} />
                <h2 className="text-xl font-bold tracking-tight">{item.name}</h2>
              </div>
              {item.description && (
                <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                {item.calories ? <span>{item.calories} kcal</span> : null}
                <span>· {item.prep_time_min} min</span>
                {item.tags?.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>

              {itemAddons.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Add-ons
                  </h3>
                  <div className="mt-2 grid gap-1.5">
                    {itemAddons.map((a) => {
                      const selected = !!addons.find((x) => x.name === a.name);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => toggleAddon({ name: a.name, price: Number(a.price) })}
                          className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-sm transition ${
                            selected
                              ? "border-primary/50 bg-primary/10"
                              : "border-glass-border bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded border ${
                                selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                              }`}
                            >
                              {selected ? <span className="text-[10px]">✓</span> : null}
                            </span>
                            {a.name}
                          </span>
                          <span className="text-muted-foreground">
                            + {formatCurrency(Number(a.price))}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Special instructions
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. extra crispy, no onion"
                  className="mt-2 w-full resize-none rounded-2xl border border-glass-border bg-white/[0.03] p-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-glass-border bg-card/80 p-4 backdrop-blur">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-full gradient-primary-bg px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition active:scale-[0.98]"
              >
                Add to cart · {formatCurrency(total)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
