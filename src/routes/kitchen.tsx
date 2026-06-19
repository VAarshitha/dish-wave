import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Clock, Calendar } from "lucide-react";
import logo from "@/assets/albaik-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { restaurantQuery } from "@/lib/menu.queries";
import { formatCurrency } from "@/lib/format";
import { getRole, signOut } from "@/lib/auth";

export const Route = createFileRoute("/kitchen")({
  ssr: false,
  head: () => ({ meta: [{ title: "Kitchen Display — Albaik Madanapalle" }] }),
  beforeLoad: () => {
    if (getRole() !== "kitchen" && getRole() !== "admin") {
      throw redirect({ to: "/auth" });
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(restaurantQuery),
  component: KitchenRoute,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive">{error.message}</div>
  ),
});

type KOrder = {
  id: string;
  order_number: number;
  serial_number: string | null;
  serial_date: string | null;
  total: number;
  status: "received" | "preparing" | "ready" | "completed" | "cancelled";
  created_at: string;
};
type KItem = { id: string; order_id: string; name_snapshot: string; qty: number };

function playDing() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 740;
    g.gain.value = 0.07;
    o.start();
    o.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.stop(ctx.currentTime + 0.55);
  } catch {
    /* noop */
  }
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function KitchenRoute() {
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const today = todayISO();

  const { data: orders = [] } = useQuery({
    queryKey: ["kitchen", "orders", today],
    queryFn: async (): Promise<KOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,serial_number,serial_date,total,status,created_at")
        .eq("serial_date", today)
        .in("status", ["received", "preparing", "ready"])
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as KOrder[];
    },
    refetchInterval: 5000,
  });

  const orderIds = orders.map((o) => o.id);
  const { data: items = [] } = useQuery({
    queryKey: ["kitchen", "items", orderIds.join(",")],
    queryFn: async (): Promise<KItem[]> => {
      if (orderIds.length === 0) return [];
      const { data, error } = await supabase
        .from("order_items")
        .select("id,order_id,name_snapshot,qty")
        .in("order_id", orderIds);
      if (error) throw error;
      return (data ?? []) as KItem[];
    },
    enabled: orderIds.length > 0,
  });

  const seen = useRef<Set<string>>(new Set());
  useEffect(() => {
    const first = seen.current.size === 0;
    const fresh: string[] = [];
    orders.forEach((o) => {
      if (!seen.current.has(o.id)) {
        if (!first && o.status === "received") fresh.push(o.id);
        seen.current.add(o.id);
      }
    });
    if (fresh.length > 0) playDing();
  }, [orders]);

  useEffect(() => {
    const ch = supabase
      .channel("kitchen-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ["kitchen", "orders"] });
        qc.invalidateQueries({ queryKey: ["kitchen", "items"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  function handleSignOut() {
    signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass-strong">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <img src={logo} alt="Albaik" width={28} height={28} className="h-7 w-7 rounded-lg" />
            <span>Kitchen — {restaurant.name}</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-end justify-between">
          <h1 className="text-xl font-bold tracking-tight">Today's orders</h1>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs">
            {orders.length} pending
          </span>
        </div>

        <div className="grid gap-3">
          <AnimatePresence>
            {orders.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-glass-border bg-white/[0.02] p-10 text-center text-sm text-muted-foreground"
              >
                No active orders. New orders will appear here automatically.
              </motion.p>
            )}
            {orders.map((o) => {
              const orderItems = items.filter((i) => i.order_id === o.id);
              const serial = o.serial_number ?? `S${o.order_number}`;
              const d = new Date(o.created_at);
              const dateStr = d.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const timeStr = d.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-4 md:grid-cols-[auto_1fr_auto] md:items-center"
                >
                  <div className="md:min-w-[7rem]">
                    <p className="text-4xl font-black leading-none text-gradient-primary">
                      {serial}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {dateStr}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeStr}
                    </p>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {orderItems.map((it) => (
                      <li key={it.id}>
                        <span className="font-semibold tabular-nums">{it.qty}×</span>{" "}
                        {it.name_snapshot}
                      </li>
                    ))}
                  </ul>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Total
                    </p>
                    <p className="text-xl font-bold tabular-nums">
                      {formatCurrency(Number(o.total))}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
