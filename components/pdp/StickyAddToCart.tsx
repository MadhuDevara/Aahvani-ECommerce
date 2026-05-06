'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { inr } from '@/lib/products'
import type { Product } from '@/types/product'
import RippleButton from '@/components/ui/RippleButton'
import { useToast } from '@/hooks/useToast'

type StickyAddToCartProps = {
  /** Sentinel placed directly below the hero gallery — when it leaves view, the bar shows */
  sentinelRef: React.RefObject<HTMLElement | null>
  product: Product
  selectedSize: string
  /** Return true when the item was added; sticky bar shows a success toast */
  onAddToBag: () => boolean | Promise<boolean>
  disabled?: boolean
}

export default function StickyAddToCart({
  sentinelRef,
  product,
  selectedSize,
  onAddToBag,
  disabled = false,
}: StickyAddToCartProps) {
  const { toast } = useToast()
  const reduce = useReducedMotion()
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMd, setIsMd] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsMd(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries
        if (!e) return
        setShow(!e.isIntersecting)
      },
      { root: null, rootMargin: '0px 0px 0px 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [sentinelRef])

  const bar = (
    <motion.div
      role="region"
      aria-label="Sticky add to cart"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[130] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 lg:pb-6"
      initial={false}
      animate={
        show
          ? { opacity: 1, y: 0 }
          : reduce
            ? { opacity: 0, y: 0 }
            : isMd
              ? { opacity: 0, y: 120 }
              : { opacity: 0, y: 0 }
      }
      transition={
        reduce
          ? { duration: 0.2 }
          : isMd
            ? { type: 'spring', stiffness: 420, damping: 32, mass: 0.85 }
            : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="pointer-events-auto flex w-full max-w-[min(100%,var(--lux-max))] items-center gap-3 rounded-sm border border-lux-black/8 bg-lux-elevated/95 px-3 py-2.5 shadow-[var(--lux-shadow-nav)] backdrop-blur-xl supports-[backdrop-filter]:bg-lux-ivory/88 md:gap-6 md:px-5 md:py-3">
        <div className="min-w-0 flex-1 md:flex md:items-baseline md:gap-10">
          <p className="truncate font-serif text-base font-medium text-lux-ink md:text-lg">{product.name}</p>
          <span className="hidden text-lux-ink-muted md:inline md:text-sm">·</span>
          <p className="hidden truncate text-sm text-lux-ink-muted md:block" title={selectedSize || 'Select size'}>
            {selectedSize ? <span className="text-lux-ink">{selectedSize}</span> : <span>Size —</span>}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 md:gap-5">
          <span className="font-serif text-lg font-semibold text-lux-gold md:text-xl">
            {inr(product.salePrice)}
          </span>
          <RippleButton
            type="button"
            onClick={async () => {
              const r = onAddToBag()
              const ok = typeof r === 'object' && r !== null && 'then' in r ? await r : r
              if (ok) toast.success('Added to bag')
            }}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-lux-ivory transition md:px-6 md:py-3 md:text-[0.68rem] bg-lux-black hover:bg-lux-black/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={16} strokeWidth={1.6} aria-hidden />
            Add to bag
          </RippleButton>
        </div>
      </div>
    </motion.div>
  )

  if (!mounted) return null
  return createPortal(bar, document.body)
}
