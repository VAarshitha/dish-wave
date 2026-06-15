import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useSuspenseQuery, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as restaurantQuery, c as categoriesQuery, m as menuItemsQuery, a as addonsForItemQuery } from "./router-BEfqKPEM.mjs";
import { f as formatCurrency } from "./format-B1uvLlm3.mjs";
import { u as useTable, a as useCart, c as cartTotal, b as addToCart } from "./cart-Chd1RMsz.mjs";
import { A as AppHeader } from "./AppHeader-DWMiTBOw.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { S as Search, X, a as Sparkles, T as TrendingUp, b as Trophy, F as Flame, C as Clock, P as Plus, L as Leaf, D as Drumstick, M as Minus, c as ShoppingBag, A as ArrowRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./client-CLDxxxcm.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function VegBadge({ isVeg }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      title: isVeg ? "Vegetarian" : "Non-vegetarian",
      className: "inline-flex h-4 w-4 items-center justify-center rounded-sm border",
      style: {
        borderColor: isVeg ? "var(--veg)" : "var(--nonveg)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "block h-2 w-2 rounded-full",
          style: { backgroundColor: isVeg ? "var(--veg)" : "var(--nonveg)" }
        }
      )
    }
  );
}
function ItemCard({
  item,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      onClick,
      whileHover: { y: -3 },
      whileTap: { scale: 0.985 },
      transition: { type: "spring", damping: 22, stiffness: 320 },
      className: "group relative flex w-full gap-4 overflow-hidden rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-3 text-left shadow-card transition-colors duration-300 hover:border-primary/30 hover:shadow-elevated",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-28 w-28 flex-none overflow-hidden rounded-2xl bg-muted shadow-card", children: [
          item.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.image_url,
              alt: item.name,
              loading: "lazy",
              className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-3xl opacity-30", children: "🍽" }),
          item.is_bestseller && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-primary backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-2.5 w-2.5" }),
            " Best"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(VegBadge, { isVeg: item.is_veg }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-[15px] font-semibold tracking-tight", children: item.name })
          ] }),
          item.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground", children: item.description }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground/80", children: [
            item.is_recommended && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 font-medium text-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5" }),
              " Chef"
            ] }),
            item.spice_level === "spicy" || item.spice_level === "extra_spicy" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-destructive/15 px-1.5 py-0.5 font-medium text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-2.5 w-2.5" }),
              item.spice_level === "extra_spicy" ? "Hot" : "Spicy"
            ] }) : null,
            item.is_new && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/15 px-1.5 py-0.5 font-medium text-primary", children: "New" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
              " ",
              item.prep_time_min,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[17px] font-bold tracking-tight", children: formatCurrency(item.price) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.span,
              {
                whileTap: { scale: 0.9 },
                className: "inline-flex items-center gap-1 rounded-full gradient-primary-bg px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                  " Add"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const SPICE_DOTS = {
  none: { dots: 0, label: "No spice" },
  mild: { dots: 1, label: "Mild" },
  medium: { dots: 2, label: "Medium" },
  spicy: { dots: 3, label: "Spicy" },
  extra_spicy: { dots: 4, label: "Extra hot" }
};
function ItemSheet({
  item,
  open,
  onClose
}) {
  const [qty, setQty] = reactExports.useState(1);
  const [addons, setAddons] = reactExports.useState([]);
  const [notes, setNotes] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (open) {
      setQty(1);
      setAddons([]);
      setNotes("");
    }
  }, [open, item?.id]);
  reactExports.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  const { data: itemAddons = [] } = useQuery({
    ...addonsForItemQuery(item?.id ?? ""),
    enabled: !!item?.id && open
  });
  const lineBase = item?.price ?? 0;
  const addonSum = reactExports.useMemo(() => addons.reduce((s, a) => s + a.price, 0), [addons]);
  const total = (lineBase + addonSum) * qty;
  function toggleAddon(a) {
    setAddons(
      (prev) => prev.find((x) => x.name === a.name) ? prev.filter((x) => x.name !== a.name) : [...prev, a]
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
      specialInstructions: notes || void 0
    });
    try {
      navigator.vibrate?.(12);
    } catch {
    }
    onClose();
  }
  const spice = item ? SPICE_DOTS[item.spice_level] ?? SPICE_DOTS.none : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && item ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      role: "dialog",
      "aria-modal": "true",
      "aria-label": item.name,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute inset-0 bg-black/75 backdrop-blur-md",
            onClick: onClose,
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { y: 80, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: 80, opacity: 0 },
            transition: { type: "spring", damping: 28, stiffness: 300 },
            drag: "y",
            dragConstraints: { top: 0, bottom: 0 },
            dragElastic: { top: 0, bottom: 0.4 },
            onDragEnd: (_, info) => {
              if (info.offset.y > 120) onClose();
            },
            className: "relative z-10 mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-t-[28px] border border-glass-border glass-strong sm:rounded-[28px]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 top-2 z-20 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-10 rounded-full bg-white/30" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-64 w-full overflow-hidden", children: [
                item.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.img,
                  {
                    src: item.image_url,
                    alt: item.name,
                    initial: { scale: 1.1 },
                    animate: { scale: 1 },
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                    className: "h-full w-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-7xl opacity-40", children: "🍽" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80",
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-card via-card/60 to-transparent" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[55vh] overflow-y-auto px-5 pb-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(VegBadge, { isVeg: item.is_veg }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "truncate text-2xl font-bold tracking-tight", children: item.name })
                ] }),
                item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: item.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
                      label: "Prep time",
                      value: `${item.prep_time_min} min`
                    }
                  ),
                  item.calories ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5" }),
                      label: "Calories",
                      value: `${item.calories} kcal`
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      icon: item.is_veg ? /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Drumstick, { className: "h-3.5 w-3.5" }),
                      label: "Type",
                      value: item.is_veg ? "Vegetarian" : "Non-veg"
                    }
                  ),
                  spice && spice.dots > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5 text-destructive" }),
                      label: "Spice",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-0.5", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `h-1.5 w-1.5 rounded-full ${i < spice.dots ? "bg-destructive" : "bg-white/15"}`
                        },
                        i
                      )) })
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "h-3.5 w-3.5 text-success" }),
                      label: "Spice",
                      value: "None"
                    }
                  )
                ] }),
                item.tags?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-1.5", children: item.tags.slice(0, 6).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "rounded-full border border-glass-border bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-muted-foreground",
                    children: t
                  },
                  t
                )) }) : null,
                itemAddons.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Customize" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid gap-1.5", children: itemAddons.map((a) => {
                    const selected = !!addons.find((x) => x.name === a.name);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.button,
                      {
                        whileTap: { scale: 0.98 },
                        type: "button",
                        onClick: () => toggleAddon({ name: a.name, price: Number(a.price) }),
                        className: `flex items-center justify-between rounded-2xl border px-3.5 py-3 text-sm transition-all duration-200 ${selected ? "border-primary/60 bg-primary/10 shadow-glow" : "border-glass-border bg-white/[0.02] hover:bg-white/[0.04]"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: `flex h-5 w-5 items-center justify-center rounded-md border transition ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"}`,
                                children: selected ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", children: "✓" }) : null
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: a.name })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                            "+ ",
                            formatCurrency(Number(a.price))
                          ] })
                        ]
                      },
                      a.id
                    );
                  }) })
                ] }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Special instructions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: notes,
                      onChange: (e) => setNotes(e.target.value),
                      rows: 2,
                      placeholder: "e.g. extra crispy, no onion",
                      className: "mt-2 w-full resize-none rounded-2xl border border-glass-border bg-white/[0.03] p-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/15"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 border-t border-glass-border bg-card/85 p-4 backdrop-blur", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1 rounded-full bg-white/5 p-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setQty((q) => Math.max(1, q - 1)),
                      className: "inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90",
                      "aria-label": "Decrease quantity",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.span,
                    {
                      initial: { scale: 0.7, opacity: 0.5 },
                      animate: { scale: 1, opacity: 1 },
                      transition: { type: "spring", damping: 18, stiffness: 360 },
                      className: "w-7 text-center text-sm font-semibold tabular-nums",
                      children: qty
                    },
                    qty
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setQty((q) => q + 1),
                      className: "inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90",
                      "aria-label": "Increase quantity",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    onClick: handleAdd,
                    whileTap: { scale: 0.97 },
                    className: "relative flex-1 overflow-hidden rounded-full gradient-primary-bg px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-10 inline-flex w-full items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add to cart" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.span,
                        {
                          initial: { y: -6, opacity: 0 },
                          animate: { y: 0, opacity: 1 },
                          transition: { duration: 0.25 },
                          className: "tabular-nums",
                          children: formatCurrency(total)
                        },
                        total
                      )
                    ] })
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  ) : null });
}
function StatCard({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-glass-border bg-white/[0.03] px-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[13px] font-semibold leading-tight", children: value })
  ] });
}
function FloatingCartBar() {
  const cart = useCart();
  const count = cart.lines.reduce((s, l) => s + l.qty, 0);
  const total = cartTotal(cart.lines);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { y: 80, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 80, opacity: 0 },
      transition: { type: "spring", damping: 24, stiffness: 280 },
      className: "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-5 pt-3",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto mx-auto max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/cart",
          className: "flex items-center justify-between gap-3 rounded-full gradient-primary-bg p-2 pl-5 shadow-glow",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm font-semibold text-primary-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5" }) }),
              count,
              " ",
              count === 1 ? "item" : "items",
              " · ",
              formatCurrency(total)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-black/25 px-4 py-2 text-sm font-semibold text-primary-foreground", children: [
              "View cart ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
            ] })
          ]
        }
      ) })
    }
  ) : null });
}
function MenuPage() {
  const {
    data: restaurant
  } = useSuspenseQuery(restaurantQuery);
  const {
    data: categories
  } = useSuspenseQuery(categoriesQuery);
  const {
    data: items
  } = useSuspenseQuery(menuItemsQuery);
  const table = useTable();
  const [activeCat, setActiveCat] = reactExports.useState("best");
  const [search, setSearch] = reactExports.useState("");
  const [sheetItem, setSheetItem] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return items.filter((i) => i.name.toLowerCase().includes(q) || (i.description ?? "").toLowerCase().includes(q));
    }
    if (activeCat === "best") return items.filter((i) => i.is_bestseller);
    if (activeCat === "chef") return items.filter((i) => i.is_recommended);
    if (activeCat === "new") return items.filter((i) => i.is_new);
    return items.filter((i) => i.category_id === activeCat);
  }, [items, activeCat, search]);
  const featured = reactExports.useMemo(() => items.filter((i) => i.is_recommended).slice(0, 6), [items]);
  const activeLabel = (() => {
    if (search.trim()) return `Results for "${search.trim()}"`;
    if (activeCat === "best") return "🔥 Best Sellers";
    if (activeCat === "chef") return "✨ Chef's Picks";
    if (activeCat === "new") return "🆕 New This Week";
    return categories.find((c) => c.id === activeCat)?.name ?? "Menu";
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, { title: restaurant.name, subtitle: table ? `${table.label} · Self pickup` : restaurant.tagline ?? "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 6
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.35
      }, className: "relative mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search dishes, e.g. peri peri", "aria-label": "Search the menu", className: "w-full rounded-2xl border border-glass-border bg-white/[0.04] py-3.5 pl-11 pr-10 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/15" }),
        search ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearch(""), "aria-label": "Clear search", className: "absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) }) : null
      ] }),
      !search && featured.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.05,
        duration: 0.45
      }, className: "mt-5", "aria-label": "Chef's picks", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold tracking-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-1 inline-block h-3.5 w-3.5 text-primary" }),
            "Chef's picks"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveCat("chef"), className: "text-[11px] font-medium text-muted-foreground hover:text-foreground", children: "See all →" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "no-scrollbar mt-2 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1", children: featured.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { type: "button", onClick: () => setSheetItem(it), initial: {
          opacity: 0,
          y: 10
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: 0.05 * i,
          duration: 0.35
        }, whileHover: {
          y: -3
        }, whileTap: {
          scale: 0.97
        }, className: "group relative w-[180px] flex-none snap-start overflow-hidden rounded-3xl border border-glass-border bg-[var(--gradient-card)] text-left shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[5/4] overflow-hidden", children: [
            it.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.image_url, alt: it.name, loading: "lazy", className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-4xl opacity-30", children: "🍽" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-primary backdrop-blur", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5" }),
              " Chef"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: it.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
              "₹",
              Math.round(it.price),
              " · ",
              it.prep_time_min,
              " min"
            ] })
          ] })
        ] }, it.id)) })
      ] }),
      !search && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-[58px] z-20 -mx-4 mt-4 bg-background/80 px-4 py-2 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryPill, { label: "🔥 Best Sellers", active: activeCat === "best", onClick: () => setActiveCat("best") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryPill, { label: "✨ Chef's Picks", active: activeCat === "chef", onClick: () => setActiveCat("chef"), icon: Sparkles }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryPill, { label: "🆕 New", active: activeCat === "new", onClick: () => setActiveCat("new"), icon: TrendingUp }),
        categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryPill, { label: `${c.emoji ?? ""} ${c.name}`, active: activeCat === c.id, onClick: () => setActiveCat(c.id) }, c.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold tracking-tight", children: activeLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
          filtered.length,
          " ",
          filtered.length === 1 ? "dish" : "dishes"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: -6
      }, transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1]
      }, className: "mt-3 grid gap-3", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-glass-border bg-white/[0.02] py-14 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: "🥲" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-medium", children: "No dishes match" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Try a different search or category." })
      ] }) : filtered.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 14
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: Math.min(i * 0.035, 0.25),
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemCard, { item: it, onClick: () => setSheetItem(it) }) }, it.id)) }, activeCat + search) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ItemSheet, { item: sheetItem, open: !!sheetItem, onClose: () => setSheetItem(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingCartBar, {})
  ] });
}
function CategoryPill({
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick, className: `relative flex-none whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${active ? "border-primary/60 bg-primary/15 text-foreground shadow-glow" : "border-glass-border bg-white/[0.03] text-muted-foreground hover:border-white/15 hover:bg-white/[0.06] hover:text-foreground"}`, children: label });
}
export {
  MenuPage as component
};
