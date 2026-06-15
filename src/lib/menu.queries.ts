import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_RESTAURANT_ID } from "./restaurant";

export type Category = {
  id: string;
  name: string;
  emoji: string | null;
  sort_order: number;
};

export type MenuItem = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  prep_time_min: number;
  calories: number | null;
  spice_level: "none" | "mild" | "medium" | "spicy" | "extra_spicy";
  is_veg: boolean;
  is_bestseller: boolean;
  is_recommended: boolean;
  is_new: boolean;
  tags: string[];
  sort_order: number;
};

export type Addon = {
  id: string;
  item_id: string;
  name: string;
  price: number;
  sort_order: number;
};

export type Restaurant = {
  id: string;
  name: string;
  tagline: string | null;
  currency_symbol: string;
  upi_id: string | null;
  upi_payee_name: string | null;
  pickup_instructions: string | null;
};

export const restaurantQuery = queryOptions({
  queryKey: ["restaurant", DEMO_RESTAURANT_ID],
  queryFn: async (): Promise<Restaurant> => {
    const { data, error } = await supabase
      .from("restaurants")
      .select("id,name,tagline,currency_symbol,upi_id,upi_payee_name,pickup_instructions")
      .eq("id", DEMO_RESTAURANT_ID)
      .single();
    if (error) throw error;
    return data as Restaurant;
  },
  staleTime: 60_000,
});

export const categoriesQuery = queryOptions({
  queryKey: ["categories", DEMO_RESTAURANT_ID],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,emoji,sort_order")
      .eq("restaurant_id", DEMO_RESTAURANT_ID)
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Category[];
  },
  staleTime: 60_000,
});

export const menuItemsQuery = queryOptions({
  queryKey: ["menu_items", DEMO_RESTAURANT_ID],
  queryFn: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        "id,category_id,name,description,price,image_url,prep_time_min,calories,spice_level,is_veg,is_bestseller,is_recommended,is_new,tags,sort_order",
      )
      .eq("restaurant_id", DEMO_RESTAURANT_ID)
      .eq("is_available", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as MenuItem[];
  },
  staleTime: 60_000,
});

export function addonsForItemQuery(itemId: string) {
  return queryOptions({
    queryKey: ["addons", itemId],
    queryFn: async (): Promise<Addon[]> => {
      const { data, error } = await supabase
        .from("item_addons")
        .select("id,item_id,name,price,sort_order")
        .eq("item_id", itemId)
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Addon[];
    },
    staleTime: 60_000,
  });
}
