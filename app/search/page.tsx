'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { Search, Gem, ShoppingBag, ChevronRight } from 'lucide-react'
import { inr, productRouteId, type Product } from '@/lib/products'
import { supabaseSearchProducts } from '@/lib/product-search'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore, wishlistItemFromProduct } from '@/lib/wishlistStore'
import { loginPath } from '@/lib/login-path'
import { hasAuthSession } from '@/lib/has-auth-session'
import ProductTileWithWishlist from '@/components/ProductTileWithWishlist'
import SearchResultSkeleton from '@/components/skeletons/SearchResultSkeleton'
import RippleButton from '@/components/ui/RippleButton'

// ─── Product card (self-contained, same style as ShopClient) ──────────────────

function ResultCard({ product }: { product: Product }) {
  const router         = useRouter()
  const pathname       = usePathname()
  const [added, setAdded] = useState(false)
  const addToCart      = useCartStore((s) => s.addToCart)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted   = useWishlistStore((s) => s.isWishlisted)
  const wishlisted     = isWishlisted(productRouteId(product))
  const discount       = Math.round((1 - product.salePrice / product.originalPrice) * 100)

  const handleAdd = async () => {
    const ok = await addToCart({ id: productRouteId(product), name: product.name, price: product.salePrice, originalPrice: product.originalPrice, quantity: 1, size: 'Free Size', category: product.category, bg: product.bg })
    if (!ok) {
      if (!(await hasAuthSession())) router.push(loginPath(pathname || '/search'))
      return
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group bg-white border border-lux-ink/8 hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--lux-gold)_12%,transparent)] hover:border-lux-gold/20 transition-all duration-300">
      <ProductTileWithWishlist
        href={`/shop/${encodeURIComponent(productRouteId(product))}`}
        productName={product.name}
        bgClassName={product.bg}
        wishlisted={wishlisted}
        onWishlistClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void (async () => {
            const ok = await toggleWishlist(wishlistItemFromProduct(product))
            if (!ok && !(await hasAuthSession())) {
              router.push(loginPath(pathname || '/search'))
            }
          })()
        }}
        label={
          product.label ? (
            <span className="pointer-events-none absolute top-3 left-3 text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-lux-gold text-white font-medium">
              {product.label}
            </span>
          ) : null
        }
      />
      <div className="p-5">
        <p className="text-[0.6rem] tracking-[0.15em] uppercase text-lux-ink/35 font-medium mb-1">{product.category}</p>
        <Link href={`/shop/${encodeURIComponent(productRouteId(product))}`}>
          <h3 className="font-serif text-[0.95rem] font-medium text-lux-ink mb-3 group-hover:text-lux-gold transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2.5 mb-4">
          <span className="text-lux-gold font-semibold text-sm">{inr(product.salePrice)}</span>
          <span className="text-lux-ink/30 text-xs line-through">{inr(product.originalPrice)}</span>
          <span className="text-[0.6rem] text-emerald-600 font-medium ml-auto">{discount}% off</span>
        </div>
        <RippleButton
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-2.5 border text-[0.67rem] tracking-[0.18em] uppercase font-medium transition-all duration-200 ${
            added ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-lux-gold text-lux-gold hover:bg-lux-gold hover:text-white'
          }`}
        >
          <ShoppingBag size={12} strokeWidth={1.5} />
          {added ? 'Added!' : 'Add to Cart'}
        </RippleButton>
      </div>
    </div>
  )
}

// ─── Inner page (needs useSearchParams) ───────────────────────────────────────

function SearchInner() {
  const params  = useSearchParams()
  const query   = params.get('q') ?? ''
  const [results, setResults]     = useState<Product[]>([])
  const [loading, setLoading]    = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      return
    }
    setLoading(true)
    supabaseSearchProducts(q, 60)
      .then(setResults)
      .finally(() => setLoading(false))
  }, [query])

  const SUGGESTIONS = [
    { label: 'Browse All',  href: '/shop'                   },
    { label: 'Rings',       href: '/shop?category=Rings'    },
    { label: 'Earrings',    href: '/shop?category=Earrings' },
    { label: 'Necklaces',   href: '/shop?category=Necklaces'},
    { label: 'Bracelets',   href: '/shop?category=Bracelets'},
  ]

  return (
    <div className="bg-lux-ivory">

      {/* Header */}
      <div className="border-b border-lux-gold/12 bg-lux-ivory px-4 py-6 md:py-8">
        <div className="mx-auto max-w-[min(100%,var(--lux-max))]">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-lux-ink/40">
            <Link href="/" className="hover:text-lux-gold transition-colors">Home</Link>
            <ChevronRight size={11} strokeWidth={1.5} />
            <span className="text-lux-gold">Search</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-lux-ink mb-2">
                Search Results
              </h1>
              {query ? (
                <p className="text-sm text-lux-ink/50 font-light">
                  {loading ? (
                    <>Searching catalogue…</>
                  ) : results.length > 0 ? (
                    <>Showing <span className="font-medium text-lux-ink">{results.length}</span> result{results.length !== 1 ? 's' : ''} for &ldquo;<span className="text-lux-gold font-medium">{query}</span>&rdquo;</>
                  ) : (
                    <>No results for &ldquo;<span className="text-lux-gold font-medium">{query}</span>&rdquo;</>
                  )}
                </p>
              ) : (
                <p className="text-sm text-lux-ink/40 font-light">Enter a search term above</p>
              )}
            </div>

            {/* Inline search bar */}
            <form method="get" action="/search" className="flex-shrink-0 w-full sm:w-auto">
              <div className="relative">
                <Search size={14} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-ink/30" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search jewellery…"
                  className="w-full sm:w-72 pl-10 pr-4 py-3 bg-white border border-lux-ink/12 text-sm text-lux-ink placeholder-lux-ink/25 focus:outline-none focus:border-lux-gold/50 transition-colors"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 py-8 sm:px-6 lg:px-8">

        {/* No query */}
        {!query && (
          <div className="py-12 text-center md:py-14">
            <div className="w-16 h-16 mx-auto mb-5 bg-lux-gold/10 flex items-center justify-center">
              <Search size={28} strokeWidth={1} className="text-lux-gold/50" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-lux-ink mb-2">What are you looking for?</h2>
            <p className="text-sm text-lux-ink/40 font-light mb-8">Try searching for rings, earrings, kundan, silver…</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Kundan', 'Rings', 'Pearl', 'Silver', 'Earrings', 'Bridal'].map((s) => (
                <Link key={s} href={`/search?q=${s}`} className="px-4 py-2 border border-lux-gold/30 text-lux-gold text-xs font-medium hover:bg-lux-gold hover:text-white transition-all duration-150">
                  {s}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && !loading && results.length === 0 && (
          <div className="py-12 text-center md:py-14">
            <div className="w-16 h-16 mx-auto mb-5 bg-lux-ink/5 flex items-center justify-center">
              <Search size={28} strokeWidth={1} className="text-lux-ink/20" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-lux-ink mb-2">No results found</h2>
            <p className="text-sm text-lux-ink/45 font-light mb-8 max-w-xs mx-auto leading-relaxed">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different term or browse our collections.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {SUGGESTIONS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-5 py-2.5 border border-lux-ink/15 text-sm text-lux-ink/55 font-medium hover:border-lux-gold hover:text-lux-gold transition-all duration-150"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results grid */}
        {query && loading && (
          <div className="space-y-4 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SearchResultSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((product) => (
              <ResultCard key={productRouteId(product)} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Page wrapper with Suspense ────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-lux-ivory">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SearchResultSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <SearchInner />
    </Suspense>
  )
}
