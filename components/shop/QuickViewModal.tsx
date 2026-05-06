'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Gem, X } from 'lucide-react'
import { inr, productDetailPath, productRouteId } from '@/lib/products'
import type { Product } from '@/types/product'
import { useCartStore } from '@/lib/cartStore'
import { useToast } from '@/hooks/useToast'
import RippleButton from '@/components/ui/RippleButton'

type QuickViewModalProps = {
  product: Product | null
  open: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const addToCart = useCartStore((s) => s.addToCart)
  const { toast } = useToast()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleAddToCart = async () => {
    if (!product) return
    const ok = await addToCart({
      id: productRouteId(product),
      name: product.name,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      quantity: 1,
      size: 'Free Size',
      category: product.category,
      bg: product.bg,
    })
    if (ok) {
      toast.success('Added to bag')
      onClose()
    }
  }

  const p = product

  return (
    <AnimatePresence>
      {open && p ? (
        <>
          <motion.button
            type="button"
            aria-label="Close quick view"
            className="fixed inset-0 z-[125] bg-lux-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            className="fixed left-1/2 top-1/2 z-[135] flex w-[min(92vw,28rem)] max-h-[min(88vh,40rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-sm border border-lux-gold/25 bg-lux-elevated shadow-[var(--lux-shadow-nav)]"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-lux-black/8 px-4 py-3">
              <div className="min-w-0">
                <p id="quick-view-title" className="font-serif text-xl font-semibold leading-tight text-lux-ink">
                  {p.name}
                </p>
                <p className="mt-1 text-xs font-light text-lux-ink-muted">{p.material}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-lux-ink-muted transition hover:bg-lux-black/5 hover:text-lux-ink"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className={`relative aspect-square w-full shrink-0 overflow-hidden ${p.bg}`}>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]">
                <Gem size={72} strokeWidth={0.75} className="text-lux-gold" aria-hidden />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-lux-black/8 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-2xl font-semibold text-lux-gold">{inr(p.salePrice)}</span>
                {p.originalPrice > p.salePrice ? (
                  <span className="text-sm text-lux-ink-subtle line-through">{inr(p.originalPrice)}</span>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <RippleButton
                  type="button"
                  onClick={() => void handleAddToCart()}
                  className="flex-1 bg-lux-black py-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.18em] text-lux-ivory hover:bg-lux-black/90"
                >
                  Add to bag
                </RippleButton>
                <Link
                  href={productDetailPath(p)}
                  onClick={onClose}
                  className="border border-lux-gold/35 py-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.18em] text-lux-gold transition hover:border-lux-gold sm:flex-1"
                >
                  Full details
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
