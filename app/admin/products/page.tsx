'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Gem,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const PAGE_SIZE = 8

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AdminProduct {
  id:          string | number
  name:        string
  category:    string
  originalPrice: number
  salePrice:   number
  material:    string
  stock:       number
  featured:    boolean
  active:      boolean
  label?:      string
  sku:         string
  bg:          string
}

// Map a Supabase row → AdminProduct
function mapRow(row: Record<string, unknown>): AdminProduct {
  return {
    id:            row.id as string,
    name:          (row.name as string) ?? '',
    category:      (row.category as string) ?? '',
    originalPrice: Number(row.price ?? 0),
    salePrice:     Number(row.discount_price ?? row.price ?? 0),
    material:      (row.material as string) ?? '',
    stock:         Number(row.stock ?? 0),
    featured:      Boolean(row.is_featured),
    active:        true,
    label:         (row.badge as string | undefined),
    sku:           (row.sku as string) ?? '',
    bg:            String(row.bg ?? 'bg-lux-ivory-muted'),
  }
}

export default function AdminProductsPage() {
  const [products,  setProducts]  = useState<AdminProduct[]>([])
  const [loading,   setLoading]   = useState(true)
  const [query,     setQuery]     = useState('')
  const [category,  setCategory]  = useState('All')
  const [page,      setPage]      = useState(1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data?.length) {
        setProducts(data.map(mapRow))
      } else {
        setProducts([])
      }
    } catch {
      setProducts([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b))]

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [products, query, category])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { alert('Failed to delete: ' + error.message); return }
    fetchProducts()
    if (paged.length === 1 && page > 1) setPage((p) => p - 1)
  }

  if (loading) {
    return (
      <div className="p-8 bg-lux-ivory-muted min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-lux-gold/20 border-t-lux-gold rounded-full animate-spin" />
          <p className="text-xs text-lux-ink/35 font-light tracking-wide">Loading products…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 bg-lux-ivory-muted min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-lux-ink">Manage Products</h1>
          <p className="text-[0.7rem] text-lux-ink/40 mt-1 font-light flex items-center gap-2">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} total
            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[0.55rem] font-semibold tracking-wide rounded">SUPABASE</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-lux-ink/12 text-lux-ink/40 hover:border-lux-gold/40 hover:text-lux-gold text-[0.68rem] transition-all duration-150"
            aria-label="Refresh products"
          >
            <RefreshCw size={13} strokeWidth={1.5} />
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-lux-gold text-white text-[0.7rem] tracking-[0.15em] uppercase font-medium hover:bg-lux-gold-hover transition-colors duration-150"
          >
            <Plus size={14} strokeWidth={2} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-lux-ink/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-lux-ink/12 text-sm text-lux-ink placeholder-lux-ink/25 focus:outline-none focus:border-lux-gold/50 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            aria-label="Filter by category"
            className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-lux-ink/12 text-sm text-lux-ink focus:outline-none focus:border-lux-gold/50 transition-colors cursor-pointer"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-lux-ink/30 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-lux-ink/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-lux-ink/6 bg-lux-ivory">
                {['Product', 'Category', 'Price', 'Sale Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[0.58rem] tracking-[0.2em] uppercase text-lux-ink/35 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lux-ink/5">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-lux-ink/30 font-light">
                    No products found.
                  </td>
                </tr>
              ) : paged.map((p) => (
                <tr key={p.id} className="hover:bg-lux-ivory transition-colors duration-100 group">
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${p.bg} flex-shrink-0 flex items-center justify-center`}>
                        <Gem size={14} strokeWidth={0.8} className="text-lux-gold/40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-lux-ink leading-snug">{p.name}</p>
                        <p className="text-[0.6rem] text-lux-ink/30 font-light">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-5 py-4 text-xs text-lux-ink/55 font-light">{p.category}</td>
                  {/* Price */}
                  <td className="px-5 py-4 text-xs text-lux-ink/40 line-through font-light tabular-nums">
                    {inr(p.originalPrice)}
                  </td>
                  {/* Sale Price */}
                  <td className="px-5 py-4 text-sm font-semibold text-lux-gold tabular-nums">
                    {inr(p.salePrice)}
                  </td>
                  {/* Stock */}
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium tabular-nums ${p.stock < 10 ? 'text-red-500' : 'text-lux-ink/55'}`}>
                      {p.stock}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 text-[0.58rem] font-semibold tracking-wide rounded-full ${
                      p.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-lux-ink/6 text-lux-ink/35 border border-lux-ink/10'
                    }`}>
                      {p.active ? 'Active' : 'Draft'}
                    </span>
                    {p.featured && (
                      <span className="ml-1.5 inline-block px-2 py-1 text-[0.55rem] font-semibold tracking-wide rounded-full bg-lux-gold/12 text-lux-gold border border-lux-gold/20">
                        Featured
                      </span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center text-lux-ink/30 hover:text-lux-gold hover:bg-lux-gold/8 border border-transparent hover:border-lux-gold/20 transition-all duration-150"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil size={13} strokeWidth={1.5} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 flex items-center justify-center text-lux-ink/30 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-150"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-lux-ink/6 bg-lux-ivory">
            <p className="text-[0.65rem] text-lux-ink/35 font-light">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                title="Previous page"
                className="w-8 h-8 flex items-center justify-center border border-lux-ink/12 text-lux-ink/40 hover:border-lux-gold/40 hover:text-lux-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={13} strokeWidth={1.5} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 text-[0.7rem] font-medium border transition-all duration-150 ${
                    n === page
                      ? 'bg-lux-gold text-white border-lux-gold'
                      : 'border-lux-ink/12 text-lux-ink/40 hover:border-lux-gold/40 hover:text-lux-gold'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                title="Next page"
                className="w-8 h-8 flex items-center justify-center border border-lux-ink/12 text-lux-ink/40 hover:border-lux-gold/40 hover:text-lux-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronRight size={13} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
