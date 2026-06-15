import { motion } from "framer-motion";
import { Flame, Plus, Sparkles, Trophy } from "lucide-react";
import { VegBadge } from "./VegBadge";
import type { MenuItem } from "@/lib/menu.queries";
import { formatCurrency } from "@/lib/format";

export function ItemCard({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex w-full gap-4 overflow-hidden rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-3 text-left shadow-elevated transition-colors hover:border-primary/30"
    >
      <div className="relative h-28 w-28 flex-none overflow-hidden rounded-2xl bg-muted">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl opacity-30">
            🍽
          </div>
        )}
        {item.is_bestseller && (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-primary backdrop-blur">
            <Trophy className="h-2.5 w-2.5" /> Best
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-center gap-2">
          <VegBadge isVeg={item.is_veg} />
          <h3 className="truncate text-sm font-semibold">{item.name}</h3>
        </div>
        {item.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {item.description}
          </p>
        ) : null}
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground/80">
          {item.is_recommended && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-accent">
              <Sparkles className="h-2.5 w-2.5" />
              Chef
            </span>
          )}
          {item.spice_level === "spicy" || item.spice_level === "extra_spicy" ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/15 px-1.5 py-0.5 text-destructive">
              <Flame className="h-2.5 w-2.5" />
              {item.spice_level === "extra_spicy" ? "Hot" : "Spicy"}
            </span>
          ) : null}
          {item.is_new && (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-primary">
              New
            </span>
          )}
          <span>· {item.prep_time_min} min</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-foreground">
            {formatCurrency(item.price)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full gradient-primary-bg px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
            <Plus className="h-3 w-3" />
            Add
          </span>
        </div>
      </div>
    </motion.button>
  );
}
