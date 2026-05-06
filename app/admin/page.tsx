'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ChevronRight,
  ArrowUpRight,
  Gem,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { fetchAdminOrdersRows } from '@/lib/admin-orders-client'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled' | string

const STATUS_BADGE: Record<string, string> = {
  Delivered:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-lux-gold/10 text-lux-gold border border-lux-gold/25',
  Cancelled:  'bg-red-50 text-red-600 border border-red-200',
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DashStats {
  revenue:   number
  orders:    number
  products:  number
  customers: number
}

interface ChartPoint { day: string; amount: number }
interface TopProduct { name: string; category: string; sales: number; revenue: number }
interface RecentOrder {
  id: string; customer: string; product: string;
  amount: number; status: OrderStatus; date: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ─── Revenue Chart ─────────────────────────────────────────────────────────────

function RevenueChart({ data, loading }: { data: ChartPoint[]; loading: boolean }) {
  const max = Math.max(...data.map((d) => d.amount), 1)
  return (
    <div className="bg-white border border-lux-ink/8 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lux-ink text-sm">Revenue — Last 7 Days</h3>
          <p className="text-[0.65rem] text-lux-ink/40 mt-0.5 font-light">Daily earnings overview</p>
        </div>
        <span className="text-[0.65rem] text-lux-ink/30 bg-lux-ivory-muted border border-lux-ink/8 px-2.5 py-1 font-medium">
          {inr(data.reduce((s, d) => s + d.amount, 0))} total
        </span>
      </div>
      {loading ? (
        <div className="flex items-end gap-2 h-36 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-lux-gold/10 rounded" style={{ height: `${30 + Math.random() * 60}%` }} />
          ))}
        </div>
      ) : (
        <div className="flex items-end gap-2 h-36">
          {data.map((d) => {
            const pct = Math.round((d.amount / max) * 100)
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full relative flex items-end justify-center" style={{ height: '108px' }}>
                  <div
                    className="w-full bg-lux-gold/20 group-hover:bg-lux-gold/35 transition-all duration-200 relative"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-lux-gold group-hover:bg-lux-gold-hover transition-colors duration-200" style={{ height: '4px' }} />
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[0.55rem] text-lux-ink/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {inr(d.amount)}
                    </span>
                  </div>
                </div>
                <span className="text-[0.6rem] text-lux-ink/35 font-medium">{d.day}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats,         setStats]         = useState<DashStats | null>(null)
  const [chartData,     setChartData]     = useState<ChartPoint[]>([])
  const [topProducts,   setTopProducts]   = useState<TopProduct[]>([])
  const [recentOrders,  setRecentOrders]  = useState<RecentOrder[]>([])
  const [loading,       setLoading]       = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      // ── 1. Fetch all orders (service role via admin API — bypasses RLS) ───────
      const { ok, orders } = await fetchAdminOrdersRows()
      const orderList = ok ? orders : []

      // ── 2. Fetch product count ───────────────────────────────────────────────
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // ── 3. Stats ─────────────────────────────────────────────────────────────
      const totalRevenue   = orderList.reduce((s, o) => s + Number(o.total ?? 0), 0)
      const totalOrders    = orderList.length
      const uniqueEmails   = new Set(orderList.map((o) => String(o.user_email ?? '').toLowerCase()).filter(Boolean))
      const totalCustomers = uniqueEmails.size

      setStats({
        revenue:   totalRevenue,
        orders:    totalOrders,
        products:  productCount ?? 0,
        customers: totalCustomers,
      })

      // ── 4. Last 7 days revenue chart ─────────────────────────────────────────
      const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      // Build a map of day label → revenue for the last 7 days
      const dayMap = new Map<string, number>()
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        dayMap.set(DAY_LABELS[d.getDay()], 0)
      }

      for (const o of orderList) {
        const d = new Date(o.created_at as string)
        if (d >= sevenDaysAgo) {
          const label = DAY_LABELS[d.getDay()]
          dayMap.set(label, (dayMap.get(label) ?? 0) + Number(o.total ?? 0))
        }
      }

      setChartData(Array.from(dayMap.entries()).map(([day, amount]) => ({ day, amount })))

      // ── 5. Top products (aggregate from items JSON) ───────────────────────────
      const productMap = new Map<string, { category: string; sales: number; revenue: number }>()

      for (const o of orderList) {
        const items = o.items as { name?: string; category?: string; price?: number; quantity?: number }[] | null
        if (!Array.isArray(items)) continue
        for (const item of items) {
          const name = item.name ?? 'Unknown'
          const existing = productMap.get(name)
          const qty = Number(item.quantity ?? 1)
          const rev = Number(item.price ?? 0) * qty
          if (existing) {
            existing.sales   += qty
            existing.revenue += rev
          } else {
            productMap.set(name, { category: item.category ?? '', sales: qty, revenue: rev })
          }
        }
      }

      const topList = Array.from(productMap.entries())
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setTopProducts(topList)

      // ── 6. Recent orders (last 6) ─────────────────────────────────────────────
      const recent: RecentOrder[] = orderList.slice(0, 6).map((o) => {
        const contact = o.contact as Record<string, string> | null
        const customer = contact?.fullName || contact?.name || String(o.user_email ?? '—')

        const items = o.items as { name?: string }[] | null
        const product = Array.isArray(items) && items.length > 0
          ? (items[0].name ?? '—') + (items.length > 1 ? ` +${items.length - 1} more` : '')
          : '—'

        return {
          id:       String(o.order_number ?? o.id),
          customer,
          product,
          amount:   Number(o.total ?? 0),
          status:   String(o.status ?? 'Processing'),
          date:     fmtDate(o.created_at as string),
        }
      })

      setRecentOrders(recent)
    } catch {
      // silently fail — empty state shows
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const statCards = stats ? [
    { label: 'Total Revenue',   value: inr(stats.revenue),          Icon: TrendingUp, bg: 'bg-lux-gold/10',  text: 'text-lux-gold',    ring: 'border-lux-gold/20' },
    { label: 'Total Orders',    value: String(stats.orders),         Icon: ShoppingBag, bg: 'bg-blue-50',      text: 'text-blue-600',     ring: 'border-blue-100'     },
    { label: 'Total Products',  value: String(stats.products),       Icon: Package,     bg: 'bg-purple-50',    text: 'text-purple-600',   ring: 'border-purple-100'   },
    { label: 'Total Customers', value: String(stats.customers),      Icon: Users,       bg: 'bg-emerald-50',   text: 'text-emerald-600',  ring: 'border-emerald-100'  },
  ] : []

  return (
    <div className="p-6 md:p-8 space-y-7 bg-lux-ivory-muted min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-lux-ink">Admin Dashboard</h1>
          <p className="text-[0.7rem] text-lux-ink/40 mt-1 font-light tracking-wide">
            Welcome back — here&apos;s what&apos;s happening today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-lux-ink/12 text-[0.68rem] tracking-[0.14em] uppercase font-medium text-lux-ink/50 hover:border-lux-gold/40 hover:text-lux-gold transition-all disabled:opacity-40"
          >
            <RefreshCw size={12} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-lux-gold text-white text-[0.7rem] tracking-[0.15em] uppercase font-medium hover:bg-lux-gold-hover transition-colors duration-150"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-lux-ink/8 p-5 animate-pulse">
              <div className="w-10 h-10 bg-lux-ink/5 mb-4" />
              <div className="h-2.5 w-20 bg-lux-ink/5 rounded mb-2" />
              <div className="h-7 w-24 bg-lux-ink/8 rounded" />
            </div>
          ))
        ) : statCards.map((card) => (
          <div key={card.label} className={`bg-white border ${card.ring} p-5`}>
            <div className={`w-10 h-10 ${card.bg} flex items-center justify-center mb-4`}>
              <card.Icon size={18} strokeWidth={1.5} className={card.text} />
            </div>
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-lux-ink/35 font-medium mb-1">{card.label}</p>
            <p className="font-serif text-2xl font-bold text-lux-ink leading-none">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart data={chartData} loading={loading} />
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white border border-lux-ink/8 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lux-ink text-sm">Top Products</h3>
            <Link href="/admin/products" className="text-[0.62rem] text-lux-gold hover:text-lux-gold-hover flex items-center gap-0.5 transition-colors">
              View all <ChevronRight size={11} strokeWidth={1.5} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-3 bg-lux-ink/5 rounded" />
                  <div className="w-8 h-8 bg-lux-ink/5" />
                  <div className="flex-1">
                    <div className="h-2.5 bg-lux-ink/6 rounded w-3/4 mb-1.5" />
                    <div className="h-2 bg-lux-black/4 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-xs text-lux-ink/30 font-light text-center py-8">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-[0.62rem] text-lux-ink/20 font-bold w-4 text-right flex-shrink-0">{i + 1}</span>
                  <div className="w-8 h-8 bg-lux-ivory flex-shrink-0 flex items-center justify-center">
                    <Gem size={13} strokeWidth={0.8} className="text-lux-gold/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-lux-ink truncate">{p.name}</p>
                    <p className="text-[0.6rem] text-lux-ink/35 font-light">{p.category} · {p.sales} sold</p>
                  </div>
                  <p className="text-[0.7rem] font-semibold text-lux-gold whitespace-nowrap flex-shrink-0">
                    {inr(p.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-lux-ink/8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-lux-ink/6">
          <h3 className="font-semibold text-lux-ink text-sm">Recent Orders</h3>
          <Link href="/admin/orders" className="text-[0.62rem] text-lux-gold hover:text-lux-gold-hover flex items-center gap-0.5 transition-colors">
            View all <ChevronRight size={11} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-lux-ink/6 bg-lux-ivory">
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-6 py-3 text-[0.58rem] tracking-[0.2em] uppercase text-lux-ink/35 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lux-ink/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 bg-lux-ink/5 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <ShoppingBag size={28} strokeWidth={0.8} className="text-lux-ink/12 mx-auto mb-3" />
                    <p className="text-sm text-lux-ink/30 font-light">No orders yet.</p>
                  </td>
                </tr>
              ) : recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-lux-ivory transition-colors duration-100">
                  <td className="px-6 py-4 font-mono text-[0.72rem] font-semibold text-lux-ink">#{o.id}</td>
                  <td className="px-6 py-4 text-sm text-lux-ink/70 font-light">{o.customer}</td>
                  <td className="px-6 py-4 text-sm text-lux-ink/70 font-light max-w-[12rem] truncate">{o.product}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-lux-gold tabular-nums">{inr(o.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 text-[0.58rem] font-semibold tracking-wide rounded-full ${STATUS_BADGE[o.status] ?? STATUS_BADGE.Processing}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[0.72rem] text-lux-ink/35 font-light whitespace-nowrap">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
