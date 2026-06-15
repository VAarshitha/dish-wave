import { r as reactExports } from "../_libs/react.mjs";
const STORAGE_KEY = "albaik.cart.v1";
const TABLE_KEY = "albaik.table.v1";
const listeners = /* @__PURE__ */ new Set();
let state = { lines: [] };
let initialized = false;
function load() {
  if (typeof window === "undefined") return { lines: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { lines: [] };
  } catch {
    return { lines: [] };
  }
}
function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
  }
  listeners.forEach((l) => l());
}
function ensureInit() {
  if (!initialized && typeof window !== "undefined") {
    state = load();
    initialized = true;
  }
}
function subscribe(cb) {
  ensureInit();
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  ensureInit();
  return state;
}
function getServerSnapshot() {
  return { lines: [] };
}
function useCart() {
  return reactExports.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
function keyFor(itemId, addons, instructions) {
  const a = [...addons].map((x) => x.name).sort().join("|");
  return `${itemId}::${a}::${instructions ?? ""}`;
}
function addToCart(line) {
  ensureInit();
  const key = keyFor(line.itemId, line.addons, line.specialInstructions);
  const existing = state.lines.find((l) => l.key === key);
  const qty = line.qty ?? 1;
  if (existing) {
    state = {
      lines: state.lines.map((l) => l.key === key ? { ...l, qty: l.qty + qty } : l)
    };
  } else {
    state = { lines: [...state.lines, { ...line, key, qty }] };
  }
  persist();
}
function updateQty(key, delta) {
  ensureInit();
  state = {
    lines: state.lines.map((l) => l.key === key ? { ...l, qty: l.qty + delta } : l).filter((l) => l.qty > 0)
  };
  persist();
}
function removeLine(key) {
  ensureInit();
  state = { lines: state.lines.filter((l) => l.key !== key) };
  persist();
}
function clearCart() {
  ensureInit();
  state = { lines: [] };
  persist();
}
function lineTotal(line) {
  const addonSum = line.addons.reduce((s, a) => s + a.price, 0);
  return (line.price + addonSum) * line.qty;
}
function cartTotal(lines) {
  return lines.reduce((s, l) => s + lineTotal(l), 0);
}
function setTable(t) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TABLE_KEY, JSON.stringify(t));
}
function getTable() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TABLE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function useTable() {
  const [t, setT] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setT(getTable());
    const handler = () => setT(getTable());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  return t;
}
export {
  useCart as a,
  addToCart as b,
  cartTotal as c,
  updateQty as d,
  clearCart as e,
  lineTotal as l,
  removeLine as r,
  setTable as s,
  useTable as u
};
