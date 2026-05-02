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

/**
 * Read the currently logged-in user's email SYNCHRONOUSLY from Supabase's
 * own localStorage entry. This avoids the async getSession() race condition
 * where addToWishlist fires before getSession resolves, saving under the
 * guest key instead of the user key.
 */
function getEmailSync(): string | null {
  if (typeof window === 'undefined') return null
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.includes('-auth-token')) {
        const raw = localStorage.getItem(key)
        if (!raw) continue
        const data = JSON.parse(raw) as { user?: { email?: string } }
        return data?.user?.email ?? null
      }
    }
  } catch { /* ignore */ }
  return null
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

// Read user email synchronously so the store starts with the right key
const initialEmail = getEmailSync()

export const useWishlistStore = create<WishlistState>()((set, get) => {

  // ── Auto-sync with Supabase auth for future login / logout events ─────────
  if (typeof window !== 'undefined') {
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
    // Initialise with the correct user's items immediately (no async delay)
    items:        loadItems(initialEmail),
    currentEmail: initialEmail,

    switchUser: (email) => {
      const state = get()
      if (state.currentEmail === email) return
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
