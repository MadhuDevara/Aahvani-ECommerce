'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Lock, ChevronRight, Gem } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { loginPath } from '@/lib/login-path'
import { useCartDrawer } from '@/components/cart/cart-drawer-context'

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export default function CartDrawer() {
  const { open, closeDrawer } = useCartDrawer()
  const pathname = usePathname()
  const userId = useCartStore((s) => s.userId)
  const cartReady = useCartStore((s) => s.ready)
  const cartLoading = useCartStore((s) => s.loading)
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const removeFromCart = useCartStore((s) => s.removeFromCart)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeDrawer])

  const subtotal = getTotal()
  const itemCount = items.reduce((a, i) => a + i.quantity, 0)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[140] bg-lux-black/45 backdrop-blur-[2px]"
            aria-label="Close cart"
            onClick={closeDrawer}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 360 }}
            className="fixed top-0 right-0 z-[150] flex h-full w-full max-w-md flex-col bg-lux-ivory shadow-[var(--lux-shadow-nav)]"
          >
            <header className="flex items-center justify-between border-b border-lux-ink/8 px-6 py-5">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-lux-ink/35">
                  Your selection
                </p>
                <h2 id="cart-drawer-title" className="font-serif text-xl font-semibold text-lux-ink">
                  Shopping bag
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-lux-ink/10 text-lux-ink/50 transition hover:border-lux-gold/35 hover:text-lux-ink"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {!cartReady || (userId && cartLoading) ? (
                <div className="flex justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-lux-gold/25 border-t-lux-gold" />
                </div>
              ) : !userId ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lux-gold/10">
                    <Lock size={28} strokeWidth={1} className="text-lux-gold/70" />
                  </div>
                  <p className="font-serif text-lg text-lux-ink">Sign in to use your bag</p>
                  <p className="mt-2 max-w-[240px] text-sm font-light leading-relaxed text-lux-ink/45">
                    Your cart syncs across devices when you&apos;re signed in.
                  </p>
                  <Link
                    href={loginPath(pathname || '/')}
                    onClick={closeDrawer}
                    className="mt-8 inline-flex items-center gap-2 border border-lux-gold bg-lux-gold px-8 py-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-lux-gold-hover"
                  >
                    Sign in
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </Link>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lux-gold/10">
                    <ShoppingBag size={28} strokeWidth={1} className="text-lux-gold/70" />
                  </div>
                  <p className="font-serif text-lg text-lux-ink">Your bag is empty</p>
                  <p className="mt-2 text-sm font-light text-lux-ink/45">
                    Discover pieces crafted for every occasion.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    className="mt-8 inline-flex items-center gap-2 border border-lux-ink/20 px-8 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-lux-ink transition hover:border-lux-gold hover:text-lux-gold"
                  >
                    Explore shop
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => {
                    const line = item.price * item.quantity
                    return (
                      <li
                        key={`${item.id}::${item.size}`}
                        className="rounded-2xl border border-lux-ink/8 bg-white/80 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-sm"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ${item.bg}`}
                          >
                            <div
                              className="absolute inset-0 flex items-center justify-center opacity-20"
                              aria-hidden
                            >
                              <Gem size={28} strokeWidth={0.8} className="text-lux-gold" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-[0.95rem] font-medium leading-snug text-lux-ink">
                              {item.name}
                            </p>
                            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-lux-ink/40">
                              Size {item.size}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                              <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-lux-ink/10">
                                <button
                                  type="button"
                                  className="flex h-9 w-9 items-center justify-center bg-lux-ivory text-lux-ink/55 transition hover:bg-lux-gold/12 hover:text-lux-gold"
                                  aria-label="Decrease quantity"
                                  onClick={() => {
                                    if (item.quantity <= 1) removeFromCart(item.id, item.size)
                                    else updateQuantity(item.id, item.size, item.quantity - 1)
                                  }}
                                >
                                  <Minus size={14} strokeWidth={1.5} />
                                </button>
                                <span className="flex min-w-[2.5rem] items-center justify-center border-x border-lux-ink/10 bg-white text-sm tabular-nums text-lux-ink">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="flex h-9 w-9 items-center justify-center bg-lux-ivory text-lux-ink/55 transition hover:bg-lux-gold/12 hover:text-lux-gold disabled:opacity-35"
                                  aria-label="Increase quantity"
                                  disabled={item.quantity >= 10}
                                  onClick={() =>
                                    updateQuantity(item.id, item.size, item.quantity + 1)
                                  }
                                >
                                  <Plus size={14} strokeWidth={1.5} />
                                </button>
                              </div>
                              <p className="font-serif text-base font-semibold tabular-nums text-lux-gold">
                                {inr(line)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {userId && cartReady && !cartLoading && items.length > 0 && (
              <footer className="border-t border-lux-ink/8 bg-white/90 px-6 py-6 backdrop-blur-md">
                <div className="mb-5 flex items-baseline justify-between">
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-lux-ink/40">
                    Subtotal · {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
                  </span>
                  <span className="font-serif text-2xl font-semibold tabular-nums text-lux-ink">
                    {inr(subtotal)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="flex w-full items-center justify-center gap-2 bg-lux-black py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-lux-black/90"
                >
                  Checkout
                  <ChevronRight size={15} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="mt-3 block w-full text-center text-[0.62rem] uppercase tracking-[0.2em] text-lux-ink/40 transition hover:text-lux-gold"
                >
                  View full cart
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
