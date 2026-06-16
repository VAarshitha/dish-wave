import { useSyncExternalStore } from "react";

export type CartAddon = { name: string; price: number };
export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  qty: number;
  addons: CartAddon[];
  specialInstructions?: string;
};

const STORAGE_KEY = "albaik.cart.v1";

type CartState = { lines: CartLine[] };
const listeners = new Set<() => void>();
let state: CartState = { lines: [] };
let initialized = false;

function load(): CartState {
  if (typeof window === "undefined") return { lines: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartState) : { lines: [] };
  } catch {
    return { lines: [] };
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function ensureInit() {
  if (!initialized && typeof window !== "undefined") {
    state = load();
    initialized = true;
  }
}

function subscribe(cb: () => void) {
  ensureInit();
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  ensureInit();
  return state;
}
function getServerSnapshot(): CartState {
  return { lines: [] };
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function keyFor(itemId: string, addons: CartAddon[], instructions?: string) {
  const a = [...addons].map((x) => x.name).sort().join("|");
  return `${itemId}::${a}::${instructions ?? ""}`;
}

export function addToCart(line: Omit<CartLine, "key" | "qty"> & { qty?: number }) {
  ensureInit();
  const key = keyFor(line.itemId, line.addons, line.specialInstructions);
  const existing = state.lines.find((l) => l.key === key);
  const qty = line.qty ?? 1;
  if (existing) {
    state = { lines: state.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)) };
  } else {
    state = { lines: [...state.lines, { ...line, key, qty }] };
  }
  persist();
}

export function updateQty(key: string, delta: number) {
  ensureInit();
  state = {
    lines: state.lines
      .map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l))
      .filter((l) => l.qty > 0),
  };
  persist();
}

export function removeLine(key: string) {
  ensureInit();
  state = { lines: state.lines.filter((l) => l.key !== key) };
  persist();
}

export function clearCart() {
  ensureInit();
  state = { lines: [] };
  persist();
}

export function lineTotal(line: CartLine) {
  const addonSum = line.addons.reduce((s, a) => s + a.price, 0);
  return (line.price + addonSum) * line.qty;
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((s, l) => s + lineTotal(l), 0);
}
