'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  LayoutGrid,
  LayoutList,
  Heart,
  ShoppingBag,
  Gem,
  Star,
} from 'lucide-react'
import { PRODUCTS, inr, type Product } from '@/lib/products'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore } from '@/lib/wishlistStore'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterState {
  category: string
  prices: string[]
  materials: string[]
  rating: string
}

const CATEGORIES = ['All', 'Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Sets']

const PRICE_RANGES = [
  { label: 'Under ₹1,000',     min: 0,    max: 999   },
  { label: '₹1,000 – ₹2,500',  min: 1000, max: 2500  },
  { label: '₹2,500 – ₹5,000',  min: 2500, max: 5000  },
  { label: 'Above ₹5,000',     min: 5001, max: Infinity },
]

const MATERIALS = ['Gold Plated', 'Silver', 'Kundan', 'Pearl', 'Oxidised']

const RATINGS = [
  { label: '4★ & above', value: '4' },
  { label: '3★ & above', value: '3' },
]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First'        },
  { value: 'price-asc',  label: 'Price: Low to High'  },
  { value: 'price-desc', label: 'Price: High to Low'  },
  { value: 'popular',    label: 'Most Popular'         },
]

const PAGE_SIZE  = 12

// ─── Helpers ──────────────────────────────────────────────────────────────────


function inPriceRange(price: number, range: { min: number; max: number }) {
  return price >= range.min && price <= range.max
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < Math.floor(value)
              ? 'fill-[#C6973F] text-[#C6973F]'
              : 'fill-[#1A1A1A]/10 text-[#1A1A1A]/10'
          }
        />
      ))}
      <span className="ml-1.5 text-[0.65rem] text-[#1A1A1A]/40 font-light">{value}</span>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  isWishlisted: boolean
  onToggleWishlist: (id: number) => void
  listView?: boolean
}

