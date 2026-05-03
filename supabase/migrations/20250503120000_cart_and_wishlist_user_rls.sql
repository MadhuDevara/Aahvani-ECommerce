-- Cart lines: one row per (user, product_key). item_data mirrors client CartItem shape.
CREATE TABLE IF NOT EXISTS public.cart_items (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_key text NOT NULL,
  item_data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_key)
);

CREATE INDEX IF NOT EXISTS cart_items_user_updated ON public.cart_items (user_id, updated_at);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
CREATE POLICY "cart_items_select_own" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
CREATE POLICY "cart_items_insert_own" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
CREATE POLICY "cart_items_update_own" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;
CREATE POLICY "cart_items_delete_own" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;

-- Wishlists: ensure user_id exists for RLS + upsert on (user_id, product_id).
-- If your project already has a different wishlists schema, reconcile manually before applying.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'wishlists'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'wishlists' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.wishlists ADD COLUMN user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;
  END IF;
END $$;

UPDATE public.wishlists w
SET user_id = au.id
FROM auth.users au
WHERE w.user_id IS NULL
  AND w.user_email IS NOT NULL
  AND lower(trim(w.user_email::text)) = lower(trim(au.email::text));

-- Rows that cannot be tied to auth.users cannot satisfy RLS; remove before unique index.
DELETE FROM public.wishlists WHERE user_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS wishlists_user_id_product_id_uidx
  ON public.wishlists (user_id, product_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlists_select_own" ON public.wishlists;
CREATE POLICY "wishlists_select_own" ON public.wishlists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlists_insert_own" ON public.wishlists;
CREATE POLICY "wishlists_insert_own" ON public.wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlists_update_own" ON public.wishlists;
CREATE POLICY "wishlists_update_own" ON public.wishlists
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlists_delete_own" ON public.wishlists;
CREATE POLICY "wishlists_delete_own" ON public.wishlists
  FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlists TO service_role;
