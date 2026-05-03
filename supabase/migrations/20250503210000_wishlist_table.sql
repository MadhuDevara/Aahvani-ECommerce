-- Per-user wishlist rows (singular table name). product_id = products.id (UUID string).
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS wishlist_user_created ON public.wishlist (user_id, created_at DESC);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlist_select_own" ON public.wishlist;
CREATE POLICY "wishlist_select_own" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlist_insert_own" ON public.wishlist;
CREATE POLICY "wishlist_insert_own" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlist_delete_own" ON public.wishlist;
CREATE POLICY "wishlist_delete_own" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.wishlist TO authenticated;
GRANT ALL ON public.wishlist TO service_role;

-- Optional: copy from legacy `wishlists` if it exists (best-effort).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'wishlists'
  ) THEN
    INSERT INTO public.wishlist (user_id, product_id, created_at)
    SELECT w.user_id, w.product_id::text, now()
    FROM public.wishlists w
    WHERE w.user_id IS NOT NULL AND w.product_id IS NOT NULL
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END IF;
END $$;
