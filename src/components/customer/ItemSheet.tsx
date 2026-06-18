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

  useEffect(() => {
    if (open) {
      setQty(1);
      setAddons([]);
    }
  }, [open, item?.id]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
    });
    try { navigator.vibrate?.(12); } catch { /* noop */ }
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
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
        >
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => { if (info.offset.y > 120) onClose(); }}
            className="relative z-10 mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-t-[28px] border border-glass-border glass-strong sm:rounded-[28px]"
          >
            {/* Drag handle */}
            <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2">
              <div className="h-1 w-10 rounded-full bg-white/30" />
            </div>

            {/* Hero image */}
            <div className="relative h-64 w-full overflow-hidden">
              {item.image_url ? (
                <motion.img
                  src={item.image_url}
                  alt={item.name}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-7xl opacity-40">🍽</div>
              )}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-card via-card/60 to-transparent" />
            </div>

            {/* Scrollable body */}
            <div className="max-h-[55vh] overflow-y-auto px-5 pb-2 pt-1">
              <div className="flex min-w-0 items-center gap-2">
                <VegBadge isVeg={item.is_veg} />
                <h2 className="truncate text-2xl font-bold tracking-tight">{item.name}</h2>
              </div>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              )}

              {item.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-glass-border bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {itemAddons.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customize
                  </h3>
                  <div className="mt-2 grid gap-1.5">
                    {itemAddons.map((a) => {
                      const selected = !!addons.find((x) => x.name === a.name);
                      return (
                        <motion.button
                          key={a.id}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => toggleAddon({ name: a.name, price: Number(a.price) })}
                          className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 text-sm transition-all duration-200 ${
                            selected
                              ? "border-primary/60 bg-primary/10 shadow-glow"
                              : "border-glass-border bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                                selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                              }`}
                            >
                              {selected ? <span className="text-[11px]">✓</span> : null}
                            </span>
                            <span className="font-medium">{a.name}</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            + {formatCurrency(Number(a.price))}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-glass-border bg-card/85 p-4 backdrop-blur">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <motion.span
                  key={qty}
                  initial={{ scale: 0.7, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 18, stiffness: 360 }}
                  className="w-7 text-center text-sm font-semibold tabular-nums"
                >
                  {qty}
                </motion.span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.97 }}
                className="relative flex-1 overflow-hidden rounded-full gradient-primary-bg px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                <span className="relative z-10 inline-flex w-full items-center justify-between">
                  <span>Add to cart</span>
                  <motion.span
                    key={total}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="tabular-nums"
                  >
                    {formatCurrency(total)}
                  </motion.span>
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

