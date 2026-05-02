'use client'

import { useState, useMemo } from 'react'
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
} from 'lucide-react'
import { PRODUCTS } from '@/lib/products'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const PAGE_SIZE = 8

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))]

type AdminProduct = (typeof PRODUCTS)[number] & { stock: number; featured: boolean; active: boolean }

const ADMIN_PRODUCTS: AdminProduct[] = PRODUCTS.map((p) => ({
  ...p,
  stock:    Math.floor(Math.random() * 60) + 5,
  featured: p.popularity > 80,
  active:   true,
}))

export default function AdminProductsPage() {
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('All')
  const [page,     setPage]     = useState(1)
  const [deleted,  setDeleted]  = useState<Set<number>>(new Set())

  const filtered = useMemo(() => {
    return ADMIN_PRODUCTS.filter((p) => {
      if (deleted.has(p.id)) return false
      if (category !== 'All' && p.category !== category) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [query, category, deleted])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this product?')) return
    setDeleted((prev) => new Set(prev).add(id))
    if (paged.length === 1 && page > 1) setPage((p) => p - 1)
  }

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F7F7F5] min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Manage Products</h1>
          <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.15em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-150"
        >
          <Plus size={14} strokeWidth={2} />
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            aria-label="Filter by category"
            className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C6973F]/50 transition-colors cursor-pointer"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#1A1A1A]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1A1A1A]/6 bg-[#FAFAF8]">
                {['Product', 'Category', 'Price', 'Sale Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/5">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-[#1A1A1A]/30 font-light">
                    No products found.
                  </td>
                </tr>
              ) : paged.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors duration-100 group">
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${p.bg} flex-shrink-0 flex items-center justify-center`}>
                        <Gem size={14} strokeWidth={0.8} className="text-[#C6973F]/40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A] leading-snug">{p.name}</p>
                        <p className="text-[0.6rem] text-[#1A1A1A]/30 font-light">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-5 py-4 text-xs text-[#1A1A1A]/55 font-light">{p.category}</td>
                  {/* Price */}
                  <td className="px-5 py-4 text-xs text-[#1A1A1A]/40 line-through font-light tabular-nums">
                    {inr(p.originalPrice)}
                  </td>
                  {/* Sale Price */}
                  <td className="px-5 py-4 text-sm font-semibold text-[#C6973F] tabular-nums">
                    {inr(p.salePrice)}
                  </td>
                  {/* Stock */}
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium tabular-nums ${p.stock < 10 ? 'text-red-500' : 'text-[#1A1A1A]/55'}`}>
                      {p.stock}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 text-[0.58rem] font-semibold tracking-wide rounded-full ${
                      p.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#1A1A1A]/6 text-[#1A1A1A]/35 border border-[#1A1A1A]/10'
                    }`}>
                      {p.active ? 'Active' : 'Draft'}
                    </span>
                    {p.featured && (
                      <span className="ml-1.5 inline-block px-2 py-1 text-[0.55rem] font-semibold tracking-wide rounded-full bg-[#C6973F]/12 text-[#C6973F] border border-[#C6973F]/20">
                        Featured
                      </span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/30 hover:text-[#C6973F] hover:bg-[#C6973F]/8 border border-transparent hover:border-[#C6973F]/20 transition-all duration-150"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil size={13} strokeWidth={1.5} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/30 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-150"
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
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#1A1A1A]/6 bg-[#FAFAF8]">
            <p className="text-[0.65rem] text-[#1A1A1A]/35 font-light">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A]/12 text-[#1A1A1A]/40 hover:border-[#C6973F]/40 hover:text-[#C6973F] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={13} strokeWidth={1.5} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 text-[0.7rem] font-medium border transition-all duration-150 ${
                    n === page
                      ? 'bg-[#C6973F] text-white border-[#C6973F]'
                      : 'border-[#1A1A1A]/12 text-[#1A1A1A]/40 hover:border-[#C6973F]/40 hover:text-[#C6973F]'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A]/12 text-[#1A1A1A]/40 hover:border-[#C6973F]/40 hover:text-[#C6973F] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
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
