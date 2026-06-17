
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.kitchen_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kitchen_staff_restaurant_idx ON public.kitchen_staff(restaurant_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kitchen_staff TO authenticated;
GRANT ALL ON public.kitchen_staff TO service_role;
ALTER TABLE public.kitchen_staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage kitchen staff" ON public.kitchen_staff;
CREATE POLICY "Admins manage kitchen staff" ON public.kitchen_staff FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin'));
DROP TRIGGER IF EXISTS kitchen_staff_set_updated_at ON public.kitchen_staff;
CREATE TRIGGER kitchen_staff_set_updated_at BEFORE UPDATE ON public.kitchen_staff
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.kitchen_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.kitchen_staff(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.kitchen_sessions TO service_role;
ALTER TABLE public.kitchen_sessions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.kitchen_pin_login(_restaurant_id UUID, _pin TEXT)
RETURNS TABLE(token TEXT, staff_id UUID, staff_name TEXT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE _staff RECORD; _token TEXT;
BEGIN
  IF _pin IS NULL OR _pin !~ '^[0-9]{4,6}$' THEN RAISE EXCEPTION 'Invalid PIN format'; END IF;
  SELECT s.id, s.name INTO _staff FROM public.kitchen_staff s
   WHERE s.restaurant_id = _restaurant_id AND s.is_active = TRUE
     AND s.pin_hash = extensions.crypt(_pin, s.pin_hash) LIMIT 1;
  IF _staff.id IS NULL THEN RAISE EXCEPTION 'Invalid PIN' USING ERRCODE='P0001'; END IF;
  _token := encode(extensions.gen_random_bytes(24), 'hex');
  INSERT INTO public.kitchen_sessions(staff_id, token_hash)
    VALUES (_staff.id, encode(extensions.digest(_token::bytea, 'sha256'::text), 'hex'));
  RETURN QUERY SELECT _token, _staff.id, _staff.name;
END $$;
GRANT EXECUTE ON FUNCTION public.kitchen_pin_login(UUID, TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.kitchen_validate_token(_token TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE _staff_id UUID;
BEGIN
  IF _token IS NULL OR length(_token) < 16 THEN RETURN NULL; END IF;
  UPDATE public.kitchen_sessions SET last_seen_at = now()
   WHERE token_hash = encode(extensions.digest(_token::bytea, 'sha256'::text), 'hex')
   RETURNING staff_id INTO _staff_id;
  RETURN _staff_id;
END $$;
GRANT EXECUTE ON FUNCTION public.kitchen_validate_token(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.kitchen_set_order_status(_token TEXT, _order_id UUID, _status TEXT)
RETURNS public.orders LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE _staff_id UUID; _row public.orders; _new_status order_status;
BEGIN
  _staff_id := public.kitchen_validate_token(_token);
  IF _staff_id IS NULL THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE='P0001'; END IF;
  IF _status NOT IN ('preparing','ready','completed','cancelled') THEN
    RAISE EXCEPTION 'Invalid status %', _status;
  END IF;
  _new_status := _status::order_status;
  UPDATE public.orders SET status = _new_status,
    ready_at = CASE WHEN _new_status='ready' THEN now() ELSE ready_at END,
    completed_at = CASE WHEN _new_status='completed' THEN now() ELSE completed_at END
   WHERE id = _order_id RETURNING * INTO _row;
  RETURN _row;
END $$;
GRANT EXECUTE ON FUNCTION public.kitchen_set_order_status(TEXT, UUID, TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.kitchen_logout(_token TEXT)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public, extensions AS $$
  DELETE FROM public.kitchen_sessions
   WHERE token_hash = encode(extensions.digest(_token::bytea, 'sha256'::text), 'hex');
$$;
GRANT EXECUTE ON FUNCTION public.kitchen_logout(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_create_kitchen_staff(_restaurant_id UUID, _name TEXT, _pin TEXT)
RETURNS public.kitchen_staff LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE _row public.kitchen_staff;
BEGIN
  IF NOT (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')) THEN
    RAISE EXCEPTION 'Forbidden'; END IF;
  IF _pin !~ '^[0-9]{4,6}$' THEN RAISE EXCEPTION 'PIN must be 4-6 digits'; END IF;
  INSERT INTO public.kitchen_staff(restaurant_id, name, pin_hash)
    VALUES (_restaurant_id, _name, extensions.crypt(_pin, extensions.gen_salt('bf')))
    RETURNING * INTO _row;
  RETURN _row;
END $$;
GRANT EXECUTE ON FUNCTION public.admin_create_kitchen_staff(UUID, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reset_kitchen_pin(_staff_id UUID, _pin TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')) THEN
    RAISE EXCEPTION 'Forbidden'; END IF;
  IF _pin !~ '^[0-9]{4,6}$' THEN RAISE EXCEPTION 'PIN must be 4-6 digits'; END IF;
  UPDATE public.kitchen_staff SET pin_hash = extensions.crypt(_pin, extensions.gen_salt('bf'))
   WHERE id = _staff_id;
  DELETE FROM public.kitchen_sessions WHERE staff_id = _staff_id;
END $$;
GRANT EXECUTE ON FUNCTION public.admin_reset_kitchen_pin(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_kitchen_active(_staff_id UUID, _active BOOLEAN)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')) THEN
    RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.kitchen_staff SET is_active = _active WHERE id = _staff_id;
  IF NOT _active THEN DELETE FROM public.kitchen_sessions WHERE staff_id = _staff_id; END IF;
END $$;
GRANT EXECUTE ON FUNCTION public.admin_set_kitchen_active(UUID, BOOLEAN) TO authenticated;

INSERT INTO public.kitchen_staff(restaurant_id, name, pin_hash)
SELECT r.id, 'Chef', extensions.crypt('1234', extensions.gen_salt('bf'))
FROM public.restaurants r
WHERE NOT EXISTS (SELECT 1 FROM public.kitchen_staff k WHERE k.restaurant_id = r.id)
LIMIT 1;
