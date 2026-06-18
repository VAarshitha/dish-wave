import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, ChefHat, LogOut, Clock, Lock, Delete } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KITCHEN_STATUS_FLOW, STATUS_LABELS, type OrderStatus } from "@/lib/orders.queries";
import { restaurantQuery } from "@/lib/menu.queries";
import { formatCurrency, relativeTime } from "@/lib/format";
import {
  getKitchenSession,
  kitchenLogin,
  kitchenLogout,
  kitchenSetStatus,
} from "@/lib/kitchen";

export const Route = createFileRoute("/kitchen")({
  ssr: false,
  head: () => ({ meta: [{ title: "Kitchen Display — Albaik Madanapalle" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(restaurantQuery),
  component: KitchenRoute,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive">{error.message}</div>
  ),
});

function KitchenRoute() {
  const { data: restaurant } = useSuspenseQuery(restaurantQuery);
  const [session, setSession] = useState(() => getKitchenSession());

  if (!session) {
    return <PinGate restaurantId={restaurant.id} onAuthed={() => setSession(getKitchenSession())} />;
  }
  return (
    <KitchenDashboard
      staffName={session.staffName}
      onSignOut={async () => {
        await kitchenLogout();
        setSession(null);
      }}
    />
  );
}

// ============ PIN gate ============

function PinGate({ restaurantId, onAuthed }: { restaurantId: string; onAuthed: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(p: string) {
    setBusy(true);
    setError(null);
    try {
      await kitchenLogin(restaurantId, p);
      onAuthed();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid PIN");
      setPin("");
    } finally {
      setBusy(false);
    }
  }

  function press(k: string) {
    if (busy) return;
    setError(null);
    if (k === "del") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    setPin((p) => (p + k).slice(0, 6));
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-8 shadow-elevated">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary-bg text-primary-foreground shadow-glow">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-bold">Kitchen Sign In</h1>
          <p className="mt-1 text-xs text-muted-foreground">Enter your PIN to unlock the kitchen display.</p>
        </div>

        <div className="mt-6 flex justify-center gap-2" aria-label="PIN entry">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full transition ${
                i < pin.length ? "bg-primary" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="mt-3 text-center text-xs font-medium text-destructive">{error}</p>
        )}

        <div className="mt-6 grid grid-cols-3 gap-2">
          {["1","2","3","4","5","6","7","8","9"].map((k) => (
            <KeyButton key={k} label={k} onClick={() => press(k)} />
          ))}
          <KeyButton label="Clear" onClick={() => setPin("")} variant="ghost" />
          <KeyButton label="0" onClick={() => press("0")} />
          <KeyButton label={<Delete className="mx-auto h-4 w-4" />} onClick={() => press("del")} variant="ghost" />
        </div>

        <button
          onClick={() => submit(pin)}
          disabled={pin.length < 4 || busy}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full gradient-primary-bg px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition disabled:opacity-50"
        >
          {busy ? "Verifying…" : "Unlock"}
        </button>

        <div className="mt-4 text-center">
          <Link to="/" className="text-[11px] text-muted-foreground hover:text-foreground">← Back to ordering</Link>
        </div>
      </div>
    </div>
  );
}

function KeyButton({
  label, onClick, variant = "solid",
}: { label: React.ReactNode; onClick: () => void; variant?: "solid" | "ghost" }) {
  return (
    <button
      onClick={onClick}
      className={`h-14 rounded-2xl text-lg font-semibold transition active:scale-95 ${
        variant === "ghost"
          ? "border border-glass-border bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]"
          : "border border-glass-border bg-white/[0.05] hover:bg-white/[0.08]"
      }`}
    >
      {label}
    </button>
  );
}

// ============ Dashboard ============

type KOrder = {
  id: string;
  order_number: number;
  serial_number: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
};
type KItem = {
  id: string;
  order_id: string;
  name_snapshot: string;
  qty: number;
};

function playDing() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 740; g.gain.value = 0.07;
    o.start();
    o.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.stop(ctx.currentTime + 0.55);
  } catch { /* noop */ }
}

function KitchenDashboard({ staffName, onSignOut }: { staffName: string; onSignOut: () => void }) {
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["kitchen", "orders"],
    queryFn: async (): Promise<KOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,serial_number,total,status,created_at")
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
    const firstRun = seen.current.size === 0;
    const newOnes: string[] = [];
    orders.forEach((o) => {
      if (!seen.current.has(o.id)) {
        if (!firstRun && o.status === "received") newOnes.push(o.id);
        seen.current.add(o.id);
      }
    });
    if (newOnes.length > 0) playDing();
  }, [orders]);

  useEffect(() => {
    const ch = supabase
      .channel("kitchen-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ["kitchen", "orders"] });
        qc.invalidateQueries({ queryKey: ["kitchen", "items"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  async function advance(id: string, status: OrderStatus) {
    const idx = KITCHEN_STATUS_FLOW.indexOf(status);
    const next = KITCHEN_STATUS_FLOW[idx + 1] ?? status;
    try {
      await kitchenSetStatus(id, next);
      qc.invalidateQueries({ queryKey: ["kitchen", "orders"] });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update order");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass-strong">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </span>
            Kitchen — Albaik Madanapalle
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Signed in as <span className="text-foreground">{staffName}</span>
          </span>
          <button
            onClick={onSignOut}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-end justify-between">
          <h1 className="text-xl font-bold tracking-tight">Active orders</h1>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs">{orders.length} pending</span>
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
              const nextStatus = KITCHEN_STATUS_FLOW[KITCHEN_STATUS_FLOW.indexOf(o.status) + 1];
              const isReady = o.status === "ready";
              return (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`grid gap-3 rounded-2xl border p-4 md:grid-cols-[auto_1fr_auto] md:items-center ${
                    isReady
                      ? "border-success/40 bg-success/10 shadow-glow"
                      : o.status === "received"
                        ? "border-primary/40 bg-primary/5"
                        : "border-glass-border bg-[var(--gradient-card)]"
                  }`}
                >
                  <div className="md:min-w-[7rem]">
                    <p className="text-4xl font-black leading-none text-gradient-primary">{serial}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {relativeTime(o.created_at)}
                    </p>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {orderItems.map((it) => (
                      <li key={it.id}>
                        <span className="font-semibold tabular-nums">{it.qty}×</span> {it.name_snapshot}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                    <p className="text-base font-bold tabular-nums">{formatCurrency(Number(o.total))}</p>
                    <button
                      onClick={() => advance(o.id, o.status)}
                      className={`inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-semibold ${
                        isReady
                          ? "gradient-success-bg text-success-foreground"
                          : "gradient-primary-bg text-primary-foreground shadow-glow"
                      }`}
                    >
                      {isReady ? (
                        <><Bell className="h-3 w-3" /> Picked up</>
                      ) : (
                        <>Mark {STATUS_LABELS[nextStatus]} <ChevronRight className="h-3 w-3" /></>
                      )}
                    </button>
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
