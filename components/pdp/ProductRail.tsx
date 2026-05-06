'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductTile from '@/components/shop/ProductTile'
import type { Product } from '@/types/product'

const scrollHide =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

export default function ProductRail({
  products,
  heading = 'You may also want',
}: {
  products: Product[]
  heading?: string
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const xMv = useMotionValue(0)
  const [dragBox, setDragBox] = useState({ left: 0, right: 0 })
  const [isMd, setIsMd] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsMd(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    xMv.set(0)
  }, [products, xMv])

  useEffect(() => {
    const measure = () => {
      const o = outerRef.current
      const inner = innerRef.current
      if (!o || !inner) return
      const max = Math.min(0, o.clientWidth - inner.scrollWidth)
      setDragBox({ left: max, right: 0 })
      xMv.set(Math.max(max, Math.min(0, xMv.get())))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (outerRef.current) ro.observe(outerRef.current)
    if (innerRef.current) ro.observe(innerRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [products, xMv])

  const nudgeDesktop = (dir: -1 | 1) => {
    const step = 300
    const next = Math.max(dragBox.left, Math.min(dragBox.right, xMv.get() + dir * step))
    void animate(xMv, next, { type: 'spring', stiffness: 420, damping: 34 })
  }

  const nudgeMobile = (dir: -1 | 1) => {
    mobileScrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  const tiles = products.slice(0, 8)

  return (
    <section className="border-t border-lux-black/8 py-[var(--lux-section-y)]">
      <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-serif text-2xl font-medium italic text-lux-ink md:text-3xl">{heading}</h2>

        <div className="group/rail relative">
          <motion.button
            type="button"
            aria-label="Scroll products left"
            onClick={() => (isMd ? nudgeDesktop(-1) : nudgeMobile(-1))}
            initial={false}
            className="absolute left-0 top-1/2 z-[2] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-lux-black/10 bg-lux-elevated/95 text-lux-ink shadow-sm backdrop-blur-sm transition-opacity duration-300 md:flex md:opacity-0 md:group-hover/rail:opacity-100"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft size={18} strokeWidth={1.5} aria-hidden />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Scroll products right"
            onClick={() => (isMd ? nudgeDesktop(1) : nudgeMobile(1))}
            initial={false}
            className="absolute right-0 top-1/2 z-[2] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-lux-black/10 bg-lux-elevated/95 text-lux-ink shadow-sm backdrop-blur-sm transition-opacity duration-300 md:flex md:opacity-0 md:group-hover/rail:opacity-100"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
          </motion.button>

          <div
            ref={mobileScrollRef}
            className={`flex gap-4 overflow-x-auto pb-2 md:hidden ${scrollHide}`}
          >
            {tiles.map((p) => (
              <ProductTile key={productRouteKey(p)} product={p} />
            ))}
          </div>

          <div ref={outerRef} className="hidden overflow-hidden pb-2 md:block">
            <motion.div
              ref={innerRef}
              style={{ x: xMv }}
              drag="x"
              dragConstraints={dragBox}
              dragElastic={0.08}
              className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
            >
              {tiles.map((p) => (
                <ProductTile key={productRouteKey(p)} product={p} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function productRouteKey(p: Product) {
  return p.routeId ?? String(p.id ?? p.sku)
}
