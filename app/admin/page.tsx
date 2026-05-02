'use client'

import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ChevronRight,
  ArrowUpRight,
  Gem,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

// ─── Dummy data ────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label:  'Total Revenue',
    value:  inr(248650),
    change: '+12.5%',
    up:     true,
    Icon:   TrendingUp,
    bg:     'bg-[#C6973F]/10',
    text:   'text-[#C6973F]',
    ring:   'border-[#C6973F]/20',
  },
  {
    label:  'Total Orders',
    value:  '348',
    change: '+8.1%',
    up:     true,
    Icon:   ShoppingBag,
    bg:     'bg-blue-50',
    text:   'text-blue-600',
    ring:   'border-blue-100',
  },
  {
    label:  'Total Products',
    value:  '124',
    change: '+3',
    up:     true,
    Icon:   Package,
    bg:     'bg-purple-50',
    text:   'text-purple-600',
    ring:   'border-purple-100',
  },
  {
    label:  'Total Customers',
    value:  '1,042',
    change: '+24 this week',
    up:     true,
    Icon:   Users,
    bg:     'bg-emerald-50',
    text:   'text-emerald-600',
    ring:   'border-emerald-100',
  },
]

const RECENT_ORDERS: {
  id: string; customer: string; product: string;
  amount: number; status: OrderStatus; date: string
}[] = [
  { id: 'AHV-2024-048', customer: 'Priya Sharma',   product: 'Temple Necklace Set',   amount: 5499, status: 'Delivered',  date: '2 May 2026'  },
  { id: 'AHV-2024-047', customer: 'Riya Kapoor',    product: 'Kundan Polki Ring',      amount: 3499, status: 'Shipped',    date: '1 May 2026'  },
  { id: 'AHV-2024-046', customer: 'Sneha Reddy',    product: 'Meenakari Jhumka',       amount: 1799, status: 'Processing', date: '1 May 2026'  },
  { id: 'AHV-2024-045', customer: 'Anita Nair',     product: 'Jadau Bangle Pair',      amount: 3499, status: 'Delivered',  date: '30 Apr 2026' },
  { id: 'AHV-2024-044', customer: 'Meera Joshi',    product: 'Diamond Cut Bracelet',   amount: 2299, status: 'Cancelled',  date: '29 Apr 2026' },
  { id: 'AHV-2024-043', customer: 'Kavya Menon',    product: 'Pearl Drop Earrings',    amount: 1499, status: 'Delivered',  date: '29 Apr 2026' },
]

const TOP_PRODUCTS = [
  { name: 'Temple Necklace Set',  category: 'Necklaces', sales: 38, revenue: 208962 },
  { name: 'Kundan Polki Ring',    category: 'Rings',     sales: 31, revenue: 108469 },
  { name: 'Meenakari Jhumka',     category: 'Earrings',  sales: 28, revenue:  50372 },
  { name: 'Jadau Bangle Pair',    category: 'Bracelets', sales: 21, revenue:  73479 },
  { name: 'Pearl Drop Earrings',  category: 'Earrings',  sales: 18, revenue:  26982 },
]

// Last 7 days revenue bar chart data
const CHART_DATA = [
  { day: 'Mon', amount: 8200  },
  { day: 'Tue', amount: 12400 },
  { day: 'Wed', amount: 9800  },
  { day: 'Thu', amount: 15600 },
  { day: 'Fri', amount: 11200 },
  { day: 'Sat', amount: 18900 },
  { day: 'Sun', amount: 14300 },
]

