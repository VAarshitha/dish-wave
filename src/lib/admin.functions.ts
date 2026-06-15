import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the current user the "owner" role if no owner exists.
 * Bootstrap flow for the very first staff sign-up.
 */
export const claimOwnerRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "owner");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      // Owners already exist — silently grant the kitchen role so they can still use the dashboard.
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: context.userId, role: "kitchen" }, { onConflict: "user_id,role" });
      return { granted: "kitchen" as const, bootstrapped: false };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "owner" });
    if (error) throw new Error(error.message);
    return { granted: "owner" as const, bootstrapped: true };
  });

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { roles: (data ?? []).map((r) => r.role as string) };
  });
