import { create } from 'zustand'

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
  } catch {
    return []
  }
}

function saveItems(email: string | null, items: WishlistItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(items))
  } catch { /* quota errors ignored */ }
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

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  // Initialise with guest items on first client load (avoids blank-slate flash)
  items:        loadItems(null),
  currentEmail: null,

  switchUser: (email) => {
    const { currentEmail, items } = get()
    // Persist whatever the current user had
    saveItems(currentEmail, items)
    // Load the new user's wishlist
    const next = loadItems(email)
    set({ items: next, currentEmail: email })
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
}))
