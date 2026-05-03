'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { Search, Gem, Heart, ShoppingBag, ChevronRight } from 'lucide-react'
import { inr, productRouteId, type Product } from '@/lib/products'
import { supabaseSearchProducts } from '@/lib/product-search'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore } from '@/lib/wishlistStore'

// ─── Product card (self-contained, same style as ShopClient) ──────────────────

function ResultCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addToCart      = useCartStore((s) => s.addToCart)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted   = useWishlistStore((s) => s.isWishlisted)
  const wishlisted     = isWishlisted(productRouteId(product))
  const discount       = Math.round((1 - product.salePrice / product.originalPrice) * 100)

  const handleAdd = () => {
    addToCart({ id: productRouteId(product), name: product.name, price: product.salePrice, originalPrice: product.originalPrice, quantity: 1, size: 'Free Size', category: product.category, bg: product.bg })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group bg-white border border-[#1A1A1A]/8 hover:shadow-[0_8px_32px_rgba(198,151,63,0.12)] hover:border-[#C6973F]/20 transition-all duration-300">
      <Link href={`/shop/${encodeURIComponent(productRouteId(product))}`} className="block">
        <div className={`relative aspect-square ${product.bg} overflow-hidden`}>
          {product.label && (
            <span className="absolute top-3 left-3 z-10 text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-[#C6973F] text-white font-medium">
              {product.label}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist({ id: productRouteId(product), name: product.name, price: product.salePrice, originalPrice: product.originalPrice, category: product.category, bg: product.bg }) }}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/85 hover:bg-white transition-colors"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={13} strokeWidth={1.5} className={wishlisted ? 'fill-[#C6973F] text-[#C6973F]' : 'text-[#1A1A1A]/40'} />
          </button>
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.14]" aria-hidden="true">
            <Gem size={64} strokeWidth={0.8} className="text-[#C6973F]" />
          </div>
          <div className="absolute inset-0 bg-[#C6973F]/0 group-hover:bg-[#C6973F]/4 transition-colors duration-300" />
        </div>
      </Link>
      <div className="p-5">
        <p className="text-[0.6rem] tracking-[0.15em] uppercase text-[#1A1A1A]/35 font-medium mb-1">{product.category}</p>
        <Link href={`/shop/${encodeURIComponent(productRouteId(product))}`}>
          <h3 className="font-serif text-[0.95rem] font-medium text-[#1A1A1A] mb-3 group-hover:text-[#C6973F] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2.5 mb-4">
          <span className="text-[#C6973F] font-semibold text-sm">{inr(product.salePrice)}</span>
          <span className="text-[#1A1A1A]/30 text-xs line-through">{inr(product.originalPrice)}</span>
          <span className="text-[0.6rem] text-emerald-600 font-medium ml-auto">{discount}% off</span>
        </div>
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-2.5 border text-[0.67rem] tracking-[0.18em] uppercase font-medium transition-all duration-200 ${
            added ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-[#C6973F] text-[#C6973F] hover:bg-[#C6973F] hover:text-white'
          }`}
        >
          <ShoppingBag size={12} strokeWidth={1.5} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
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
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* Header */}
      <div className="border-b border-[#C6973F]/12 px-4 py-12 md:py-16 bg-[#FDF6EC]">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/40 mb-5">
            <Link href="/" className="hover:text-[#C6973F] transition-colors">Home</Link>
            <ChevronRight size={11} strokeWidth={1.5} />
            <span className="text-[#C6973F]">Search</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-2">
                Search Results
              </h1>
              {query ? (
                <p className="text-sm text-[#1A1A1A]/50 font-light">
                  {loading ? (
                    <>Searching catalogue…</>
                  ) : results.length > 0 ? (
                    <>Showing <span className="font-medium text-[#1A1A1A]">{results.length}</span> result{results.length !== 1 ? 's' : ''} for &ldquo;<span className="text-[#C6973F] font-medium">{query}</span>&rdquo;</>
                  ) : (
                    <>No results for &ldquo;<span className="text-[#C6973F] font-medium">{query}</span>&rdquo;</>
                  )}
                </p>
              ) : (
                <p className="text-sm text-[#1A1A1A]/40 font-light">Enter a search term above</p>
              )}
            </div>

            {/* Inline search bar */}
            <form method="get" action="/search" className="flex-shrink-0 w-full sm:w-auto">
              <div className="relative">
                <Search size={14} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search jewellery…"
                  className="w-full sm:w-72 pl-10 pr-4 py-3 bg-white border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* No query */}
        {!query && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 bg-[#C6973F]/10 flex items-center justify-center">
              <Search size={28} strokeWidth={1} className="text-[#C6973F]/50" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">What are you looking for?</h2>
            <p className="text-sm text-[#1A1A1A]/40 font-light mb-8">Try searching for rings, earrings, kundan, silver…</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Kundan', 'Rings', 'Pearl', 'Silver', 'Earrings', 'Bridal'].map((s) => (
                <Link key={s} href={`/search?q=${s}`} className="px-4 py-2 border border-[#C6973F]/30 text-[#C6973F] text-xs font-medium hover:bg-[#C6973F] hover:text-white transition-all duration-150">
                  {s}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && !loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 bg-[#1A1A1A]/5 flex items-center justify-center">
              <Search size={28} strokeWidth={1} className="text-[#1A1A1A]/20" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">No results found</h2>
            <p className="text-sm text-[#1A1A1A]/45 font-light mb-8 max-w-xs mx-auto leading-relaxed">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different term or browse our collections.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {SUGGESTIONS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-5 py-2.5 border border-[#1A1A1A]/15 text-sm text-[#1A1A1A]/55 font-medium hover:border-[#C6973F] hover:text-[#C6973F] transition-all duration-150"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results grid */}
        {query && loading && (
          <div className="flex justify-center py-20">
            <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
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
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    }>
      <SearchInner />
    </Suspense>
  )
}
