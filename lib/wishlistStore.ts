import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { mapSupabaseRowToProduct, productRouteId, type Product } from '@/lib/products'

export interface WishlistItem {
  id:            string
  name:          string
  price:         number
  originalPrice: number
  category:      string
  bg:            string
}

/** Session user; wishlist rows are keyed by `email` in Supabase, not `user_id`. */
export type AuthUserRef = { id: string; email?: string | null }

/** Blocks concurrent toggles for the same product (avoids add+remove from double fire / races). */
const wishlistToggleInFlight = new Set<string>()

function canonicalWishlistEmail(email: string): string {
  return email.trim()
}

function wishlistItemFromProductData(data: unknown): WishlistItem | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const o = data as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return null
  if (typeof o.price !== 'number' || typeof o.originalPrice !== 'number') return null
  if (typeof o.category !== 'string' || typeof o.bg !== 'string') return null
  return {
    id:            o.id,
    name:          o.name,
    price:         o.price,
    originalPrice: o.originalPrice,
    category:      o.category,
    bg:            o.bg,
  }
}

function rowToWishlistItem(row: Record<string, unknown>): WishlistItem | null {
  try {
    const p = mapSupabaseRowToProduct(row)
    return {
      id:            productRouteId(p),
      name:          p.name,
      price:         p.salePrice,
      originalPrice: p.originalPrice,
      category:      p.category,
      bg:            p.bg,
    }
  } catch {
    return null
  }
}

/** Load wishlist rows: prefer `product_data` jsonb; join `products` when needed. */
async function fetchWishlistItemsForUser(userEmail: string): Promise<WishlistItem[]> {
  const em = canonicalWishlistEmail(userEmail)
  const { data: rows, error: wlError } = await supabase
    .from('wishlists')
    .select('product_id, product_data, created_at')
    .eq('user_email', em)
    .order('created_at', { ascending: false })

  if (wlError || !rows?.length) {
    if (process.env.NODE_ENV === 'development' && wlError) {
      console.warn('[wishlist] list fetch:', wlError.message, wlError)
    }
    return []
  }

  const out: WishlistItem[] = []
  const needProductFetch: { product_id: string }[] = []

  for (const r of rows) {
    const fromJson = wishlistItemFromProductData((r as { product_data?: unknown }).product_data)
    if (fromJson) {
      out.push(fromJson)
      continue
    }
    needProductFetch.push({ product_id: String((r as { product_id: string }).product_id) })
  }

  if (!needProductFetch.length) return out

  const ids = [...new Set(needProductFetch.map((x) => x.product_id))]
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('*')
    .in('id', ids)

  if (pError || !products?.length) {
    if (process.env.NODE_ENV === 'development' && pError) {
      console.warn('[wishlist] products fetch:', pError.message, pError)
    }
    return out
  }

  const byId = new Map(
    products.map((row) => [String((row as Record<string, unknown>).id), row as Record<string, unknown>])
  )

  for (const r of rows) {
    const fromJson = wishlistItemFromProductData((r as { product_data?: unknown }).product_data)
    if (fromJson) continue
    const pid = String((r as { product_id: string }).product_id)
    const row = byId.get(pid)
    if (!row) continue
    const item = rowToWishlistItem(row)
    if (item) out.push(item)
  }

  return out
}

interface WishlistState {
  /** Logged-in user email (trimmed); wishlist table rows use `user_email`. */
  userEmail:          string | null
  items:              WishlistItem[]
  loading:            boolean
  ready:              boolean
  switchUser:         (user: AuthUserRef | null) => Promise<void>
  addToWishlist:      (item: WishlistItem) => Promise<boolean>
  removeFromWishlist: (id: string) => Promise<void>
  toggleWishlist:     (item: WishlistItem) => Promise<boolean>
  isWishlisted:       (id: string) => boolean
  clearWishlist:      () => Promise<void>
  /** Re-fetch from Supabase (e.g. after tab focus). */
  reloadFromServer:   () => Promise<void>
}

