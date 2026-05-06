'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Gem } from 'lucide-react'
import { inr } from '@/lib/products'
import { useCartStore } from '@/lib/cartStore'
import LuxInput from '@/components/checkout/LuxInput'
import RippleButton from '@/components/ui/RippleButton'

type OrderSummaryProps = {
  shippingFee: number
  discount: number
  promoCode: string
  promoError: string
  promoApplied: boolean
  onPromoCodeChange: (v: string) => void
  onApplyPromo: () => void
}

export default function OrderSummary({
  shippingFee,
  discount,
  promoCode,
  promoError,
  promoApplied,
  onPromoCodeChange,
  onApplyPromo,
}: OrderSummaryProps) {
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)

  const subtotal = getTotal()
  const total = Math.max(0, subtotal + shippingFee - discount)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [lg, setLg] = useState(true)
  const innerRef = useRef<HTMLDivElement>(null)
  const [contentH, setContentH] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setLg(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    setContentH(el.scrollHeight)
  }, [lg, mobileOpen, items, subtotal, shippingFee, discount, promoApplied, promoCode, promoError])

  const lineItems = useMemo(
    () =>
      items.map((item) => (
        <li key={`${item.id}-${item.size}`} className="flex gap-3 border-b border-lux-black/6 py-3 first:pt-0 last:border-b-0">
          <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-sm ${item.bg}`}>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]" aria-hidden>
              <Gem size={22} strokeWidth={0.8} className="text-lux-gold" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-medium leading-snug text-lux-ink line-clamp-2">{item.name}</p>
            <p className="mt-0.5 text-[11px] text-lux-ink-muted">
              {item.size} · Qty {item.quantity}
            </p>
          </div>
          <p className="shrink-0 self-start pt-0.5 text-sm font-medium tabular-nums text-lux-ink">
            {inr(item.price * item.quantity)}
          </p>
        </li>
      )),
    [items],
  )

  const inner = (
    <div ref={innerRef} className="p-5">
      <h2 className="font-serif text-lg font-semibold text-lux-ink">Order summary</h2>
      <ul className="mt-4">{lineItems}</ul>
      <div className="mt-5 space-y-2 border-t border-lux-black/8 pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="font-light text-lux-ink-muted">Subtotal</span>
          <span className="tabular-nums text-lux-ink">{inr(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="font-light text-lux-ink-muted">Shipping</span>
          <span className="tabular-nums text-lux-ink">
            {shippingFee === 0 ? <span className="text-lux-gold">FREE</span> : inr(shippingFee)}
          </span>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between gap-4">
            <span className="font-light text-lux-ink-muted">Discount</span>
            <span className="tabular-nums text-lux-gold">−{inr(discount)}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <LuxInput
            label="Promo code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            error={promoError ? promoError : undefined}
            autoComplete="off"
          />
        </div>
        <RippleButton
          type="button"
          onClick={onApplyPromo}
          className="shrink-0 border border-lux-gold/50 bg-lux-black px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-lux-ivory hover:bg-lux-black/90 sm:mb-[2px]"
        >
          Apply
        </RippleButton>
      </div>
      {promoApplied && discount > 0 ? (
        <p className="mt-2 text-[11px] text-lux-gold">Promo applied — you saved {inr(discount)}</p>
      ) : null}

      <div className="mt-6 flex items-baseline justify-between border-t border-lux-black/8 pt-4">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-lux-ink">Total</span>
        <span className="font-serif text-2xl font-semibold tabular-nums text-lux-gold">{inr(total)}</span>
      </div>
    </div>
  )

  return (
    <aside className="lg:sticky lg:top-[var(--lux-sticky-top)] lg:self-start">
      <div className="overflow-hidden rounded-sm border border-lux-stone-light bg-lux-elevated/90 shadow-sm backdrop-blur-sm">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 border-b border-lux-stone-light px-4 py-3 text-left lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
        >
          <span className="text-sm font-medium text-lux-ink">Order summary</span>
          <span className="flex items-center gap-2 font-serif text-lg font-semibold text-lux-gold tabular-nums">
            {inr(total)}
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={`text-lux-ink-muted transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </span>
        </button>

        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{ height: lg ? 'auto' : mobileOpen ? contentH : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {inner}
        </motion.div>
      </div>
    </aside>
  )
}
