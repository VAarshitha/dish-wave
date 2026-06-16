import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, ArrowRight, Clock, Soup, BadgeCheck } from "lucide-react";
import heroImg from "@/assets/hero-feast.jpg";
import { restaurantQuery } from "@/lib/menu.queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Albaik — Scan. Order. Pick up." },
      {
        name: "description",
        content:
          "Order at Albaik in seconds — scan, choose, place your order. Pay at the counter when you collect.",
      },
      { property: "og:title", content: "Albaik — Scan. Order. Pick up." },
      { property: "og:description", content: "Skip the line. Order from your phone." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(restaurantQuery);
  },
  component: Landing,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive">{error.message}</div>
  ),
});

function Landing() {
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-glow" aria-hidden />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-5 pb-10 pt-7 sm:pt-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl gradient-primary-bg text-primary-foreground shadow-glow">
              <ChefHat className="h-4 w-4" />
            </span>
            {restaurant.name}
          </span>
          <Link
            to="/auth"
            className="rounded-full border border-glass-border bg-white/[0.04] px-3.5 py-1.5 text-[11px] text-muted-foreground transition hover:text-foreground"
          >
            Staff sign in
          </Link>
        </header>

        <main className="mt-10 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Skip the line
            </span>

            <h1 className="mt-5 text-[44px] font-black leading-[1.02] tracking-tight sm:text-6xl">
              Scan. Order.
              <br />
              <span className="text-gradient-primary">Pick up.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {restaurant.tagline ??
                "Browse the menu, place your order, and pay at the counter when your serial number is called."}
            </p>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-9 overflow-hidden rounded-[28px] border border-glass-border shadow-elevated"
          >
            <img
              src={heroImg}
              alt="A spread of Albaik dishes"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-6">
              <p className="text-2xl font-bold">Tonight's hero menu</p>
              <p className="mt-1 text-sm text-muted-foreground">
                30+ chef-curated dishes, freshly prepared to order.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
          >
            <Link
              to="/menu"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full gradient-primary-bg px-6 py-4 text-base font-bold text-primary-foreground shadow-glow transition active:scale-[0.985] sm:w-auto sm:px-10"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 ease-out group-hover:translate-x-full" />
              Start Ordering
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="mt-3 text-[11px] text-muted-foreground">
              No login required. No online payment. Pay at the counter.
            </p>
          </motion.div>

          {/* How it works */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Soup, title: "Browse the menu", desc: "Photos, prep time and chef's picks." },
              { icon: BadgeCheck, title: "Place your order", desc: "Get a unique serial number — S1, S2…" },
              { icon: Clock, title: "Pickup when ready", desc: "Live status updates on your phone." },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="rounded-2xl border border-glass-border bg-white/[0.03] p-5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <s.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
