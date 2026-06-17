// Kitchen tablet session helpers (browser-only)
import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "kitchen_token";
const NAME_KEY = "kitchen_staff_name";

export type KitchenSession = { token: string; staffName: string } | null;

export function getKitchenSession(): KitchenSession {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const staffName = localStorage.getItem(NAME_KEY);
  if (!token) return null;
  return { token, staffName: staffName ?? "Chef" };
}

export function setKitchenSession(token: string, staffName: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NAME_KEY, staffName);
}

export function clearKitchenSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
}

export async function kitchenLogin(restaurantId: string, pin: string) {
  const { data, error } = await supabase.rpc("kitchen_pin_login", {
    _restaurant_id: restaurantId,
    _pin: pin,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.token) throw new Error("Invalid PIN");
  setKitchenSession(row.token, row.staff_name);
  return row;
}

export async function kitchenLogout() {
  const s = getKitchenSession();
  if (s?.token) {
    try { await supabase.rpc("kitchen_logout", { _token: s.token }); } catch { /* ignore */ }
  }
  clearKitchenSession();
}

export async function kitchenSetStatus(orderId: string, status: string) {
  const s = getKitchenSession();
  if (!s) throw new Error("Not signed in");
  const { error } = await supabase.rpc("kitchen_set_order_status", {
    _token: s.token,
    _order_id: orderId,
    _status: status,
  });
  if (error) throw error;
}
