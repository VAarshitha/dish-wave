import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, Table2 } from "lucide-react";
import heroImg from "@/assets/hero-chicken.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Albaik — Scan. Order. Pick up." },
      {
        name: "description",
        content:
          "Premium QR-based restaurant ordering. Scan once, choose your table, browse the menu, pay with UPI, and pick up when ready.",
      },
      {
        property: "og:title",
        content: "Albaik — Scan. Order. Pick up.",
      },
      {
        property: "og:description",
        content: "Premium QR ordering experience.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-glow" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-5 pb-12 pt-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </span>
            Albaik
          </span>

          <Link
            to="/auth"
            className="rounded-full border border-glass-border bg-white/[0.04] px-4 py-2 text-xs text-muted-foreground transition hover:text-foreground"
          >
            Staff sign in
          </Link>
        </header>

        <main className="mt-10 flex-1">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Premium QR Ordering
            </span>

            <h1 className="mt-5 text-5xl font-bold leading-tight sm:text-6xl">
              Scan Once.
              <br />
              <span className="text-gradient-primary">
                Choose Your Table.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Browse the menu, pay instantly with any UPI app, then pick up your
              order when it's ready. Fast, simple and completely contactless.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mt-10 overflow-hidden rounded-3xl border border-glass-border shadow-elevated"
          >
            <img
              src={heroImg}
              alt="Albaik"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="aspect-[16/9] w-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-6">
              <p className="text-2xl font-bold">
                Welcome to Albaik
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please select your table to begin ordering.
              </p>
            </div>
          </motion.div>

          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-bold">
              Select Your Table
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Choose the table you're currently sitting at.
            </p>
          </motion.div>

          {/* Table Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((table) => (
              <Link
                key={table}
                to="/t/$qr"
                params={{
                  qr: `albaik-t${table}`,
                }}
                className="group rounded-2xl border border-glass-border bg-white/[0.04] p-5 text-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-glow"
              >
                <Table2 className="mx-auto h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />

                <div className="mt-3 text-base font-semibold">
                  Table {table}
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Features */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              [
                "Choose Table",
                "Select your table before placing an order.",
              ],
              [
                "Pay with UPI",
                "PhonePe, Google Pay, Paytm and any UPI app.",
              ],
              [
                "Live Order Tracking",
                "Track your food preparation in real time.",
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-glass-border bg-white/[0.03] p-5"
              >
                <h3 className="font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}