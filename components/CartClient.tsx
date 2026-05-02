'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
    <div className="flex gap-4 py-6 first:pt-0">
      {/* Image placeholder */}
      <div className={`w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 ${item.bg} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.15]" aria-hidden="true">
          <Gem size={38} strokeWidth={0.8} className="text-[#C6973F]" />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-serif text-sm font-medium text-[#1A1A1A] leading-snug mb-1 truncate pr-2">
              {item.name}
            </h3>
            <p className="text-[0.62rem] text-[#1A1A1A]/40 tracking-wide font-light">
              Size: <span className="text-[#1A1A1A]/60">{item.size}</span>
              <span className="mx-1.5 text-[#1A1A1A]/20">|</span>
              {item.category}
            </p>
            <p className="text-[0.68rem] text-[#C6973F] font-semibold mt-1">
              {inr(item.price)}
              {discount > 0 && (
                <span className="ml-2 text-[#1A1A1A]/30 text-[0.6rem] font-normal line-through">
                  {inr(item.originalPrice)}
                </span>
              )}
            </p>
          </div>
          {/* Remove */}
          <button
            onClick={() => removeFromCart(item.id, item.size)}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-[#1A1A1A]/25 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Quantity + Line total */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-0">
            <button
              onClick={() => {
                if (item.quantity <= 1) removeFromCart(item.id, item.size)
                else updateQuantity(item.id, item.size, item.quantity - 1)
              }}
              className="w-7 h-7 flex items-center justify-center border border-[#1A1A1A]/15 text-[#1A1A1A]/50 hover:border-[#C6973F] hover:text-[#C6973F] transition-colors duration-150"
              aria-label="Decrease quantity"
            >
              <Minus size={11} strokeWidth={1.5} />
            </button>
            <span className="w-9 h-7 flex items-center justify-center border-y border-[#1A1A1A]/15 text-xs font-medium text-[#1A1A1A] select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => {
                if (item.quantity < 10) updateQuantity(item.id, item.size, item.quantity + 1)
              }}
              disabled={item.quantity >= 10}
              className="w-7 h-7 flex items-center justify-center border border-[#1A1A1A]/15 text-[#1A1A1A]/50 hover:border-[#C6973F] hover:text-[#C6973F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
              aria-label="Increase quantity"
            >
              <Plus size={11} strokeWidth={1.5} />
            </button>
          </div>
          <p className="text-sm font-semibold text-[#1A1A1A]">{inr(lineTotal)}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CartClient() {
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

  // ── Empty cart ─────────────────────────────────────────────────────────────
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
            <div className="bg-white divide-y divide-[#1A1A1A]/6 px-5 sm:px-7">
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
