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

// ── localStorage helpers ────────────────────────────────────────────────────

const storageKey = (email: string | null) =>
  email ? `aahvani-wishlist-${email}` : 'aahvani-wishlist-guest'

function loadItems(email: string | null): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(email))
    return raw ? (JSON.parse(raw) as WishlistItem[]) : []
  } catch { return [] }
}

function saveItems(email: string | null, items: WishlistItem[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(storageKey(email), JSON.stringify(items)) } catch { /* quota */ }
}

// ── Store ───────────────────────────────────────────────────────────────────

interface WishlistState {
  items:              WishlistItem[]
  currentEmail:       string | null
  switchUser:         (email: string | null) => void
  addToWishlist:      (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  toggleWishlist:     (item: WishlistItem) => void
  isWishlisted:       (id: string) => boolean
  clearWishlist:      () => void
}

export const useWishlistStore = create<WishlistState>()((set, get) => {

  // ── Auto-sync with Supabase auth (fires immediately on load) ────────────
  if (typeof window !== 'undefined') {
    // Check existing session first
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email ?? null
      const state = get()
      if (state.currentEmail !== email) {
        // Save whatever is currently in the store under the old key
        saveItems(state.currentEmail, state.items)
        // Load the correct user's items
        set({ items: loadItems(email), currentEmail: email })
      }
    })

    // React to future login / logout events
    supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null
      const state = get()
      if (state.currentEmail !== email) {
        saveItems(state.currentEmail, state.items)
        set({ items: loadItems(email), currentEmail: email })
      }
    })
  }

  return {
    // Initialise with guest items (will be overridden by auth check above)
    items:        loadItems(null),
    currentEmail: null,

    switchUser: (email) => {
      const state = get()
      if (state.currentEmail === email) return   // already on this user, no-op
      saveItems(state.currentEmail, state.items)
      set({ items: loadItems(email), currentEmail: email })
    },

    addToWishlist: (item) =>
      set((state) => {
        if (state.items.some((i) => i.id === item.id)) return state
        const next = [...state.items, item]
        saveItems(state.currentEmail, next)
        return { items: next }
      }),

    removeFromWishlist: (id) =>
      set((state) => {
        const next = state.items.filter((i) => i.id !== id)
        saveItems(state.currentEmail, next)
        return { items: next }
      }),

    toggleWishlist: (item) => {
      const { items, addToWishlist, removeFromWishlist } = get()
      if (items.some((i) => i.id === item.id)) {
        removeFromWishlist(item.id)
      } else {
        addToWishlist(item)
      }
    },

    isWishlisted: (id) => get().items.some((i) => i.id === id),

    clearWishlist: () => set({ items: [] }),
  }
})
