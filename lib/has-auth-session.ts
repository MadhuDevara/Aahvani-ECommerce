import { supabase } from '@/lib/supabase'

/** Use after cart/wishlist returns false — validates JWT with Supabase (not stale local cache). */
export async function hasAuthSession(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return Boolean(user)
}