export const useWishlistStore = create<WishlistState>()((set, get) => {
  if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return
      const u = session?.user
      void get().switchUser(u ? { id: u.id, email: u.email ?? null } : null)
    })
  }

  return {
    userEmail: null,
    items:     [],
    loading:   false,
    ready:     false,

    switchUser: async (user) => {
      const email = user?.email ? canonicalWishlistEmail(user.email) : ''

      if (!email) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('aahvani-wl-guest')
            localStorage.removeItem('aahvani-wishlist')
          } catch {
            /* ignore */
          }
        }
        set({ userEmail: null, items: [], loading: false, ready: true })
        return
      }

      set({ userEmail: email, loading: true, ready: true })
      const items = await fetchWishlistItemsForUser(email)
      set({ items, loading: false })
    },

    reloadFromServer: async () => {
      const em = get().userEmail
      if (!em) return
      set({ loading: true })
      const items = await fetchWishlistItemsForUser(em)
      set({ items, loading: false })
    },

    addToWishlist: async (item) => {
      const userEmail = get().userEmail
      if (!userEmail) return false
      if (get().items.some((i) => i.id === item.id)) return true

      const prevSnapshot = get().items
      const next = [...prevSnapshot, item]
      set({ items: next })

      const { error } = await supabase.from('wishlists').insert({
        user_email:    userEmail,
        product_id:    item.id,
        product_data:  item,
      })

      if (error) {
        const dup = (error as { code?: string }).code === '23505'
        if (!dup) {
          set({ items: prevSnapshot })
          if (process.env.NODE_ENV === 'development') {
            console.warn('[wishlist] insert failed:', error.message, error)
          }
          return false
        }
      }

      const hydrated = await fetchWishlistItemsForUser(userEmail)
      const merged =
        hydrated.some((i) => i.id === item.id) ? hydrated : [...hydrated, item]
      set({ items: merged })
      return true
    },

    removeFromWishlist: async (id) => {
      const userEmail = get().userEmail
      if (!userEmail) return

      const prevSnapshot = get().items
      const next = prevSnapshot.filter((i) => i.id !== id)
      set({ items: next })

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_email', userEmail)
        .eq('product_id', id)

      if (error) {
        set({ items: await fetchWishlistItemsForUser(userEmail) })
        if (process.env.NODE_ENV === 'development') {
          console.warn('[wishlist] delete failed:', error.message, error)
        }
      }
    },

    toggleWishlist: async (item) => {
      if (wishlistToggleInFlight.has(item.id)) return false
      wishlistToggleInFlight.add(item.id)
      try {
        let em = get().userEmail
        if (!em) {
          const { data: { session } } = await supabase.auth.getSession()
          const u = session?.user
          const mail = u?.email ? canonicalWishlistEmail(u.email) : ''
          if (!mail || !u?.id) return false
          await get().switchUser({ id: u.id, email: u.email ?? null })
          em = get().userEmail
          if (!em) return false
        }
        const wasListed = get().items.some((i) => i.id === item.id)
        if (wasListed) {
          await get().removeFromWishlist(item.id)
          return true
        }
        return await get().addToWishlist(item)
      } finally {
        wishlistToggleInFlight.delete(item.id)
      }
    },

    isWishlisted: (id) => get().items.some((i) => i.id === id),

    clearWishlist: async () => {
      const userEmail = get().userEmail
      if (!userEmail) {
        set({ items: [] })
        return
      }
      set({ items: [] })
      const { error } = await supabase.from('wishlists').delete().eq('user_email', userEmail)
      if (error) {
        set({ items: await fetchWishlistItemsForUser(userEmail) })
        if (process.env.NODE_ENV === 'development') {
          console.warn('[wishlist] clear failed:', error.message, error)
        }
      }
    },
  }
})

if (typeof window !== 'undefined') {
  void supabase.auth.getSession().then(({ data: { session } }) => {
    const u = session?.user
    void useWishlistStore
      .getState()
      .switchUser(u ? { id: u.id, email: u.email ?? null } : null)
  })
}

/** Build wishlist payload from a catalogue `Product` (uses Supabase id in URL). */
export function wishlistItemFromProduct(p: Product): WishlistItem {
  return {
    id:            productRouteId(p),
    name:          p.name,
    price:         p.salePrice,
    originalPrice: p.originalPrice,
    category:      p.category,
    bg:            p.bg,
  }
}
