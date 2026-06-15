import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
import { useTable } from "@/lib/cart";

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

function MenuPage() {
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: items } = useSuspenseQuery(menuItemsQuery);
  const table = useTable();
  const [activeCat, setActiveCat] = useState<string | "best">("best");
  const [search, setSearch] = useState("");
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);

  const filtered = useMemo(() => {
    let list = items;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description ?? "").toLowerCase().includes(q),
      );
    } else if (activeCat === "best") {
      list = list.filter((i) => i.is_bestseller);
    } else {
      list = list.filter((i) => i.category_id === activeCat);
    }
    return list;
  }, [items, activeCat, search]);

  return (
    <div className="min-h-screen pb-28">
      <AppHeader
        title={restaurant.name}
        subtitle={table ? `${table.label} · Self pickup` : restaurant.tagline ?? ""}
      />
      <div className="mx-auto max-w-3xl px-4">
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, e.g. peri peri"
            className="w-full rounded-2xl border border-glass-border bg-white/[0.04] py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none"
          />
        </div>

        {!search && (
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
            <CategoryPill
              label="🔥 Best Sellers"
              active={activeCat === "best"}
              onClick={() => setActiveCat("best")}
            />
            {categories.map((c) => (
              <CategoryPill
                key={c.id}
                label={`${c.emoji ?? ""} ${c.name}`}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
              />
            ))}
          </div>
        )}

        <motion.div
          key={activeCat + search}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-5 grid gap-3"
        >
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No dishes match your search.
            </p>
          ) : (
            filtered.map((it) => (
              <ItemCard key={it.id} item={it} onClick={() => setSheetItem(it)} />
            ))
          )}
        </motion.div>
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
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
          : "border-glass-border bg-white/[0.03] text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
