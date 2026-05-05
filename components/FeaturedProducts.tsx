'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { inr, mapSupabaseRowToProduct, productRouteId, type Product } from '@/lib/products'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore, wishlistItemFromProduct } from '@/lib/wishlistStore'
import ProductTileWithWishlist from '@/components/ProductTileWithWishlist'
import { loginPath } from '@/lib/login-path'
import { supabase } from '@/lib/supabase'
import { hasAuthSession } from '@/lib/has-auth-session'
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton'
import RippleButton from '@/components/ui/RippleButton'

export default function FeaturedProducts() {
  const router          = useRouter()
  const pathname        = usePathname()
  const [featured, setFeatured]   = useState<Product[]>([])
  const [ready, setReady]         = useState(false)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const addToCart       = useCartStore((s) => s.addToCart)
  const wishlistItems   = useWishlistStore((s) => s.items)
  const toggleWishlist  = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted    = (key: string) => wishlistItems.some((i) => i.id === key)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .limit(6)
        if (cancelled) return
        if (!error && data?.length) {
          setFeatured(data.map(mapSupabaseRowToProduct))
        } else {
          setFeatured([])
        }
      } catch {
        if (!cancelled) setFeatured([])
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    void run()
    return () => { cancelled = true }
  }, [])

  const handleAddToCart = async (product: Product) => {
    const ok = await addToCart({
      id:            productRouteId(product),
      name:          product.name,
      price:         product.salePrice,
      originalPrice: product.originalPrice,
      quantity:      1,
      size:          'Free Size',
      category:      product.category,
      bg:            product.bg,
    })
    if (!ok) {
      if (!(await hasAuthSession())) router.push(loginPath(pathname || '/'))
      return
    }
    const rid = productRouteId(product)
    setAddedIds((prev) => new Set(prev).add(rid))
    setTimeout(
      () => setAddedIds((prev) => { const n = new Set(prev); n.delete(rid); return n }),
      1500
    )
  }

  if (!ready) {
    return (
      <section className="py-24 bg-[#FDF6EC] px-4" aria-busy="true">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (featured.length === 0) return null

  return (
    <section className="py-24 bg-[#FDF6EC] px-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {featured.map((product, index) => {
            const rid = productRouteId(product)
            const rowKey = rid || `featured-${index}`
            const productWishlisted = isWishlisted(rid)
            const discount = Math.round((1 - product.salePrice / product.originalPrice) * 100)

            return (
              <div
                key={rowKey}
                className="group bg-white hover:shadow-[0_12px_48px_rgba(198,151,63,0.12)] transition-shadow duration-300"
              >
                <ProductTileWithWishlist
                  href={`/shop/${encodeURIComponent(rid)}`}
                  productName={product.name}
                  bgClassName={product.bg}
                  wishlisted={productWishlisted}
                  onWishlistClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    void (async () => {
                      const ok = await toggleWishlist(wishlistItemFromProduct(product))
                      if (!ok && !(await hasAuthSession())) {
                        router.push(loginPath(pathname || '/'))
                      }
                    })()
                  }}
                  label={
                    product.label ? (
                      <span className="pointer-events-none absolute top-3 left-3 text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-[#C6973F] text-white font-medium">
                        {product.label}
                      </span>
                    ) : null
                  }
                />

                <div className="p-5">
                  <Link href={`/shop/${encodeURIComponent(rid)}`}>
                    <h3 className="font-serif text-[0.95rem] font-medium text-[#1A1A1A] mb-3 group-hover:text-[#C6973F] transition-colors duration-200 tracking-wide">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2.5 mb-4">
                    <span className="text-[#C6973F] font-semibold text-sm">{inr(product.salePrice)}</span>
                    <span className="text-[#1A1A1A]/30 text-xs line-through">{inr(product.originalPrice)}</span>
                    <span className="text-[0.6rem] text-emerald-600 font-medium ml-auto">{discount}% off</span>
                  </div>
                  <RippleButton
                    onClick={() => handleAddToCart(product)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 border text-[0.67rem] tracking-[0.18em] uppercase font-medium transition-all duration-200 ${
                      addedIds.has(rid)
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-[#C6973F] text-[#C6973F] hover:bg-[#C6973F] hover:text-white'
                    }`}
                  >
                    <ShoppingBag size={12} strokeWidth={1.5} />
                    {addedIds.has(rid) ? 'Added!' : 'Add to Cart'}
                  </RippleButton>
                </div>
              </div>
            )
          })}
        </div>

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
