'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Product } from '@/types/product'

type Panel = {
  id: string
  title: string
  content: React.ReactNode
}

export default function AccordionDetails({ product }: { product: Product }) {
  const rootId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const [heights, setHeights] = useState<number[]>([])

  const panels: Panel[] = useMemo(
    () => [
      {
        id: 'description',
        title: 'Description',
        content: (
          <div className="space-y-3 text-sm font-light leading-relaxed text-lux-ink-muted">
            <p>
              {product.description?.trim()
                ? product.description
                : `${product.name} — handcrafted ${product.material.toLowerCase()} jewellery designed for timeless wear. Subtle enough for everyday, refined enough for celebration.`}
            </p>
          </div>
        ),
      },
      {
        id: 'materials',
        title: 'Materials & care',
        content: (
          <ul className="list-none space-y-2.5 text-sm font-light leading-relaxed text-lux-ink-muted">
            <li>
              <span className="font-medium text-lux-ink">Finish:</span> {product.material}
            </li>
            <li>
              Store in a dry pouch. Avoid perfumes and moisture on plated pieces; polish with a soft
              cloth.
            </li>
            <li>Remove before swimming or heavy exercise.</li>
          </ul>
        ),
      },
      {
        id: 'sizing',
        title: 'Sizing',
        content: (
          <p className="text-sm font-light leading-relaxed text-lux-ink-muted">
            Select a size above before adding to bag. For rings and necklaces, use our size guide
            from the shop — measurements are indicative and may vary slightly by design.
          </p>
        ),
      },
      {
        id: 'delivery',
        title: 'Delivery & returns',
        content: (
          <ul className="list-none space-y-2.5 text-sm font-light leading-relaxed text-lux-ink-muted">
            <li>Complimentary domestic shipping on qualifying orders; dispatch within the stated window at checkout.</li>
            <li>Returns accepted within the policy period for unworn pieces in original packaging.</li>
            <li>Need help? Reach us from Contact — we reply within one business day.</li>
          </ul>
        ),
      },
    ],
    [product],
  )

  useLayoutEffect(() => {
    const next = panels.map((_, i) => {
      const el = contentRefs.current[i]
      return el ? el.scrollHeight : 0
    })
    setHeights(next)
  }, [panels, openIndex, product.description, product.material, product.name])

  useEffect(() => {
    const onResize = () => {
      const next = panels.map((_, i) => {
        const el = contentRefs.current[i]
        return el ? el.scrollHeight : 0
      })
      setHeights(next)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [panels])

  return (
    <div className="border-t border-lux-black/8">
      {panels.map((panel, i) => {
        const open = openIndex === i
        const regionId = `${rootId}-${panel.id}`
        const h = heights[i] ?? 0

        return (
          <div key={panel.id} className="border-b border-lux-black/8">
            <button
              type="button"
              id={`${regionId}-header`}
              aria-expanded={open}
              aria-controls={`${regionId}-region`}
              onClick={() => setOpenIndex((v) => (v === i ? null : i))}
              className="flex w-full items-center justify-between gap-3 py-4 text-left transition-colors hover:bg-lux-black/[0.02]"
            >
              <span className="font-serif text-lg italic text-lux-ink">{panel.title}</span>
              <motion.span
                aria-hidden
                className="inline-flex text-lux-gold"
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <Plus size={20} strokeWidth={1.4} />
              </motion.span>
            </button>

            <motion.div
              id={`${regionId}-region`}
              role="region"
              aria-labelledby={`${regionId}-header`}
              aria-hidden={!open}
              initial={false}
              animate={{ height: open ? h : 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div
                ref={(el) => {
                  contentRefs.current[i] = el
                }}
                className="pb-5 pr-1 pt-0"
              >
                {panel.content}
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
