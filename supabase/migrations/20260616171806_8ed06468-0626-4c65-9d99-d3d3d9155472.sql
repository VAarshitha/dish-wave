
-- 1. Drop tables/payment columns
DROP TABLE IF EXISTS public.restaurant_tables CASCADE;

ALTER TABLE public.orders
  DROP COLUMN IF EXISTS table_id,
  DROP COLUMN IF EXISTS table_label,
  DROP COLUMN IF EXISTS payment_status,
  DROP COLUMN IF EXISTS payment_submitted_at,
  DROP COLUMN IF EXISTS payment_verified_at,
  DROP COLUMN IF EXISTS upi_txn_ref;

ALTER TABLE public.restaurants
  DROP COLUMN IF EXISTS upi_id,
  DROP COLUMN IF EXISTS upi_payee_name;

DROP TYPE IF EXISTS public.payment_status;

-- 2. Add 'received' to order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'received';

-- 3. Add serial number columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS serial_number TEXT,
  ADD COLUMN IF NOT EXISTS serial_date DATE NOT NULL DEFAULT CURRENT_DATE;

CREATE UNIQUE INDEX IF NOT EXISTS orders_serial_unique
  ON public.orders(restaurant_id, serial_date, serial_number)
  WHERE serial_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status, created_at DESC);

-- 4. RLS: allow anonymous customers to insert orders + order_items, and read by id
DROP POLICY IF EXISTS "Anyone can place orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can read order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;

-- (Old payment-related policies likely reference dropped columns; remove)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='orders' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', pol.policyname);
  END LOOP;
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='order_items' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.order_items', pol.policyname);
  END LOOP;
END $$;

GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT ALL ON public.order_items TO service_role;

CREATE POLICY "Public can read orders"
  ON public.orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Public can read order items"
  ON public.order_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert order items"
  ON public.order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. place_order RPC: atomically assigns daily serial and creates order + items
CREATE OR REPLACE FUNCTION public.place_order(
  _restaurant_id UUID,
  _subtotal NUMERIC,
  _tax NUMERIC,
  _total NUMERIC,
  _notes TEXT,
  _items JSONB
)
RETURNS TABLE(id UUID, serial_number TEXT, serial_date DATE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new_id UUID;
  _serial TEXT;
  _today DATE := CURRENT_DATE;
  _next_num INT;
  _lock_key BIGINT;
BEGIN
  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  -- per-restaurant-per-day advisory lock to serialize concurrent inserts
  _lock_key := ('x' || substr(md5(_restaurant_id::text || _today::text), 1, 15))::bit(60)::bigint;
  PERFORM pg_advisory_xact_lock(_lock_key);

  SELECT COALESCE(MAX(
    NULLIF(regexp_replace(o.serial_number, '\D', '', 'g'), '')::INT
  ), 0) + 1
  INTO _next_num
  FROM public.orders o
  WHERE o.restaurant_id = _restaurant_id AND o.serial_date = _today;

  _serial := 'S' || _next_num;

  INSERT INTO public.orders(
    restaurant_id, subtotal, tax, total, notes,
    status, serial_number, serial_date
  )
  VALUES (
    _restaurant_id, _subtotal, _tax, _total, _notes,
    'received'::order_status, _serial, _today
  )
  RETURNING orders.id INTO _new_id;

  INSERT INTO public.order_items(
    order_id, item_id, name_snapshot, price_snapshot, qty, addons, special_instructions, line_total
  )
  SELECT
    _new_id,
    NULLIF(it->>'item_id','')::UUID,
    it->>'name_snapshot',
    (it->>'price_snapshot')::NUMERIC,
    (it->>'qty')::INT,
    COALESCE(it->'addons', '[]'::jsonb),
    NULLIF(it->>'special_instructions',''),
    (it->>'line_total')::NUMERIC
  FROM jsonb_array_elements(_items) AS it;

  RETURN QUERY SELECT _new_id, _serial, _today;
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order(UUID, NUMERIC, NUMERIC, NUMERIC, TEXT, JSONB) TO anon, authenticated;

-- 6. Enable realtime for orders (already enabled likely; safe re-add)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
