'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react'
import { fetchAdminOrdersRows } from '@/lib/admin-orders-client'

const inr      = (n: number) => `₹${n.toLocaleString('en-IN')}`
const PAGE_SIZE = 8

type CustomerStatus = 'Active' | 'Inactive'

interface Customer {
  id:      string
  name:    string
  email:   string
  orders:  number
  spent:   number
  joined:  string
  status:  CustomerStatus
}

// ─── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const colors = [
    'bg-[#C6973F]/20 text-[#C6973F]',
    'bg-blue-50 text-blue-600',
    'bg-emerald-50 text-emerald-600',
    'bg-purple-50 text-purple-600',
    'bg-rose-50 text-rose-500',
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[0.65rem] font-bold ${color}`}>
      {initials}
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// A customer is "Active" if they placed any order in the last 6 months
function isActive(lastOrderIso: string) {
  const sixMonthsAgo = Date.now() - 180 * 24 * 60 * 60 * 1000
  return new Date(lastOrderIso).getTime() > sixMonthsAgo
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading,   setLoading]   = useState(true)
  const [query,     setQuery]     = useState('')
  const [page,      setPage]      = useState(1)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const { ok, orders: data } = await fetchAdminOrdersRows()
      if (!ok || !data) throw new Error('orders fetch failed')

      // Aggregate by user_email
      const map = new Map<string, {
        name: string
        email: string
        orders: number
        spent: number
        firstOrder: string
        lastOrder: string
      }>()

      for (const row of data) {
        const email = String(row.user_email ?? '').toLowerCase()
        if (!email) continue

        // Extract name from contact JSON
        const contact = row.contact as Record<string, string> | null
        const name    = contact?.fullName || contact?.name || email.split('@')[0]

        const existing = map.get(email)
        if (existing) {
          existing.orders   += 1
          existing.spent    += Number(row.total ?? 0)
          existing.lastOrder = row.created_at as string
        } else {
          map.set(email, {
            name,
            email,
            orders:     1,
            spent:      Number(row.total ?? 0),
            firstOrder: row.created_at as string,
            lastOrder:  row.created_at as string,
          })
        }
      }

      const list: Customer[] = Array.from(map.values()).map((c, i) => ({
        id:     String(i + 1),
        name:   c.name,
        email:  c.email,
        orders: c.orders,
        spent:  c.spent,
        joined: fmtDate(c.firstOrder),
        status: isActive(c.lastOrder) ? 'Active' : 'Inactive',
      }))

      // Sort by most spent
      list.sort((a, b) => b.spent - a.spent)
      setCustomers(list)
    } catch {
      // Leave empty list on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const filtered = useMemo(() => {
    if (!query.trim()) return customers
    const q = query.toLowerCase()
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    )
  }, [query, customers])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage    = Math.min(page, totalPages)
  const paged       = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const totalSpent  = customers.reduce((s, c) => s + c.spent, 0)
  const activeCount = customers.filter((c) => c.status === 'Active').length

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F7F7F5] min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Customers</h1>
          <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light">
            {loading ? 'Loading…' : `${customers.length} registered customer${customers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A]/12 text-[0.68rem] tracking-[0.14em] uppercase font-medium text-[#1A1A1A]/50 hover:border-[#C6973F]/40 hover:text-[#C6973F] transition-all disabled:opacity-40"
        >
          <RefreshCw size={12} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#1A1A1A]/8 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0">
            <Users size={18} strokeWidth={1.5} className="text-[#C6973F]" />
          </div>
          <div>
            <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium">Total Customers</p>
            <p className="font-serif text-2xl font-bold text-[#1A1A1A] leading-none mt-0.5">
              {loading ? '—' : customers.length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-[#1A1A1A]/8 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <UserCheck size={18} strokeWidth={1.5} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium">Active</p>
            <p className="font-serif text-2xl font-bold text-[#1A1A1A] leading-none mt-0.5">
              {loading ? '—' : activeCount}
            </p>
          </div>
        </div>
        <div className="bg-white border border-[#1A1A1A]/8 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} strokeWidth={1.5} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium">Total Revenue</p>
            <p className="font-serif text-2xl font-bold text-[#1A1A1A] leading-none mt-0.5">
              {loading ? '—' : inr(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#1A1A1A]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1A1A1A]/6 bg-[#FAFAF8]">
                {['Customer', 'Email', 'Orders', 'Total Spent', 'First Order', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="w-6 h-6 border-2 border-[#C6973F]/30 border-t-[#C6973F] rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs text-[#1A1A1A]/30 font-light">Loading customers…</p>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users size={28} strokeWidth={0.8} className="text-[#1A1A1A]/12 mx-auto mb-3" />
                    <p className="text-sm text-[#1A1A1A]/30 font-light">
                      {customers.length === 0 ? 'No orders placed yet.' : 'No customers found.'}
                    </p>
                  </td>
                </tr>
              ) : paged.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors duration-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <p className="text-sm font-medium text-[#1A1A1A]">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#1A1A1A]/50 font-light">{c.email}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-[#1A1A1A]/60 font-light">
                      <ShoppingBag size={12} strokeWidth={1.5} className="text-[#1A1A1A]/25" />
                      {c.orders}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#C6973F] tabular-nums">
                    {inr(c.spent)}
                  </td>
                  <td className="px-5 py-4 text-[0.68rem] text-[#1A1A1A]/35 font-light whitespace-nowrap">
                    {c.joined}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 text-[0.58rem] font-semibold tracking-wide rounded-full ${
                      c.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#1A1A1A]/6 text-[#1A1A1A]/35 border border-[#1A1A1A]/10'
                    }`}>
                      {c.status}
                    </span>
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
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
                title="Previous page"
                className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A]/12 text-[#1A1A1A]/40 hover:border-[#C6973F]/40 hover:text-[#C6973F] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={13} strokeWidth={1.5} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 text-[0.7rem] font-medium border transition-all duration-150 ${
                    n === safePage
                      ? 'bg-[#C6973F] text-white border-[#C6973F]'
                      : 'border-[#1A1A1A]/12 text-[#1A1A1A]/40 hover:border-[#C6973F]/40 hover:text-[#C6973F]'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Next page"
                title="Next page"
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
