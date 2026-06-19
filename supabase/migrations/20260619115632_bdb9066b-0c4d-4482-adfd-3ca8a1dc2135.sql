
-- Simplified auth: drop kitchen PIN system and add passcode-based RPCs.

DROP FUNCTION IF EXISTS public.kitchen_pin_login(uuid, text);
DROP FUNCTION IF EXISTS public.kitchen_validate_token(text);
DROP FUNCTION IF EXISTS public.kitchen_set_order_status(text, uuid, text);
DROP FUNCTION IF EXISTS public.kitchen_logout(text);
DROP FUNCTION IF EXISTS public.admin_create_kitchen_staff(uuid, text, text);
DROP FUNCTION IF EXISTS public.admin_reset_kitchen_pin(uuid, text);
DROP FUNCTION IF EXISTS public.admin_set_kitchen_active(uuid, boolean);
DROP TABLE IF EXISTS public.kitchen_sessions;
DROP TABLE IF EXISTS public.kitchen_staff;

-- Shared passcodes (server-validated). Anyone can call these RPCs but must
-- present the correct passcode embedded in the client app.
CREATE OR REPLACE FUNCTION public.set_order_status_passcode(_passcode text, _order_id uuid, _status text)
RETURNS public.orders
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _row public.orders; _new public.order_status;
BEGIN
  IF _passcode NOT IN ('987987','321123') THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE='P0001';
  END IF;
  IF _status NOT IN ('received','preparing','ready','completed','cancelled') THEN
    RAISE EXCEPTION 'Invalid status %', _status;
  END IF;
  _new := _status::public.order_status;
  UPDATE public.orders
     SET status = _new,
         ready_at = CASE WHEN _new='ready' THEN now() ELSE ready_at END,
         completed_at = CASE WHEN _new='completed' THEN now() ELSE completed_at END
   WHERE id = _order_id
   RETURNING * INTO _row;
  RETURN _row;
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_menu_available(_passcode text, _item_id uuid, _available boolean)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF _passcode <> '321123' THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE='P0001'; END IF;
  UPDATE public.menu_items SET is_available = _available WHERE id = _item_id;
END $$;

CREATE OR REPLACE FUNCTION public.admin_update_menu_price(_passcode text, _item_id uuid, _price numeric)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF _passcode <> '321123' THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE='P0001'; END IF;
  UPDATE public.menu_items SET price = _price WHERE id = _item_id;
END $$;

GRANT EXECUTE ON FUNCTION public.set_order_status_passcode(text, uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_menu_available(text, uuid, boolean) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_menu_price(text, uuid, numeric) TO anon, authenticated;
