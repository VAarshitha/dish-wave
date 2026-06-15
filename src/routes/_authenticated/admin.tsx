import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { ChefHat, LayoutDashboard, Utensils, Settings, LogOut, KanbanSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Albaik" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const tabs: ReadonlyArray<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
    { to: "/_authenticated/admin", label: "Orders", icon: LayoutDashboard, exact: true },
    { to: "/_authenticated/admin/menu", label: "Menu", icon: Utensils },
    { to: "/_authenticated/admin/settings", label: "Settings", icon: Settings },
    { to: "/_authenticated/kitchen", label: "Kitchen", icon: KanbanSquare },
  ];

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass-strong">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg gradient-primary-bg text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </span>
            Albaik · Admin
          </span>
          <nav className="ml-4 hidden gap-1 sm:flex">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to as never}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-primary/15 text-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto">
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as never}
                className={`flex-none whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                  active ? "bg-primary/15 text-foreground" : "text-muted-foreground"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