const STATUS_BADGE: Record<OrderStatus, string> = {
  Delivered:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-[#C6973F]/10 text-[#C6973F] border border-[#C6973F]/25',
  Cancelled:  'bg-red-50 text-red-600 border border-red-200',
}

// ─── Revenue chart ─────────────────────────────────────────────────────────────

function RevenueChart() {
  const max = Math.max(...CHART_DATA.map((d) => d.amount))
  return (
    <div className="bg-white border border-[#1A1A1A]/8 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-[#1A1A1A] text-sm">Revenue — Last 7 Days</h3>
          <p className="text-[0.65rem] text-[#1A1A1A]/40 mt-0.5 font-light">Daily earnings overview</p>
        </div>
        <span className="text-[0.65rem] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 font-medium flex items-center gap-1">
          <ArrowUpRight size={11} strokeWidth={2} />
          +18.4% this week
        </span>
      </div>
      <div className="flex items-end gap-2 h-36">
        {CHART_DATA.map((d) => {
          const pct = Math.round((d.amount / max) * 100)
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
              <div className="w-full relative flex items-end justify-center" style={{ height: '108px' }}>
                <div
                  className="w-full bg-[#C6973F]/20 group-hover:bg-[#C6973F]/35 transition-all duration-200 relative"
                  style={{ height: `${pct}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#C6973F] group-hover:bg-[#b5872e] transition-colors duration-200"
                    style={{ height: '4px' }}
                  />
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[0.55rem] text-[#1A1A1A]/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {inr(d.amount)}
                  </span>
                </div>
              </div>
              <span className="text-[0.6rem] text-[#1A1A1A]/35 font-medium">{d.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-7 bg-[#F7F7F5] min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Admin Dashboard</h1>
          <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light tracking-wide">
            Welcome back — here&apos;s what&apos;s happening today
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.15em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-150"
        >
          + Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className={`bg-white border ${card.ring} p-5`}>
            <div className={`w-10 h-10 ${card.bg} flex items-center justify-center mb-4`}>
              <card.Icon size={18} strokeWidth={1.5} className={card.text} />
            </div>
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium mb-1">{card.label}</p>
            <p className="font-serif text-2xl font-bold text-[#1A1A1A] leading-none">{card.value}</p>
            <p className={`text-[0.63rem] mt-2 font-medium flex items-center gap-1 ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
              <ArrowUpRight size={10} strokeWidth={2} />
              {card.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white border border-[#1A1A1A]/8 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[#1A1A1A] text-sm">Top Products</h3>
            <Link href="/admin/products" className="text-[0.62rem] text-[#C6973F] hover:text-[#b5872e] flex items-center gap-0.5 transition-colors">
              View all <ChevronRight size={11} strokeWidth={1.5} />
            </Link>
          </div>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-[0.62rem] text-[#1A1A1A]/20 font-bold w-4 text-right flex-shrink-0">{i + 1}</span>
                <div className="w-8 h-8 bg-[#FDF6EC] flex-shrink-0 flex items-center justify-center">
                  <Gem size={13} strokeWidth={0.8} className="text-[#C6973F]/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1A1A1A] truncate">{p.name}</p>
                  <p className="text-[0.6rem] text-[#1A1A1A]/35 font-light">{p.category} · {p.sales} sold</p>
                </div>
                <p className="text-[0.7rem] font-semibold text-[#C6973F] whitespace-nowrap flex-shrink-0">
                  {inr(p.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-[#1A1A1A]/8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]/6">
          <h3 className="font-semibold text-[#1A1A1A] text-sm">Recent Orders</h3>
          <Link href="/admin/orders" className="text-[0.62rem] text-[#C6973F] hover:text-[#b5872e] flex items-center gap-0.5 transition-colors">
            View all <ChevronRight size={11} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1A1A1A]/6 bg-[#FAFAF8]">
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-6 py-3 text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/5">
              {RECENT_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAFAF8] transition-colors duration-100">
                  <td className="px-6 py-4 font-mono text-[0.72rem] font-semibold text-[#1A1A1A]">#{o.id}</td>
                  <td className="px-6 py-4 text-sm text-[#1A1A1A]/70 font-light">{o.customer}</td>
                  <td className="px-6 py-4 text-sm text-[#1A1A1A]/70 font-light max-w-[12rem] truncate">{o.product}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#C6973F] tabular-nums">{inr(o.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 text-[0.58rem] font-semibold tracking-wide rounded-full ${STATUS_BADGE[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[0.72rem] text-[#1A1A1A]/35 font-light whitespace-nowrap">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
