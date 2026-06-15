import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrderStatus =
  | "pending_payment"
  | "payment_submitted"
  | "payment_verified"
  | "preparing"
  | "cooking"
  | "quality_check"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "submitted" | "verified" | "failed";

export type Order = {
  id: string;
  order_number: number;
  restaurant_id: string;
  table_id: string | null;
  table_label: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  upi_txn_ref: string | null;
  notes: string | null;
  created_at: string;
  ready_at: string | null;
  completed_at: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  name_snapshot: string;
  price_snapshot: number;
  qty: number;
  addons: { name: string; price: number }[];
  special_instructions: string | null;
  line_total: number;
};

export function orderQuery(orderId: string) {
  return queryOptions({
    queryKey: ["order", orderId],
    queryFn: async (): Promise<{ order: Order; items: OrderItem[] }> => {
      const [orderRes, itemsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("id", orderId).single(),
        supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at"),
      ]);
      if (orderRes.error) throw orderRes.error;
      if (itemsRes.error) throw itemsRes.error;
      return {
        order: orderRes.data as unknown as Order,
        items: (itemsRes.data ?? []) as unknown as OrderItem[],
      };
    },
  });
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  payment_submitted: "Verifying payment",
  payment_verified: "Order received",
  preparing: "Preparing",
  cooking: "Cooking",
  quality_check: "Quality check",
  ready: "Ready for pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const KITCHEN_STATUS_FLOW: OrderStatus[] = [
  "payment_verified",
  "preparing",
  "cooking",
  "quality_check",
  "ready",
  "completed",
];

export const CUSTOMER_PROGRESS: OrderStatus[] = [
  "payment_verified",
  "preparing",
  "cooking",
  "quality_check",
  "ready",
];
