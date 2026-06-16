import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrderStatus = "received" | "preparing" | "ready" | "completed" | "cancelled";

export type Order = {
  id: string;
  order_number: number;
  serial_number: string | null;
  serial_date: string | null;
  restaurant_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
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
  received: "Order received",
  preparing: "Preparing",
  ready: "Ready for pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const KITCHEN_STATUS_FLOW: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "completed",
];

export const CUSTOMER_PROGRESS: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
];
