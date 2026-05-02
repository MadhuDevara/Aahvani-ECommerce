import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  size: string
  category: string
  bg: string
}

const LEGACY_PERSIST_KEY = 'aahvani-cart'

function storageKey(email: string | null) {
  return email ? `aahvani-cart-${email}` : 'aahvani-cart-guest'
}

/** Same pattern as wishlist — avoids saving cart under guest before session hydrates */
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

function mergeCarts(a: CartItem[], b: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>()
  const rowKey = (i: CartItem) => `${i.id}::${i.size}`
  for (const item of a) map.set(rowKey(item), { ...item })
  for (const item of b) {
    const k = rowKey(item)
    const ex = map.get(k)
    if (ex) map.set(k, { ...ex, quantity: ex.quantity + item.quantity })
    else map.set(k, { ...item })
  }
  return [...map.values()]
}

function loadRaw(email: string | null): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(email))
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveRaw(email: string | null, items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(items))
  } catch { /* quota */ }
}

/** Old Zustand persist blob → merge once then drop */
function migrateLegacyZustandCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const legacy = localStorage.getItem(LEGACY_PERSIST_KEY)
    if (!legacy) return []
    const parsed = JSON.parse(legacy) as { state?: { items?: CartItem[] } }
    const items = parsed?.state?.items
    localStorage.removeItem(LEGACY_PERSIST_KEY)
    return Array.isArray(items) ? items : []
  } catch {
    localStorage.removeItem(LEGACY_PERSIST_KEY)
    return []
  }
}

function runOneTimeLegacyMigration(initialEmail: string | null) {
  const legacyItems = migrateLegacyZustandCart()
  if (legacyItems.length === 0) return
  const target = initialEmail
  const merged = mergeCarts(loadRaw(target), legacyItems)
  saveRaw(target, merged)
}

interface CartState {
  items: CartItem[]
  currentEmail: string | null
  switchUser: (email: string | null) => void
  addToCart:      (item: CartItem) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart:      () => void
  getTotal:       () => number
  getItemCount:   () => number
}

export const useCartStore = create<CartState>()((set, get) => {
  if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null
      if (get().currentEmail !== email) get().switchUser(email)
    })
  }

  return {
    items: [],
    currentEmail: null,

    /**
     * Logout (email=null): persist signed-in cart, show empty guest cart.
     * Login: merge guest lines into saved account cart, clear guest bucket.
     */
    switchUser: (email) => {
      const state = get()
      if (state.currentEmail === email) return

      saveRaw(state.currentEmail, state.items)

      if (email) {
        const savedAccount = loadRaw(email)
        const guestLines = state.currentEmail === null ? state.items : []
        const merged = mergeCarts(savedAccount, guestLines)
        saveRaw(email, merged)
        saveRaw(null, [])
        set({ currentEmail: email, items: merged })
      } else {
        saveRaw(null, [])
        set({ currentEmail: null, items: [] })
      }
    },

    addToCart: (item) =>
      set((state) => {
        const idx = state.items.findIndex(
          (i) => i.id === item.id && i.size === item.size
        )
        let next: CartItem[]
        if (idx !== -1) {
          next = [...state.items]
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + item.quantity,
          }
        } else {
          next = [...state.items, item]
        }
        saveRaw(state.currentEmail, next)
        return { items: next }
      }),

    removeFromCart: (id, size) =>
      set((state) => {
        const next = state.items.filter((i) => !(i.id === id && i.size === size))
        saveRaw(state.currentEmail, next)
        return { items: next }
      }),

    updateQuantity: (id, size, quantity) =>
      set((state) => {
        const next = state.items.map((i) =>
          i.id === id && i.size === size ? { ...i, quantity } : i
        )
        saveRaw(state.currentEmail, next)
        return { items: next }
      }),

    clearCart: () => {
      const { currentEmail } = get()
      saveRaw(currentEmail, [])
      set({ items: [] })
    },

    getTotal: () =>
      get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

    getItemCount: () =>
      get().items.reduce((sum, i) => sum + i.quantity, 0),
  }
})

/** Hydrate from localStorage on client only — avoids SSR / hydration mismatches */
if (typeof window !== 'undefined') {
  const email = getEmailSync()
  runOneTimeLegacyMigration(email)
  useCartStore.setState({ currentEmail: email, items: loadRaw(email) })
}
