// Local role-based gate (no Supabase user accounts).
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getRole } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (getRole() !== "admin") {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
