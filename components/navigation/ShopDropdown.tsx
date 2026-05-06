'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ROWS = [
  { label: 'Rings', href: '/shop?category=Rings' },
  { label: 'Earrings', href: '/shop?category=Earrings' },
  { label: 'Necklaces', href: '/shop?category=Necklaces' },
  { label: 'Bracelets', href: '/shop?category=Bracelets' },
  { label: 'Sets', href: '/shop?category=Sets' },
  { label: 'New arrivals', href: '/shop' },
] as const

type ShopDropdownProps = {
  open: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function ShopDropdown({ open, onMouseEnter, onMouseLeave }: ShopDropdownProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="navigation"
          aria-label="Shop categories"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute left-1/2 top-full z-[110] mt-3 w-[240px] -translate-x-1/2 overflow-hidden rounded-sm border border-lux-stone-light bg-lux-ivory shadow-[var(--lux-shadow-nav)]"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        >
          <div className="h-px w-full bg-lux-gold/60" aria-hidden />
          <ul className="py-1">
            {ROWS.map((row, i) => (
              <li key={row.href}>
                {i > 0 ? <div className="mx-5 h-px bg-lux-stone-light/60" aria-hidden /> : null}
                <Link
                  href={row.href}
                  className="group/row flex items-center justify-between px-5 py-2.5 text-[12px] uppercase tracking-[0.12em] text-lux-ink transition-colors duration-200 hover:bg-lux-black/[0.03] hover:text-lux-gold"
                >
                  <span>{row.label}</span>
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden
                    className="shrink-0 text-lux-gold opacity-0 transition duration-200 group-hover/row:translate-x-0 group-hover/row:opacity-100 -translate-x-1.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-lux-stone-light py-3">
            <Link
              href="/shop"
              className="block text-center text-[10px] uppercase tracking-[0.18em] text-lux-gold transition hover:text-lux-gold-hover"
            >
              View entire catalogue →
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
