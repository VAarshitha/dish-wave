import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { useCart, cartTotal } from "@/lib/cart";

export function AppHeader({
  title,
  subtitle,
  backTo,
  showCart = true,
}: {
  title: string;
  subtitle?: string;
  backTo?: string;
  showCart?: boolean;
}) {
  const cart = useCart();
  const router = useRouter();
  const count = cart.lines.reduce((s, l) => s + l.qty, 0);
  const total = cartTotal(cart.lines);
  return (
    <header className="sticky top-0 z-30 glass-strong">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        {backTo ? (
          <button
            type="button"
            onClick={() => router.navigate({ to: backTo })}
            className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold leading-tight">{title}</h1>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {showCart && count > 0 ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full gradient-primary-bg px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {count} · ₹{Math.round(total)}
            </Link>
          </motion.div>
        ) : null}
      </div>
    </header>
  );
}
