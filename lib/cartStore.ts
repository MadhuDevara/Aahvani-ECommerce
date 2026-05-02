import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string           // stringified product id, e.g. "12"
  name: string
  price: number
  originalPrice: number
  quantity: number
  size: string
  category: string
  bg: string
}

interface CartState {
  items: CartItem[]
  addToCart:      (item: CartItem) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart:      () => void
  getTotal:       () => number
  getItemCount:   () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.id === item.id && i.size === item.size
          )
          if (idx !== -1) {
            const updated = [...state.items]
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity + item.quantity,
            }
            return { items: updated }
          }
          return { items: [...state.items, item] }
        }),

      removeFromCart: (id, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
        })),

      updateQuantity: (id, size, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'aahvani-cart' }
  )
)
