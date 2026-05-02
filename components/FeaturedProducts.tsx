'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Gem } from 'lucide-react'
import { PRODUCTS, inr } from '@/lib/products'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore } from '@/lib/wishlistStore'

// Pick the 6 most popular products for the homepage
const FEATURED = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 6)

export default function FeaturedProducts() {
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())
  const addToCart       = useCartStore((s) => s.addToCart)
  const toggleWishlist  = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted    = useWishlistStore((s) => s.isWishlisted)

  const handleAddToCart = (product: (typeof FEATURED)[number]) => {
    addToCart({
      id:            String(product.id),
      name:          product.name,
      price:         product.salePrice,
      originalPrice: product.originalPrice,
      quantity:      1,
      size:          'Free Size',
      category:      product.category,
      bg:            product.bg,
    })
    setAddedIds((prev) => new Set(prev).add(product.id))
    setTimeout(
      () => setAddedIds((prev) => { const n = new Set(prev); n.delete(product.id); return n }),
      1500
    )
  }

  return (
    <section className="py-24 bg-[#FDF6EC] px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[#C6973F] mb-4">Curated for You</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-[#1A1A1A] mb-5">
            Featured Collection
          </h2>
          <div className="flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-[#C6973F]" />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z" fill="#C6973F" />
            </svg>
            <span className="h-px w-10 bg-[#C6973F]" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {FEATURED.map((product) => {
            const productWishlisted = isWishlisted(String(product.id))
            const discount = Math.round((1 - product.salePrice / product.originalPrice) * 100)

            return (
              <div
                key={product.id}
                className="group bg-white hover:shadow-[0_12px_48px_rgba(198,151,63,0.12)] transition-shadow duration-300"
              >
                {/* Image — links to detail page */}
                <Link href={`/shop/${product.id}`} className="block">
                  <div className={`relative aspect-square ${product.bg} overflow-hidden`}>
                    {product.label && (
                      <span className="absolute top-3 left-3 z-10 text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-[#C6973F] text-white font-medium">
                        {product.label}
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist({ id: String(product.id), name: product.name, price: product.salePrice, originalPrice: product.originalPrice, category: product.category, bg: product.bg }) }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/85 hover:bg-white transition-colors duration-200"
                      aria-label={productWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={14}
                        strokeWidth={1.5}
                        className={productWishlisted ? 'fill-[#C6973F] text-[#C6973F]' : 'text-[#1A1A1A]/50'}
                      />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.14]" aria-hidden="true">
                      <Gem size={64} strokeWidth={0.8} className="text-[#C6973F]" />
                    </div>
                    <div className="absolute inset-0 bg-[#C6973F]/0 group-hover:bg-[#C6973F]/4 transition-colors duration-300" />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5">
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-serif text-[0.95rem] font-medium text-[#1A1A1A] mb-3 group-hover:text-[#C6973F] transition-colors duration-200 tracking-wide">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2.5 mb-4">
                    <span className="text-[#C6973F] font-semibold text-sm">{inr(product.salePrice)}</span>
                    <span className="text-[#1A1A1A]/30 text-xs line-through">{inr(product.originalPrice)}</span>
                    <span className="text-[0.6rem] text-emerald-600 font-medium ml-auto">{discount}% off</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 border text-[0.67rem] tracking-[0.18em] uppercase font-medium transition-all duration-200 ${
                      addedIds.has(product.id)
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-[#C6973F] text-[#C6973F] hover:bg-[#C6973F] hover:text-white'
                    }`}
                  >
                    <ShoppingBag size={12} strokeWidth={1.5} />
                    {addedIds.has(product.id) ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-flex items-center px-10 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-[0.68rem] tracking-[0.25em] uppercase font-medium hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
