import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import logo from "@/assets/albaik-logo.png";
import { signIn, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Staff sign in — Albaik Madanapalle" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const role = signIn(email, password);
      navigate({ to: role === "admin" ? "/admin" : "/kitchen" });
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Sign in failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold">
          <img src={logo} alt="Albaik" width={40} height={40} className="h-10 w-10 rounded-xl shadow-glow" />
          Albaik Staff
        </Link>
        <div className="rounded-3xl border border-glass-border bg-[var(--gradient-card)] p-6 shadow-elevated">
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access admin and kitchen dashboards.
          </p>
          <form onSubmit={submit} className="mt-5 grid gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="w-full rounded-xl border border-glass-border bg-white/[0.04] px-4 py-3 text-sm focus:border-primary/50 focus:outline-none"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-glass-border bg-white/[0.04] px-4 py-3 text-sm focus:border-primary/50 focus:outline-none"
            />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-full gradient-primary-bg py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>
        </div>
        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Back to customer app
        </Link>
      </div>
    </div>
  );
}
