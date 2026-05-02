'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  ShoppingBag,
} from 'lucide-react'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const PAGE_SIZE = 8

// ─── Dummy data ────────────────────────────────────────────────────────────────

type CustomerStatus = 'Active' | 'Inactive'

interface Customer {
  id:         number
  name:       string
  email:      string
  orders:     number
  spent:      number
  joined:     string
  status:     CustomerStatus
}

const CUSTOMERS: Customer[] = [
  { id: 1,  name: 'Priya Sharma',    email: 'priya.sharma@gmail.com',   orders: 8,  spent: 42680, joined: '12 Jan 2024', status: 'Active'   },
  { id: 2,  name: 'Riya Kapoor',     email: 'riya.kapoor@outlook.com',  orders: 5,  spent: 18750, joined: '3 Feb 2024',  status: 'Active'   },
  { id: 3,  name: 'Sneha Reddy',     email: 'sneha.r@gmail.com',        orders: 3,  spent: 9420,  joined: '19 Feb 2024', status: 'Active'   },
  { id: 4,  name: 'Anita Nair',      email: 'anita.nair@yahoo.com',     orders: 11, spent: 67890, joined: '5 Mar 2024',  status: 'Active'   },
  { id: 5,  name: 'Meera Joshi',     email: 'meera.joshi@gmail.com',    orders: 2,  spent: 4580,  joined: '21 Mar 2024', status: 'Inactive' },
  { id: 6,  name: 'Kavya Menon',     email: 'kavya.m@hotmail.com',      orders: 6,  spent: 28340, joined: '8 Apr 2024',  status: 'Active'   },
  { id: 7,  name: 'Divya Pillai',    email: 'divya.p@gmail.com',        orders: 4,  spent: 15990, joined: '14 Apr 2024', status: 'Active'   },
  { id: 8,  name: 'Pooja Singh',     email: 'pooja.singh@gmail.com',    orders: 1,  spent: 2299,  joined: '2 May 2024',  status: 'Inactive' },
  { id: 9,  name: 'Lakshmi Rao',     email: 'lakshmi.rao@outlook.com',  orders: 9,  spent: 51200, joined: '18 May 2024', status: 'Active'   },
  { id: 10, name: 'Nisha Verma',     email: 'nisha.verma@gmail.com',    orders: 7,  spent: 36450, joined: '30 May 2024', status: 'Active'   },
]

// ─── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

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

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCustomersPage() {
  const [query, setQuery] = useState('')
  const [page,  setPage]  = useState(1)

  const filtered = useMemo(() => {
    if (!query.trim()) return CUSTOMERS
    const q = query.toLowerCase()
    return CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    )
  }, [query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalSpent  = CUSTOMERS.reduce((s, c) => s + c.spent, 0)
  const activeCount = CUSTOMERS.filter((c) => c.status === 'Active').length

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F7F7F5] min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Customers</h1>
          <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light">
            {CUSTOMERS.length} registered customers
          </p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#1A1A1A]/8 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0">
            <Users size={18} strokeWidth={1.5} className="text-[#C6973F]" />
          </div>
          <div>
            <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium">Total Customers</p>
            <p className="font-serif text-2xl font-bold text-[#1A1A1A] leading-none mt-0.5">{CUSTOMERS.length}</p>
          </div>
        </div>
        <div className="bg-white border border-[#1A1A1A]/8 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <UserCheck size={18} strokeWidth={1.5} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium">Active</p>
            <p className="font-serif text-2xl font-bold text-[#1A1A1A] leading-none mt-0.5">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white border border-[#1A1A1A]/8 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} strokeWidth={1.5} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium">Total Revenue</p>
            <p className="font-serif text-2xl font-bold text-[#1A1A1A] leading-none mt-0.5">{inr(totalSpent)}</p>
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
                {['Customer', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/5">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users size={28} strokeWidth={0.8} className="text-[#1A1A1A]/12 mx-auto mb-3" />
                    <p className="text-sm text-[#1A1A1A]/30 font-light">No customers found.</p>
                  </td>
                </tr>
              ) : paged.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors duration-100">
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <p className="text-sm font-medium text-[#1A1A1A]">{c.name}</p>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-5 py-4 text-xs text-[#1A1A1A]/50 font-light">{c.email}</td>
                  {/* Orders */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-[#1A1A1A]/60 font-light">
                      <ShoppingBag size={12} strokeWidth={1.5} className="text-[#1A1A1A]/25" />
                      {c.orders}
                    </div>
                  </td>
                  {/* Spent */}
                  <td className="px-5 py-4 text-sm font-semibold text-[#C6973F] tabular-nums">
                    {inr(c.spent)}
                  </td>
                  {/* Joined */}
                  <td className="px-5 py-4 text-[0.68rem] text-[#1A1A1A]/35 font-light whitespace-nowrap">
                    {c.joined}
                  </td>
                  {/* Status */}
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
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
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
