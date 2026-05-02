import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id:            string
  name:          string
  price:         number
  originalPrice: number
  category:      string
  bg:            string
}

interface WishlistState {
  items:              WishlistItem[]
  addToWishlist:      (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isWishlisted:       (id: string) => boolean
  toggleWishlist:     (item: WishlistItem) => void
  clearWishlist:      () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) =>
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state
          return { items: [...state.items, item] }
        }),

      removeFromWishlist: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      isWishlisted: (id) => get().items.some((i) => i.id === id),

      toggleWishlist: (item) => {
        const state = get()
        if (state.isWishlisted(item.id)) {
          state.removeFromWishlist(item.id)
        } else {
          state.addToWishlist(item)
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'aahvani-wishlist' }
  )
)