function ProductCard({ product, isWishlisted, onToggleWishlist, listView }: ProductCardProps) {
  const discount    = Math.round((1 - product.salePrice / product.originalPrice) * 100)
  const addToCart   = useCartStore((s) => s.addToCart)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
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
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (listView) {
    return (
      <div className="group flex bg-white hover:shadow-[0_8px_32px_rgba(198,151,63,0.10)] transition-shadow duration-300">
        <div className={`relative w-36 sm:w-44 flex-shrink-0 ${product.bg} overflow-hidden`}>
          {product.label && (
            <span className="absolute top-2 left-2 z-10 text-[0.55rem] tracking-[0.12em] uppercase px-2 py-0.5 bg-[#C6973F] text-white font-medium">
              {product.label}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.14]" aria-hidden="true">
            <Gem size={44} strokeWidth={0.8} className="text-[#C6973F]" />
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-serif text-base font-medium text-[#1A1A1A] group-hover:text-[#C6973F] transition-colors duration-200 leading-snug">
                {product.name}
              </h3>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center hover:text-[#C6973F] transition-colors duration-200"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  className={isWishlisted ? 'fill-[#C6973F] text-[#C6973F]' : 'text-[#1A1A1A]/40'}
                />
              </button>
            </div>
            <p className="text-[0.65rem] text-[#C6973F]/70 mb-2 tracking-wide">{product.material}</p>
            <StarRating value={product.rating} />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1A1A1A]/6">
            <div className="flex items-baseline gap-2">
              <span className="text-[#C6973F] font-semibold text-sm">{inr(product.salePrice)}</span>
              <span className="text-[#1A1A1A]/30 text-xs line-through">{inr(product.originalPrice)}</span>
              <span className="text-[0.58rem] text-emerald-600 font-medium">{discount}% off</span>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3.5 py-2 border text-[0.62rem] tracking-[0.14em] uppercase font-medium transition-all duration-200 ${
                added ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-[#C6973F] text-[#C6973F] hover:bg-[#C6973F] hover:text-white'
              }`}
            >
              <ShoppingBag size={11} strokeWidth={1.5} />
              {added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white hover:shadow-[0_12px_48px_rgba(198,151,63,0.12)] transition-shadow duration-300">
      <div className={`relative aspect-square ${product.bg} overflow-hidden`}>
        {product.label && (
          <span className="absolute top-3 left-3 z-10 text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-[#C6973F] text-white font-medium">
            {product.label}
          </span>
        )}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/85 hover:bg-white transition-colors duration-200"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={isWishlisted ? 'fill-[#C6973F] text-[#C6973F]' : 'text-[#1A1A1A]/50'}
          />
        </button>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.14]" aria-hidden="true">
          <Gem size={64} strokeWidth={0.8} className="text-[#C6973F]" />
        </div>
        <div className="absolute inset-0 bg-[#C6973F]/0 group-hover:bg-[#C6973F]/4 transition-colors duration-300" />
      </div>
      <div className="p-4">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-serif text-[0.92rem] font-medium text-[#1A1A1A] mb-1 group-hover:text-[#C6973F] transition-colors duration-200 tracking-wide leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-[0.62rem] text-[#C6973F]/70 mb-2 tracking-wide">{product.material}</p>
        <StarRating value={product.rating} />
        <div className="flex items-baseline gap-2 mt-2.5 mb-3.5">
          <span className="text-[#C6973F] font-semibold text-sm">{inr(product.salePrice)}</span>
          <span className="text-[#1A1A1A]/30 text-xs line-through">{inr(product.originalPrice)}</span>
          <span className="text-[0.58rem] text-emerald-600 font-medium ml-auto">{discount}% off</span>
        </div>
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 border text-[0.65rem] tracking-[0.16em] uppercase font-medium transition-all duration-200 ${
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

interface FilterPanelProps {
  filters: FilterState
  products: Product[]
  onCategoryChange: (v: string) => void
  onPriceToggle: (v: string) => void
  onMaterialToggle: (v: string) => void
  onRatingChange: (v: string) => void
  onClear: () => void
  isFiltered: boolean
}

function FilterPanel({
  filters,
  products,
  onCategoryChange,
  onPriceToggle,
  onMaterialToggle,
  onRatingChange,
  onClear,
  isFiltered,
}: FilterPanelProps) {
  const catCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = { All: products.length }
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1
    })
    return counts
  }, [products])

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-[0.62rem] tracking-[0.28em] uppercase text-[#1A1A1A] font-medium mb-3">
          Category
        </h3>
        <ul className="space-y-2">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryChange(cat)}
                className={`w-full flex items-center justify-between text-sm transition-colors duration-150 ${
                  filters.category === cat
                    ? 'text-[#C6973F] font-medium'
                    : 'text-[#1A1A1A]/60 hover:text-[#C6973F]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-xs ${
                    filters.category === cat ? 'text-[#C6973F]' : 'text-[#1A1A1A]/30'
                  }`}
                >
                  {catCounts[cat] ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-[#1A1A1A]/8" />

      {/* Price Range */}
      <div>
        <h3 className="text-[0.62rem] tracking-[0.28em] uppercase text-[#1A1A1A] font-medium mb-3">
          Price Range
        </h3>
        <ul className="space-y-2.5">
          {PRICE_RANGES.map(({ label }) => (
            <li key={label}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <span
                  className={`w-4 h-4 flex-shrink-0 border transition-colors duration-150 flex items-center justify-center ${
                    filters.prices.includes(label)
                      ? 'border-[#C6973F] bg-[#C6973F]'
                      : 'border-[#1A1A1A]/25 group-hover:border-[#C6973F]'
                  }`}
                >
                  {filters.prices.includes(label) && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.prices.includes(label)}
                  onChange={() => onPriceToggle(label)}
                />
                <span
                  className={`text-sm transition-colors duration-150 ${
                    filters.prices.includes(label)
                      ? 'text-[#C6973F]'
                      : 'text-[#1A1A1A]/60 group-hover:text-[#1A1A1A]'
                  }`}
                >
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-[#1A1A1A]/8" />

      {/* Material */}
      <div>
        <h3 className="text-[0.62rem] tracking-[0.28em] uppercase text-[#1A1A1A] font-medium mb-3">
          Material
        </h3>
        <ul className="space-y-2.5">
          {MATERIALS.map((mat) => (
            <li key={mat}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <span
                  className={`w-4 h-4 flex-shrink-0 border transition-colors duration-150 flex items-center justify-center ${
                    filters.materials.includes(mat)
                      ? 'border-[#C6973F] bg-[#C6973F]'
                      : 'border-[#1A1A1A]/25 group-hover:border-[#C6973F]'
                  }`}
                >
                  {filters.materials.includes(mat) && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.materials.includes(mat)}
                  onChange={() => onMaterialToggle(mat)}
                />
                <span
                  className={`text-sm transition-colors duration-150 ${
                    filters.materials.includes(mat)
                      ? 'text-[#C6973F]'
                      : 'text-[#1A1A1A]/60 group-hover:text-[#1A1A1A]'
                  }`}
                >
                  {mat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-[#1A1A1A]/8" />

      {/* Rating */}
      <div>
        <h3 className="text-[0.62rem] tracking-[0.28em] uppercase text-[#1A1A1A] font-medium mb-3">
          Rating
        </h3>
        <ul className="space-y-2">
          {RATINGS.map(({ label, value }) => (
            <li key={value}>
              <button
                onClick={() => onRatingChange(filters.rating === value ? '' : value)}
                className={`w-full text-left flex items-center gap-2 text-sm transition-colors duration-150 ${
                  filters.rating === value
                    ? 'text-[#C6973F] font-medium'
                    : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                    filters.rating === value
                      ? 'border-[#C6973F]'
                      : 'border-[#1A1A1A]/30'
                  }`}
                >
                  {filters.rating === value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6973F]" />
                  )}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear filters */}
      {isFiltered && (
        <button
          onClick={onClear}
          className="w-full py-2.5 border border-[#C6973F] text-[#C6973F] text-[0.65rem] tracking-[0.2em] uppercase font-medium hover:bg-[#C6973F] hover:text-white transition-all duration-200 mt-2"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ShopClient({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const productList = initialProducts && initialProducts.length > 0 ? initialProducts : PRODUCTS
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>(() => {
    const cat = searchParams.get('category') ?? 'All'
    return {
      category:  CATEGORIES.includes(cat) ? cat : 'All',
      prices:    [],
      materials: [],
      rating:    '',
    }
  })
  const [sortBy, setSortBy]               = useState('newest')
  const [view, setView]                   = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage]     = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const toggleWishlistStore = useWishlistStore((s) => s.toggleWishlist)
  const isWishlistedStore   = useWishlistStore((s) => s.isWishlisted)

  // Sync category filter when URL param changes (e.g. navigating from homepage cards)
  useEffect(() => {
    const cat = searchParams.get('category') ?? 'All'
    const resolved = CATEGORIES.includes(cat) ? cat : 'All'
    setFilters((prev) => ({ ...prev, category: resolved }))
    setCurrentPage(1)
  }, [searchParams])

  // ── Derived state ──────────────────────────────────────────────────────────

  const isFiltered =
    filters.category !== 'All' ||
    filters.prices.length > 0 ||
    filters.materials.length > 0 ||
    filters.rating !== ''

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    filters.prices.length +
    filters.materials.length +
    (filters.rating ? 1 : 0)

  const filteredProducts = useMemo(() => {
    let result = productList.filter((p) => {
      if (filters.category !== 'All' && p.category !== filters.category) return false
      if (
        filters.prices.length > 0 &&
        !filters.prices.some((label) => {
          const range = PRICE_RANGES.find((r) => r.label === label)
          return range ? inPriceRange(p.salePrice, range) : false
        })
      )
        return false
      if (filters.materials.length > 0 && !filters.materials.includes(p.material)) return false
      if (filters.rating && p.rating < parseFloat(filters.rating)) return false
      return true
    })

    switch (sortBy) {
      case 'price-asc':  return [...result].sort((a, b) => a.salePrice - b.salePrice)
      case 'price-desc': return [...result].sort((a, b) => b.salePrice - a.salePrice)
      case 'popular':    return [...result].sort((a, b) => b.popularity - a.popularity)
      default:           return [...result].sort((a, b) => b.id - a.id)
    }
  }, [filters, sortBy, productList])

  const totalCount  = filteredProducts.length
  const totalPages  = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage    = Math.min(currentPage, totalPages)

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleWishlist = (id: number) => {
    const p = productList.find((prod) => prod.id === id)
    if (!p) return
    toggleWishlistStore({ id: String(p.id), name: p.name, price: p.salePrice, originalPrice: p.originalPrice, category: p.category, bg: p.bg })
  }

  const updateFilters = (patch: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }))

  const toggleArr = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

  const clearFilters = () => {
    setFilters({ category: 'All', prices: [], materials: [], rating: '' })
    setCurrentPage(1)
  }

  const goToPage = (p: number) => {
    setCurrentPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filterProps: FilterPanelProps = {
    filters,
    products:         productList,
    onCategoryChange: (v) => { updateFilters({ category: v }); setCurrentPage(1) },
    onPriceToggle:    (v) => { updateFilters({ prices: toggleArr(filters.prices, v) }); setCurrentPage(1) },
    onMaterialToggle: (v) => { updateFilters({ materials: toggleArr(filters.materials, v) }); setCurrentPage(1) },
    onRatingChange:   (v) => { updateFilters({ rating: v }); setCurrentPage(1) },
    onClear:          clearFilters,
    isFiltered,
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const startItem = (safePage - 1) * PAGE_SIZE + 1
  const endItem   = Math.min(safePage * PAGE_SIZE, totalCount)

  return (
    <>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="bg-[#FDF6EC] border-b border-[#C6973F]/12 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/40 mb-4">
            <Link href="/" className="hover:text-[#C6973F] transition-colors duration-150">
              Home
            </Link>
            <ChevronRight size={12} strokeWidth={1.5} />
            <span className="text-[#C6973F]">Shop</span>
          </nav>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-[#1A1A1A] mb-1">
                Our Collection
              </h1>
              <p className="text-sm text-[#1A1A1A]/40 font-light tracking-wide">
                {totalCount} curated pieces, handcrafted with love
              </p>
            </div>
            {/* Decorative divider */}
            <div className="hidden md:flex items-center gap-3 pb-1" aria-hidden="true">
              <span className="h-px w-10 bg-[#C6973F]/40" />
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 0L5.4 3.6L9 4.5L5.4 5.4L4.5 9L3.6 5.4L0 4.5L3.6 3.6Z" fill="#C6973F" />
              </svg>
              <span className="h-px w-10 bg-[#C6973F]/40" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8 lg:gap-10">

          {/* ── Desktop sidebar ─────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 xl:w-60 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[0.62rem] tracking-[0.32em] uppercase text-[#1A1A1A] font-semibold">
                  Filters
                </h2>
                {isFiltered && (
                  <span className="w-5 h-5 rounded-full bg-[#C6973F] text-white text-[0.6rem] flex items-center justify-center font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* ── Products column ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#1A1A1A]/8">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-[#1A1A1A]/20 text-[#1A1A1A] text-[0.68rem] tracking-[0.12em] uppercase font-medium hover:border-[#C6973F] hover:text-[#C6973F] transition-colors duration-200"
                >
                  <SlidersHorizontal size={13} strokeWidth={1.5} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#C6973F] text-white text-[0.58rem] flex items-center justify-center font-semibold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <p className="text-xs text-[#1A1A1A]/45 font-light">
                  Showing <span className="text-[#1A1A1A] font-medium">{startItem}–{endItem}</span> of{' '}
                  <span className="text-[#1A1A1A] font-medium">{totalCount}</span> products
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort products"
                    title="Sort products"
                    className="appearance-none pl-3 pr-8 py-2 border border-[#1A1A1A]/15 bg-white text-[0.72rem] text-[#1A1A1A] tracking-wide focus:outline-none focus:border-[#C6973F] transition-colors duration-200 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    strokeWidth={1.5}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 pointer-events-none"
                  />
                </div>

                {/* View toggle */}
                <div className="flex border border-[#1A1A1A]/15 overflow-hidden">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 transition-colors duration-150 ${
                      view === 'grid'
                        ? 'bg-[#C6973F] text-white'
                        : 'bg-white text-[#1A1A1A]/40 hover:text-[#C6973F]'
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={15} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 transition-colors duration-150 ${
                      view === 'list'
                        ? 'bg-[#C6973F] text-white'
                        : 'bg-white text-[#1A1A1A]/40 hover:text-[#C6973F]'
                    }`}
                    aria-label="List view"
                  >
                    <LayoutList size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {isFiltered && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.category !== 'All' && (
                  <FilterChip
                    label={filters.category}
                    onRemove={() => { updateFilters({ category: 'All' }); setCurrentPage(1) }}
                  />
                )}
                {filters.prices.map((p) => (
                  <FilterChip
                    key={p}
                    label={p}
                    onRemove={() => { updateFilters({ prices: filters.prices.filter((v) => v !== p) }); setCurrentPage(1) }}
                  />
                ))}
                {filters.materials.map((m) => (
                  <FilterChip
                    key={m}
                    label={m}
                    onRemove={() => { updateFilters({ materials: filters.materials.filter((v) => v !== m) }); setCurrentPage(1) }}
                  />
                ))}
                {filters.rating && (
                  <FilterChip
                    label={RATINGS.find((r) => r.value === filters.rating)?.label ?? ''}
                    onRemove={() => { updateFilters({ rating: '' }); setCurrentPage(1) }}
                  />
                )}
              </div>
            )}

            {/* Product grid / list */}
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center">
                <Gem size={40} strokeWidth={0.8} className="text-[#C6973F]/30 mx-auto mb-4" />
                <p className="font-serif text-xl text-[#1A1A1A]/40 mb-2">No products found</p>
                <p className="text-sm text-[#1A1A1A]/30 mb-6">Try adjusting or clearing your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 border border-[#C6973F] text-[#C6973F] text-[0.68rem] tracking-[0.2em] uppercase font-medium hover:bg-[#C6973F] hover:text-white transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={isWishlistedStore(String(p.id))}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={isWishlistedStore(String(p.id))}
                    onToggleWishlist={toggleWishlist}
                    listView
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12 pt-8 border-t border-[#1A1A1A]/8">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="w-9 h-9 flex items-center justify-center border border-[#1A1A1A]/15 text-[#1A1A1A]/50 hover:border-[#C6973F] hover:text-[#C6973F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} strokeWidth={1.5} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 flex items-center justify-center text-[0.75rem] font-medium border transition-all duration-150 ${
                      page === safePage
                        ? 'bg-[#C6973F] border-[#C6973F] text-white'
                        : 'border-[#1A1A1A]/15 text-[#1A1A1A]/50 hover:border-[#C6973F] hover:text-[#C6973F]'
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={page === safePage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="w-9 h-9 flex items-center justify-center border border-[#1A1A1A]/15 text-[#1A1A1A]/50 hover:border-[#C6973F] hover:text-[#C6973F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white max-h-[88vh] flex flex-col rounded-t-2xl shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]/8 flex-shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} strokeWidth={1.5} className="text-[#C6973F]" />
                <h2 className="text-sm font-semibold text-[#1A1A1A] tracking-wide">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C6973F] text-white text-[0.6rem] flex items-center justify-center font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors duration-150"
                aria-label="Close filters"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterPanel {...filterProps} />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 px-5 py-4 border-t border-[#1A1A1A]/8 flex-shrink-0">
              <button
                onClick={() => { clearFilters(); setMobileFilterOpen(false) }}
                className="flex-1 py-3 border border-[#1A1A1A]/20 text-[#1A1A1A] text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:border-[#1A1A1A] transition-colors duration-200"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C6973F]/10 border border-[#C6973F]/30 text-[#C6973F] text-[0.65rem] tracking-wide font-medium">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-[#b5872e] transition-colors duration-150">
        <X size={11} strokeWidth={2} />
      </button>
    </span>
  )
}
