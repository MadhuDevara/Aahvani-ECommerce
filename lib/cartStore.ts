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

export type AuthUserRef = { id: string; email?: string | null }

function lineKey(item: Pick<CartItem, 'id' | 'size'>) {
  return `${item.id}::${item.size}`
}

function isCartItem(v: unknown): v is CartItem {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' &&
    typeof o.originalPrice === 'number' &&
    typeof o.quantity === 'number' &&
    typeof o.size === 'string' &&
    typeof o.category === 'string' &&
    typeof o.bg === 'string'
  )
}

interface CartState {
  userId:   string | null
  items:    CartItem[]
  loading:  boolean
  /** True after first auth sync (login or confirmed logged-out). */
  ready:    boolean
  switchCartUser: (user: AuthUserRef | null) => Promise<void>
  addToCart:      (item: CartItem) => Promise<boolean>
  removeFromCart: (id: string, size: string) => Promise<void>
  updateQuantity: (id: string, size: string, quantity: number) => Promise<void>
  clearCart:      () => Promise<void>
  getTotal:       () => number
  getItemCount:   () => number
}

/**
 * Bump before mutations / logout so any in-flight SELECT completes stale and is ignored.
 * `fetchCartRows` snapshots epoch before awaiting Supabase.
 */
let hydrationEpoch = 0

/** `null` = superseded by a newer epoch (do not apply). `[]` = loaded successfully, empty cart. */
async function fetchCartRows(userId: string): Promise<CartItem[] | null> {
  const epochSnap = hydrationEpoch
  const { data, error } = await supabase
    .from('cart_items')
    .select('item_data')
    .eq('user_id', userId)
    .order('updated_at', { ascending: true })

  if (epochSnap !== hydrationEpoch) return null

  if (error || !data) return []

  return data
    .map((r) => (r as { item_data: unknown }).item_data)
    .filter(isCartItem)
}

export const useCartStore = create<CartState>()((set, get) => {
  if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return
      const u = session?.user
      void get().switchCartUser(u ? { id: u.id, email: u.email ?? null } : null)
    })
  }

  return {
    userId:  null,
    items:   [],
    loading: false,
    ready:   false,

    switchCartUser: async (user) => {
      if (!user?.id) {
        hydrationEpoch++
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('aahvani-cart-guest')
            localStorage.removeItem('aahvani-cart')
            localStorage.removeItem('aahvani-wl-guest')
          } catch {
            /* ignore */
          }
        }
        set({ userId: null, items: [], loading: false, ready: true })
        return
      }

      if (get().userId === user.id && get().ready) {
        return
      }

      hydrationEpoch++

      set({ userId: user.id, loading: true, ready: true })
      const rows = await fetchCartRows(user.id)
      if (rows === null) {
        set({ loading: false })
        return
      }
      set({ items: rows, loading: false })
    },

    addToCart: async (item) => {
      let uid = get().userId
      if (!uid) {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user?.id) return false
        await get().switchCartUser({ id: user.id, email: user.email ?? null })
        uid = get().userId
        if (!uid) return false
      }

      hydrationEpoch++

      const prev = get().items
      const idx = prev.findIndex((i) => i.id === item.id && i.size === item.size)
      let next: CartItem[]
      if (idx !== -1) {
        next = [...prev]
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + item.quantity,
        }
      } else {
        next = [...prev, item]
      }

      set({ items: next })

      const row = (idx !== -1 ? next[idx]! : next[next.length - 1]!)!

      const { error: upsertError } = await supabase.from('cart_items').upsert(
        {
          user_id:     uid,
          product_key: lineKey(row),
          item_data:   row,
          updated_at:  new Date().toISOString(),
        },
        { onConflict: 'user_id,product_key' },
      )

      if (upsertError) {
        hydrationEpoch++
        const result = await fetchCartRows(uid)
        if (result === null) {
          set({ loading: false })
        } else {
          set({ items: result, loading: false })
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn('[cart] upsert failed:', upsertError.message, upsertError)
        }
        return false
      }

      const result = await fetchCartRows(uid)
      if (result === null) {
        set({ loading: false })
      } else {
        set({ items: result, loading: false })
      }
      return true
    },

    removeFromCart: async (id, size) => {
      const uid = get().userId
      if (!uid) return

      hydrationEpoch++

      const prev = get().items
      const next = prev.filter((i) => !(i.id === id && i.size === size))
      set({ items: next })

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', uid)
        .eq('product_key', lineKey({ id, size }))

      if (error) {
        const reconciled = await fetchCartRows(uid)
        if (reconciled !== null) set({ items: reconciled })
      }
    },

    updateQuantity: async (id, size, quantity) => {
      const uid = get().userId
      if (!uid) return

      if (quantity < 1) {
        await get().removeFromCart(id, size)
        return
      }

      hydrationEpoch++

      const prev = get().items
      const next = prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i,
      )
      set({ items: next })

      const row = next.find((i) => i.id === id && i.size === size)
      if (!row) return

      const { error } = await supabase.from('cart_items').upsert(
        {
          user_id:     uid,
          product_key: lineKey(row),
          item_data:   row,
          updated_at:  new Date().toISOString(),
        },
        { onConflict: 'user_id,product_key' },
      )

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[cart] quantity upsert failed:', error.message, error)
        }
        const reconciled = await fetchCartRows(uid)
        if (reconciled !== null) set({ items: reconciled })
      }
    },

    clearCart: async () => {
      hydrationEpoch++

      const uid = get().userId
      if (!uid) {
        set({ items: [] })
        return
      }
      set({ items: [] })
      const { error } = await supabase.from('cart_items').delete().eq('user_id', uid)
      if (error) {
        const reconciled = await fetchCartRows(uid)
        if (reconciled !== null) set({ items: reconciled })
      }
    },

    getTotal: () =>
      get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

    getItemCount: () =>
      get().items.reduce((sum, i) => sum + i.quantity, 0),
  }
})

if (typeof window !== 'undefined') {
  void supabase.auth
    .getUser()
    .then(({ data: { user }, error }) => {
      if (error || !user?.id) {
        void useCartStore.getState().switchCartUser(null)
        return
      }
      void useCartStore.getState().switchCartUser({ id: user.id, email: user.email ?? null })
    })
    .catch(() => {
      /* Network errors: leave store; onAuthStateChange may hydrate later */
    })
}
