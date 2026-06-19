import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Flame, TrendingUp, X } from "lucide-react";
import {
  categoriesQuery,
  menuItemsQuery,
  restaurantQuery,
  type MenuItem,
} from "@/lib/menu.queries";
import { ItemCard } from "@/components/customer/ItemCard";
import { ItemSheet } from "@/components/customer/ItemSheet";
import { AppHeader } from "@/components/customer/AppHeader";
import { FloatingCartBar } from "@/components/customer/FloatingCartBar";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [{ title: "Menu — Albaik" }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
    context.queryClient.ensureQueryData(menuItemsQuery);
  },
  component: MenuPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8">Menu not found.</div>,
});

type Tab = "best" | "chef" | "new" | string;

function MenuPage() {
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: items } = useSuspenseQuery(menuItemsQuery);
  const [activeCat, setActiveCat] = useState<Tab>("best");
  const [search, setSearch] = useState("");
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);

  const filtered = useMemo(() => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description ?? "").toLowerCase().includes(q),
      );
    }
    if (activeCat === "best") return items.filter((i) => i.is_bestseller);
    if (activeCat === "chef") return items.filter((i) => i.is_recommended);
    if (activeCat === "new") return items.filter((i) => i.is_new);
    return items.filter((i) => i.category_id === activeCat);
  }, [items, activeCat, search]);

  const featured = useMemo(
    () => items.filter((i) => i.is_recommended).slice(0, 6),
    [items],
  );

  const activeLabel = (() => {
    if (search.trim()) return `Results for "${search.trim()}"`;
    if (activeCat === "best") return "🔥 Best Sellers";
    if (activeCat === "chef") return "✨ Chef's Picks";
    if (activeCat === "new") return "🆕 New This Week";
    return categories.find((c) => c.id === activeCat)?.name ?? "Menu";
  })();

  return (
    <div className="min-h-screen pb-32">
      <AppHeader title={restaurant.name} subtitle={restaurant.tagline ?? "Order, pay at the counter"} backTo="/" />

      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative mt-4"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, e.g. peri peri"
            aria-label="Search the menu"
            className="w-full rounded-2xl border border-glass-border bg-white/[0.04] py-3.5 pl-11 pr-10 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </motion.div>

        {!search && featured.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="mt-5"
            aria-label="Chef's picks"
          >
            <div className="flex items-baseline justify-between px-1">
              <h2 className="text-sm font-semibold tracking-tight">
                <Sparkles className="mr-1 inline-block h-3.5 w-3.5 text-primary" />
                Chef's picks
              </h2>
              <button
                onClick={() => setActiveCat("chef")}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                See all →
              </button>
            </div>
            <div className="no-scrollbar mt-2 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
              {featured.map((it, i) => (
                <motion.button
                  key={it.id}
                  type="button"
                  onClick={() => setSheetItem(it)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative w-[180px] flex-none snap-start overflow-hidden rounded-3xl border border-glass-border bg-[var(--gradient-card)] text-left shadow-card"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    {it.image_url ? (
                      <img
                        src={it.image_url}
                        alt={it.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl opacity-30">🍽</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-primary backdrop-blur">
                      <Sparkles className="h-2.5 w-2.5" /> Chef
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{it.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ₹{Math.round(it.price)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {!search && (
          <div className="sticky top-[58px] z-20 -mx-4 mt-4 bg-background/80 px-4 py-2 backdrop-blur-xl">
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
              <CategoryPill label="🔥 Best Sellers" active={activeCat === "best"} onClick={() => setActiveCat("best")} />
              <CategoryPill label="✨ Chef's Picks" active={activeCat === "chef"} onClick={() => setActiveCat("chef")} icon={Sparkles} />
              <CategoryPill label="🆕 New" active={activeCat === "new"} onClick={() => setActiveCat("new")} icon={TrendingUp} />
              {categories.map((c) => (
                <CategoryPill
                  key={c.id}
                  label={`${c.emoji ?? ""} ${c.name}`}
                  active={activeCat === c.id}
                  onClick={() => setActiveCat(c.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between px-1">
          <h2 className="text-base font-bold tracking-tight">{activeLabel}</h2>
          <span className="text-[11px] text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat + search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 grid gap-3"
          >
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-glass-border bg-white/[0.02] py-14 text-center">
                <div className="text-5xl">🥲</div>
                <p className="mt-3 text-sm font-medium">No dishes match</p>
                <p className="mt-1 text-xs text-muted-foreground">Try a different search or category.</p>
              </div>
            ) : (
              filtered.map((it, i) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.035, 0.25), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ItemCard item={it} onClick={() => setSheetItem(it)} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ItemSheet item={sheetItem} open={!!sheetItem} onClose={() => setSheetItem(null)} />
      <FloatingCartBar />
    </div>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: typeof Flame;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-none whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active
          ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
          : "border-glass-border bg-white/[0.03] text-muted-foreground hover:border-white/15 hover:bg-white/[0.06] hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
