-- Wishlists keyed by user_email (not user_id). RLS matches JWT email to row.user_email.
-- Apply after app code uses { user_email, product_id, product_data }.

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlists_select_own" ON public.wishlists;
DROP POLICY IF EXISTS "wishlists_insert_own" ON public.wishlists;
DROP POLICY IF EXISTS "wishlists_update_own" ON public.wishlists;
DROP POLICY IF EXISTS "wishlists_delete_own" ON public.wishlists;

DROP POLICY IF EXISTS "wishlists_select_own_email" ON public.wishlists;
CREATE POLICY "wishlists_select_own_email" ON public.wishlists
  FOR SELECT
  USING (
    (auth.jwt() ->> 'email') IS NOT NULL
    AND trim(both from user_email) = trim(both from (auth.jwt() ->> 'email'))
  );

DROP POLICY IF EXISTS "wishlists_insert_own_email" ON public.wishlists;
CREATE POLICY "wishlists_insert_own_email" ON public.wishlists
  FOR INSERT
  WITH CHECK (
    (auth.jwt() ->> 'email') IS NOT NULL
    AND trim(both from user_email) = trim(both from (auth.jwt() ->> 'email'))
  );

DROP POLICY IF EXISTS "wishlists_update_own_email" ON public.wishlists;
CREATE POLICY "wishlists_update_own_email" ON public.wishlists
  FOR UPDATE
  USING (
    (auth.jwt() ->> 'email') IS NOT NULL
    AND trim(both from user_email) = trim(both from (auth.jwt() ->> 'email'))
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') IS NOT NULL
    AND trim(both from user_email) = trim(both from (auth.jwt() ->> 'email'))
  );

DROP POLICY IF EXISTS "wishlists_delete_own_email" ON public.wishlists;
CREATE POLICY "wishlists_delete_own_email" ON public.wishlists
  FOR DELETE
  USING (
    (auth.jwt() ->> 'email') IS NOT NULL
    AND trim(both from user_email) = trim(both from (auth.jwt() ->> 'email'))
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlists TO service_role;
