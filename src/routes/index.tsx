import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QrCode, ChefHat, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-chicken.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Albaik — Scan. Order. Pick up." },
      {
        name: "description",
        content:
          "Premium QR-based restaurant ordering. Scan your table, browse the menu, pay with UPI, and pick up at the counter when ready.",
      },
      { property: "og:title", content: "Albaik — Scan. Order. Pick up." },
      { property: "og:description", content: "Premium QR ordering, zero waiting." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-glow" />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-5 pb-12 pt-10">
        <header className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </span>
            Albaik
          </span>
          <Link
            to="/auth"
            className="rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Staff sign in
          </Link>
        </header>

        <main className="mt-10 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Premium QR ordering
            </span>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Scan your table.{" "}
              <span className="text-gradient-primary">Skip the queue.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              Browse the menu, pay instantly with any UPI app, then pick up when
              your order is ready. No waiter, no wait.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="relative mt-10 overflow-hidden rounded-3xl border border-glass-border shadow-elevated"
          >
            <img
              src={heroImg}
              alt="Crispy fried chicken bucket"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-6">
              <p className="text-lg font-semibold">Try the demo</p>
              <p className="text-sm text-muted-foreground">
                Pick a table to simulate scanning a QR code.
              </p>
            </div>
          </motion.div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <Link
                key={n}
                to="/t/$qr"
                params={{ qr: `albaik-t${n}` }}
                className="group relative overflow-hidden rounded-2xl border border-glass-border bg-white/[0.03] p-4 text-center transition hover:border-primary/40 hover:bg-white/[0.06]"
              >
                <QrCode className="mx-auto h-5 w-5 text-primary" />
                <div className="mt-1.5 text-xs font-semibold">Table {n}</div>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Scan QR", "Open the menu instantly. No login."],
              ["Pay with UPI", "PhonePe, GPay, Paytm — your app, your way."],
              ["Live tracking", "Watch your order being prepared in real time."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-glass-border bg-white/[0.03] p-4"
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
