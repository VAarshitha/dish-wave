import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Soup, BadgeCheck, Wallet, MapPin } from "lucide-react";
import logo from "@/assets/albaik-logo.png";
import { restaurantQuery } from "@/lib/menu.queries";

const ADDRESS = "13-264, Avenue Road, Near Bangalore Bus Stand, Madanapalle";
const WEBSITE = "www.albaikindia.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Albaik Madanapalle — Fix Your Cravings" },
      {
        name: "description",
        content:
          "Albaik Madanapalle — India's beloved QSR brand. Browse the menu, place your order and pay at the counter.",
      },
      { property: "og:title", content: "Albaik Madanapalle — Fix Your Cravings" },
      {
        property: "og:description",
        content: "India's Beloved QSR Brand. Freshly prepared, hygienically cooked.",
      },
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
        <header className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2.5 text-sm font-semibold">
            <img
              src={logo}
              alt="Albaik Madanapalle"
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl shadow-glow"
            />
            <span className="leading-tight">
              {restaurant.name}
              <span className="block text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
                Madanapalle
              </span>
            </span>
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
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <img
              src={logo}
              alt="Albaik Madanapalle logo"
              width={1024}
              height={1024}
              fetchPriority="high"
              className="h-44 w-44 rounded-[36px] shadow-elevated sm:h-56 sm:w-56"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Fix Your Cravings
            </span>

            <h1 className="mt-5 text-[40px] font-black leading-[1.05] tracking-tight sm:text-6xl">
              {restaurant.name}
            </h1>

            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-gradient-primary">
              India's Beloved QSR Brand
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Freshly Prepared • Hygienically Cooked • Served with Quality
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <Link
              to="/menu"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full gradient-primary-bg px-8 py-4 text-base font-bold text-primary-foreground shadow-glow transition active:scale-[0.985] sm:w-auto sm:px-12"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 ease-out group-hover:translate-x-full" />
              Start Ordering
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Soup, title: "Browse Menu", desc: "Explore our freshly prepared dishes." },
              { icon: BadgeCheck, title: "Place Order", desc: "Get a daily serial number — S1, S2…" },
              { icon: Wallet, title: "Pay at Counter", desc: "Show your serial and pick up." },
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

          <footer className="mt-12 rounded-2xl border border-glass-border bg-white/[0.03] p-5 text-center">
            <p className="flex items-start justify-center gap-2 text-xs leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-primary" />
              <span>📍 {ADDRESS}</span>
            </p>
            <a
              href={`https://${WEBSITE}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
            >
              {WEBSITE}
            </a>
            <p className="mt-3 text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} {restaurant.name}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
