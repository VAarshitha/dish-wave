UPDATE public.restaurants
SET name = 'Albaik Madanapalle',
    tagline = 'India''s Beloved QSR Brand'
WHERE id = '00000000-0000-0000-0000-00000000a1ba';

UPDATE public.kitchen_staff
SET pin_hash = extensions.crypt('766432', extensions.gen_salt('bf')),
    is_active = TRUE
WHERE restaurant_id = '00000000-0000-0000-0000-00000000a1ba';

DELETE FROM public.kitchen_sessions
WHERE staff_id IN (SELECT id FROM public.kitchen_staff WHERE restaurant_id = '00000000-0000-0000-0000-00000000a1ba');