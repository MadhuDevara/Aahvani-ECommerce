'use client'

import Link from 'next/link'
import { Gem } from 'lucide-react'
import { inr, productDetailPath } from '@/lib/products'
import type { Product } from '@/types/product'

/**
 * Editorial shop card for rails (Slice A pattern). Links to App Router PDP at `/products/...`.
 */
export default function ProductTile({ product }: { product: Product }) {
  const href = productDetailPath(product)
  const discount =
    product.originalPrice > 0
      ? Math.max(0, Math.round((1 - product.salePrice / product.originalPrice) * 100))
      : 0

  return (
    <article className="group w-[min(78vw,16rem)] flex-shrink-0 sm:w-56 md:w-60">
      <Link href={href} className="block">
        <div
          className={`relative aspect-[3/4] overflow-hidden ring-1 ring-lux-black/5 transition duration-300 hover:ring-lux-gold/35 ${product.bg}`}
        >
          {product.label ? (
            <span className="absolute left-2 top-2 z-[1] bg-lux-gold px-2 py-0.5 text-[0.55rem] font-medium uppercase tracking-[0.14em] text-lux-ivory">
              {product.label}
            </span>
          ) : null}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]">
            <Gem size={56} strokeWidth={0.75} className="text-lux-gold" aria-hidden />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-lux-gold/0 transition-colors duration-300 group-hover:bg-lux-gold/5"
            aria-hidden
          />
        </div>
        <div className="mt-3 space-y-1.5">
          <h3 className="font-serif text-base font-medium leading-snug text-lux-ink transition-colors group-hover:text-lux-gold line-clamp-2">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-medium text-lux-gold">{inr(product.salePrice)}</span>
            {product.originalPrice > product.salePrice ? (
              <span className="text-sm text-lux-ink-subtle line-through">{inr(product.originalPrice)}</span>
            ) : null}
            {discount > 0 ? (
              <span className="text-[0.58rem] font-medium uppercase tracking-wide text-lux-stone">
                {discount}% off
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  )
}
