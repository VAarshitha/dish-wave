// Simple role-based credentials stored in localStorage (no Supabase user accounts).
// All server-side mutations go through SECURITY DEFINER RPCs that verify the
// passcode again on the server.

export type AppRole = "admin" | "kitchen";

const ROLE_KEY = "albaik.role";
const PASS_KEY = "albaik.pass";

export const ADMIN_EMAIL = "sadhalanikhilroyal17@gmail.com";
export const ADMIN_PASSCODE = "321123";
export const KITCHEN_PASSCODE = "987987";

export function getRole(): AppRole | null {
  if (typeof window === "undefined") return null;
  const r = localStorage.getItem(ROLE_KEY);
  return r === "admin" || r === "kitchen" ? r : null;
}

export function getPasscode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PASS_KEY);
}

export function getAdminPasscode(): string {
  // Admin passcode is constant; kitchen role can also call status RPCs.
  return ADMIN_PASSCODE;
}

export function signIn(email: string, password: string): AppRole {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("Invalid credentials");
  }
  let role: AppRole;
  if (password === ADMIN_PASSCODE) role = "admin";
  else if (password === KITCHEN_PASSCODE) role = "kitchen";
  else throw new Error("Invalid credentials");
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(PASS_KEY, password);
  return role;
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(PASS_KEY);
}
