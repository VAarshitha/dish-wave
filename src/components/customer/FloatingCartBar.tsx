import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartTotal } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";

export function FloatingCartBar() {
  const cart = useCart();
  const count = cart.lines.reduce((s, l) => s + l.qty, 0);
  const total = cartTotal(cart.lines);
  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-5 pt-3"
        >
          <div className="pointer-events-auto mx-auto max-w-md">
            <Link
              to="/cart"
              className="flex items-center justify-between gap-3 rounded-full gradient-primary-bg p-2 pl-5 shadow-glow"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-primary-foreground">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/20">
                  <ShoppingBag className="h-3.5 w-3.5" />
                </span>
                {count} {count === 1 ? "item" : "items"} · {formatCurrency(total)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-4 py-2 text-sm font-semibold text-primary-foreground">
                View cart <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
