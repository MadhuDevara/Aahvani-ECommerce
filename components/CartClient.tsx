'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Tag,
  Lock,
  Gem,
  ChevronRight,
  Check,
  X,
} from 'lucide-react'
import { useCartStore, type CartItem } from '@/lib/cartStore'
import { loginPath } from '@/lib/login-path'

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
const FREE_DELIVERY_THRESHOLD = 999
const DELIVERY_FEE = 99

// ─── Payment badge ────────────────────────────────────────────────────────────
function PaymentBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 border border-[#1A1A1A]/15 text-[0.62rem] font-medium text-[#1A1A1A]/50 tracking-wide rounded-sm">
      {label}
    </span>
  )
}

// ─── Cart item row ────────────────────────────────────────────────────────────
function CartItemRow({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCartStore()
  const lineTotal = item.price * item.quantity
  const discount  = Math.round((1 - item.price / item.originalPrice) * 100)

  return (
    <article className="rounded-2xl border border-[#C6973F]/18 bg-white shadow-[0_4px_28px_rgba(198,151,63,0.08)] p-5 sm:p-6 overflow-visible">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
        {/* Image placeholder */}
        <div
          className={`mx-auto sm:mx-0 w-full max-w-[220px] aspect-square sm:max-w-none sm:w-32 sm:h-32 sm:flex-shrink-0 ${item.bg} relative overflow-hidden rounded-lg`}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.15]" aria-hidden="true">
            <Gem size={44} strokeWidth={0.8} className="text-[#C6973F]" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col gap-5 overflow-visible">
          <div className="flex items-start justify-between gap-4 min-w-0">
            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="font-serif text-base sm:text-[1.05rem] font-medium text-[#1A1A1A] leading-snug break-words">
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] text-[#1A1A1A]/45 tracking-wide font-light">
                <span>
                  Size{' '}
                  <span className="text-[#1A1A1A]/75 font-normal">{item.size}</span>
                </span>
                <span className="text-[#C6973F]/40 hidden sm:inline" aria-hidden="true">
                  •
                </span>
                <span>
                  Category{' '}
                  <span className="text-[#1A1A1A]/75 font-normal">{item.category}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1">
                <span className="text-lg font-semibold text-[#C6973F] tabular-nums">{inr(item.price)}</span>
                {discount > 0 && (
                  <span className="text-sm text-[#1A1A1A]/35 line-through tabular-nums">
                    {inr(item.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFromCart(item.id, item.size)}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[#1A1A1A]/30 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-150"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Quantity row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#1A1A1A]/08">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#1A1A1A]/45 font-medium whitespace-nowrap">
                Quantity
              </span>
              <div className="inline-flex flex-shrink-0 items-stretch rounded-lg overflow-hidden border border-[#1A1A1A]/12 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    if (item.quantity <= 1) removeFromCart(item.id, item.size)
                    else updateQuantity(item.id, item.size, item.quantity - 1)
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-[#FDF6EC] text-[#1A1A1A]/55 hover:bg-[#C6973F]/15 hover:text-[#C6973F] transition-colors duration-150"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <span className="min-w-[3rem] px-2 flex items-center justify-center border-x border-[#1A1A1A]/12 bg-white text-sm font-semibold text-[#1A1A1A] select-none tabular-nums">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (item.quantity < 10) updateQuantity(item.id, item.size, item.quantity + 1)
                  }}
                  disabled={item.quantity >= 10}
                  className="w-10 h-10 flex items-center justify-center bg-[#FDF6EC] text-[#1A1A1A]/55 hover:bg-[#C6973F]/15 hover:text-[#C6973F] disabled:opacity-35 disabled:cursor-not-allowed transition-colors duration-150"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-0.5 sm:min-w-[7rem]">
              <span className="text-[0.62rem] tracking-[0.18em] uppercase text-[#1A1A1A]/35 font-medium">
                Line total
              </span>
              <p className="text-xl font-serif font-semibold text-[#C6973F] tabular-nums whitespace-nowrap">
                {inr(lineTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CartClient() {
  const pathname = usePathname()
  const userId     = useCartStore((s) => s.userId)
  const cartReady  = useCartStore((s) => s.ready)
  const cartLoading = useCartStore((s) => s.loading)
  const { items, clearCart, getTotal } = useCartStore()
  const [mounted, setMounted]           = useState(false)
  const [couponInput, setCouponInput]   = useState('')
  const [appliedCoupon, setApplied]     = useState('')
  const [couponMsg, setCouponMsg]       = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // ── Derived values ─────────────────────────────────────────────────────────
  const subtotal        = getTotal()
  const discountRate    = appliedCoupon === 'WELCOME10' ? 0.1 : 0
  const discountAmount  = Math.round(subtotal * discountRate)
  const deliveryFee     = subtotal - discountAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total           = subtotal - discountAmount + deliveryFee
  const remaining       = FREE_DELIVERY_THRESHOLD - (subtotal - discountAmount)
  const itemCount       = items.reduce((s, i) => s + i.quantity, 0)

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    if (code === 'WELCOME10') {
      setApplied('WELCOME10')
      setCouponMsg({ text: '10% discount applied!', ok: true })
      setCouponInput('')
    } else {
      setApplied('')
      setCouponMsg({ text: 'Invalid coupon code', ok: false })
    }
  }

  const removeCoupon = () => {
    setApplied('')
    setCouponMsg(null)
    setCouponInput('')
  }

  // ── Guard against SSR mismatch ─────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="min-h-[60vh] bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C6973F]/30 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    )
  }

  if (!cartReady || (userId && cartLoading)) {
    return (
      <div className="min-h-[60vh] bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C6973F]/30 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-[65vh] bg-[#FDF6EC] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#C6973F]/10 flex items-center justify-center">
            <Lock size={34} strokeWidth={1} className="text-[#C6973F]/60" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-2">
            Sign in to view your cart
          </h2>
          <p className="text-sm text-[#1A1A1A]/45 font-light mb-8 leading-relaxed">
            Your bag is saved to your account and syncs across devices.
          </p>
          <Link
            href={loginPath(pathname || '/cart')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200"
          >
            Login
            <ChevronRight size={13} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    )
  }

  // ── Empty cart (authenticated) ─────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] bg-[#FDF6EC] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#C6973F]/10 flex items-center justify-center">
            <ShoppingBag size={34} strokeWidth={1} className="text-[#C6973F]/60" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-2">
            Your cart is empty
          </h2>
          <div className="flex items-center justify-center gap-3 my-4" aria-hidden="true">
            <span className="h-px w-8 bg-[#C6973F]/40" />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" />
            </svg>
            <span className="h-px w-8 bg-[#C6973F]/40" />
          </div>
          <p className="text-sm text-[#1A1A1A]/45 font-light mb-8 leading-relaxed">
            Looks like you haven&apos;t added anything yet.<br />
            Discover our handcrafted jewellery collection.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200"
          >
            Explore Collection
            <ChevronRight size={13} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    )
  }

  // ── Filled cart ────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#FDF6EC] min-h-screen">

      {/* Page header */}
      <div className="bg-[#FDF6EC] border-b border-[#C6973F]/12 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
            Shopping Cart
          </h1>
          <p className="text-sm text-[#1A1A1A]/40 font-light mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">

          {/* ── LEFT — Cart items ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-5 overflow-visible">
              {items.map((item) => (
                <CartItemRow key={`${item.id}-${item.size}`} item={item} />
              ))}
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-5 pt-4">
              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/50 hover:text-[#C6973F] transition-colors duration-150 font-light"
              >
                <ChevronRight size={13} strokeWidth={1.5} className="rotate-180" />
                Continue Shopping
              </Link>
              <button
                onClick={() => clearCart()}
                className="text-xs text-[#1A1A1A]/35 hover:text-red-500 transition-colors duration-150 font-light underline underline-offset-2"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── RIGHT — Order summary ──────────────────────────────────────── */}
          <div className="w-full lg:w-80 xl:w-88 flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-white p-6">
              <h2 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-5">
                Order Summary
              </h2>

              {/* Line items */}
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/55 font-light">
                    Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-medium text-[#1A1A1A]">{inr(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1.5 font-light">
                      <Tag size={12} strokeWidth={1.5} />
                      Coupon ({appliedCoupon})
                    </span>
                    <span className="font-medium">− {inr(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/55 font-light">Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-medium text-xs">FREE</span>
                  ) : (
                    <span className="font-medium text-[#1A1A1A]">{inr(deliveryFee)}</span>
                  )}
                </div>
              </div>

              {/* Free delivery nudge */}
              {remaining > 0 && (
                <div className="mb-4 px-3 py-2.5 bg-[#C6973F]/8 border border-[#C6973F]/20 text-[0.65rem] text-[#C6973F] font-medium leading-relaxed">
                  Add {inr(remaining)} more for <span className="font-semibold">FREE delivery</span>
                </div>
              )}

              {/* Gold divider */}
              <div className="flex items-center gap-2 my-4" aria-hidden="true">
                <span className="h-px flex-1 bg-[#C6973F]/20" />
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <path d="M3.5 0L4.2 2.8L7 3.5L4.2 4.2L3.5 7L2.8 4.2L0 3.5L2.8 2.8Z" fill="#C6973F" fillOpacity="0.5" />
                </svg>
                <span className="h-px flex-1 bg-[#C6973F]/20" />
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-[0.68rem] tracking-[0.18em] uppercase text-[#1A1A1A] font-medium">
                  Total
                </span>
                <span className="font-serif text-2xl font-semibold text-[#C6973F]">
                  {inr(total)}
                </span>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#C6973F] text-white text-[0.72rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200 mb-5"
              >
                <Lock size={13} strokeWidth={1.5} />
                Proceed to Checkout
              </Link>

              {/* Coupon */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between px-3 py-2.5 bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <Check size={13} strokeWidth={2} className="text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-700">{appliedCoupon} applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-500 hover:text-red-500 transition-colors duration-150"
                      aria-label="Remove coupon"
                    >
                      <X size={13} strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-0">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponMsg(null) }}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      placeholder="Coupon code"
                      className="flex-1 min-w-0 border border-[#1A1A1A]/15 px-3 py-2.5 text-xs text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F] transition-colors duration-200 bg-[#FDF6EC]"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 border border-l-0 border-[#1A1A1A]/15 text-[0.62rem] tracking-[0.12em] uppercase font-medium text-[#C6973F] hover:bg-[#C6973F] hover:text-white hover:border-[#C6973F] transition-all duration-200 whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p className={`text-[0.62rem] mt-1.5 font-medium ${couponMsg.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                    {couponMsg.text}
                  </p>
                )}
                {!appliedCoupon && !couponMsg && (
                  <p className="text-[0.58rem] text-[#1A1A1A]/30 mt-1.5">
                    Try <span className="font-mono font-semibold">WELCOME10</span> for 10% off
                  </p>
                )}
              </div>

              {/* Payment methods */}
              <div className="pt-4 border-t border-[#1A1A1A]/6">
                <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/30 mb-2.5 font-medium">
                  Accepted Payments
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['UPI', 'Visa', 'Mastercard', 'Net Banking'].map((p) => (
                    <PaymentBadge key={p} label={p} />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[0.65rem] text-[#1A1A1A]/40 font-light">
                  <Lock size={11} strokeWidth={1.5} className="text-emerald-500" />
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
