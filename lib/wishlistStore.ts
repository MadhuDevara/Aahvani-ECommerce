import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface WishlistItem {
  id:            string
  name:          string
  price:         number
  originalPrice: number
  category:      string
  bg:            string
}

// ── localStorage (instant UI cache while DB loads) ──────────────────────────

const cacheKey = (email: string | null) =>
  email ? `aahvani-wl-${email}` : 'aahvani-wl-guest'

function readCache(email: string | null): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(cacheKey(email))
    return raw ? (JSON.parse(raw) as WishlistItem[]) : []
  } catch { return [] }
}

function writeCache(email: string | null, items: WishlistItem[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(cacheKey(email), JSON.stringify(items)) } catch { /* quota */ }
}

// ── Supabase DB helpers ─────────────────────────────────────────────────────

async function dbFetch(email: string): Promise<WishlistItem[]> {
  const { data } = await supabase
    .from('wishlists')
    .select('product_data')
    .eq('user_email', email)
  return (data ?? []).map((r) => r.product_data as WishlistItem)
}

function dbAdd(email: string, item: WishlistItem) {
  supabase
    .from('wishlists')
    .upsert(
      { user_email: email, product_id: item.id, product_data: item },
      { onConflict: 'user_email,product_id' }
    )
    .then(() => { /* background */ })
}

function dbRemove(email: string, productId: string) {
  supabase
    .from('wishlists')
    .delete()
    .eq('user_email', email)
    .eq('product_id', productId)
    .then(() => { /* background */ })
}

// ── Store ───────────────────────────────────────────────────────────────────

interface WishlistState {
  items:              WishlistItem[]
  currentEmail:       string | null
  switchUser:         (email: string | null) => Promise<void>
  addToWishlist:      (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  toggleWishlist:     (item: WishlistItem) => void
  isWishlisted:       (id: string) => boolean
  clearWishlist:      () => void
}

export const useWishlistStore = create<WishlistState>()((set, get) => {

  // ── Listen to login / logout and switch user's wishlist ───────────────────
  if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null
      const state = get()
      if (state.currentEmail !== email) {
        void get().switchUser(email)
      }
    })
  }

  return {
    items:        [],
    currentEmail: null,

    /**
     * Called on login (email = string) or logout (email = null).
     * Shows cache instantly, then loads authoritative data from Supabase.
     */
    switchUser: async (email) => {
      const state = get()
      if (state.currentEmail === email) return

      // Show cached items immediately (no loading flash)
      set({ currentEmail: email, items: readCache(email) })

      if (email) {
        try {
          const dbItems = await dbFetch(email)
          writeCache(email, dbItems)
          set({ items: dbItems })
        } catch {
          // Keep cache on network error — silently degrade
        }
      }
    },

    addToWishlist: (item) =>
      set((state) => {
        if (state.items.some((i) => i.id === item.id)) return state
        const next = [...state.items, item]
        writeCache(state.currentEmail, next)
        if (state.currentEmail) dbAdd(state.currentEmail, item)
        return { items: next }
      }),

    removeFromWishlist: (id) =>
      set((state) => {
        const next = state.items.filter((i) => i.id !== id)
        writeCache(state.currentEmail, next)
        if (state.currentEmail) dbRemove(state.currentEmail, id)
        return { items: next }
      }),

    toggleWishlist: (item) => {
      const { items, addToWishlist, removeFromWishlist } = get()
      items.some((i) => i.id === item.id)
        ? removeFromWishlist(item.id)
        : addToWishlist(item)
    },

    isWishlisted: (id) => get().items.some((i) => i.id === id),

    clearWishlist: () => {
      const { currentEmail } = get()
      writeCache(currentEmail, [])
      if (currentEmail) {
        supabase.from('wishlists').delete().eq('user_email', currentEmail).then(() => {})
      }
      set({ items: [] })
    },
  }
})
