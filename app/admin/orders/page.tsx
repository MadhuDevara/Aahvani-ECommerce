'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  X,
  Gem,
  Package,
  RefreshCw,
} from 'lucide-react'
import { fetchAdminOrdersRows, patchAdminOrderStatus } from '@/lib/admin-orders-client'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const PAGE_SIZE = 8

// ─── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

interface OrderItem {
  name:     string
  size:     string
  quantity: number
  price:    number
  bg:       string
}

interface Order {
  id:            string
  customer:      string
  email:         string
  items:         OrderItem[]
  total:         number
  status:        OrderStatus
  date:          string
  address:       string
  city:          string
  state:         string
  pincode:       string
  deliveryMethod:string
  paymentMethod: string
  estimatedDate: string
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_SEQUENCE: OrderStatus[] = ['Processing', 'Shipped', 'Delivered']

const STATUS_BADGE: Record<OrderStatus, string> = {
  Delivered:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-lux-gold/10 text-lux-gold border border-lux-gold/25',
  Cancelled:  'bg-red-50 text-red-600 border border-red-200',
}

const TABS: { label: string; value: OrderStatus | 'All' }[] = [
  { label: 'All',        value: 'All'        },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped',    value: 'Shipped'    },
  { label: 'Delivered',  value: 'Delivered'  },
  { label: 'Cancelled',  value: 'Cancelled'  },
]

// ─── Detail modal ──────────────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-lux-ink/8 sticky top-0 bg-white z-10">
          <div>
            <p className="font-mono text-xs font-bold text-lux-ink">#{order.id}</p>
            <h2 className="font-serif text-lg font-semibold text-lux-ink mt-0.5">Order Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-lux-ink/30 hover:text-lux-ink border border-lux-ink/10 hover:border-lux-ink/25 transition-all duration-150"
            aria-label="Close"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Customer */}
          <div>
            <p className="text-[0.58rem] tracking-[0.25em] uppercase text-lux-ink/30 font-semibold mb-2">Customer</p>
            <p className="text-sm font-medium text-lux-ink">{order.customer}</p>
            <p className="text-xs text-lux-ink/40 font-light mt-0.5">{order.email}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-[0.58rem] tracking-[0.25em] uppercase text-lux-ink/30 font-semibold mb-3">Items</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={`${item.name}-${item.size}`} className="flex items-center gap-3 p-3 bg-lux-ivory border border-lux-ink/6">
                  <div className={`w-10 h-10 ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Gem size={13} strokeWidth={0.8} className="text-lux-gold/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-lux-ink truncate">{item.name}</p>
                    <p className="text-[0.62rem] text-lux-ink/40 font-light">Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-lux-gold tabular-nums">{inr(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-lux-ink/8">
              <span className="text-xs text-lux-ink/40 font-light">Total</span>
              <span className="font-serif text-base font-semibold text-lux-gold">{inr(order.total)}</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-lux-ink/30 font-semibold mb-2">Delivery Address</p>
              <div className="flex gap-2">
                <MapPin size={12} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-lux-ink/60 font-light leading-relaxed">
                  {order.address},<br />{order.city}, {order.state} – {order.pincode}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-lux-ink/30 font-semibold mb-2">Payment</p>
              <div className="flex gap-2 items-start">
                <CreditCard size={12} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-lux-ink/60 font-light">{order.paymentMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-lux-ink/30 font-semibold mb-2">Delivery Method</p>
              <div className="flex gap-2 items-center">
                <Truck size={12} strokeWidth={1.5} className="text-lux-gold flex-shrink-0" />
                <p className="text-xs text-lux-ink/60 font-light">{order.deliveryMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-lux-ink/30 font-semibold mb-2">Est. Delivery</p>
              <div className="flex gap-2 items-center">
                <Calendar size={12} strokeWidth={1.5} className="text-lux-gold flex-shrink-0" />
                <p className="text-xs text-lux-ink/60 font-light">{order.estimatedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

function mapDbOrder(row: Record<string, unknown>): Order {
  return {
    id:             String(row.id ?? ''),
    customer:       String(row.customer_name ?? row.customer ?? ''),
    email:          String(row.user_email ?? row.customer_email ?? row.email ?? ''),
    items:          Array.isArray(row.items) ? (row.items as OrderItem[]) : [],
    total:          Number(row.total ?? 0),
    status:         (row.status as OrderStatus) ?? 'Processing',
    date:           row.created_at
                      ? new Date(row.created_at as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : String(row.date ?? ''),
    address:        String(row.address ?? ''),
    city:           String(row.city ?? ''),
    state:          String(row.state ?? ''),
    pincode:        String(row.pincode ?? ''),
    deliveryMethod: String(row.delivery_method ?? row.deliveryMethod ?? 'Standard'),
    paymentMethod:  String(row.payment_method ?? row.paymentMethod ?? ''),
    estimatedDate:  String(row.estimated_date ?? row.estimatedDate ?? ''),
  }
}

export default function AdminOrdersPage() {
  const [tab,     setTab]     = useState<OrderStatus | 'All'>('All')
  const [query,   setQuery]   = useState('')
  const [page,    setPage]    = useState(1)
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [fromDb,  setFromDb]  = useState(false)
  const [viewing, setViewing] = useState<Order | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { ok, orders } = await fetchAdminOrdersRows()
      if (ok) {
        setOrders(orders.map(mapDbOrder))
        setFromDb(true)
      } else {
        setOrders([])
        setFromDb(false)
      }
    } catch {
      setOrders([])
      setFromDb(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (tab !== 'All' && o.status !== tab) return false
      if (query) {
        const q = query.toLowerCase()
        if (!o.id.toLowerCase().includes(q) &&
            !o.customer.toLowerCase().includes(q) &&
            !o.email.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [orders, tab, query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const updateStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
    if (fromDb) {
      void patchAdminOrderStatus(id, status)
    }
  }

  const tabCount = (t: OrderStatus | 'All') =>
    t === 'All' ? orders.length : orders.filter((o) => o.status === t).length

  if (loading) {
    return (
      <div className="p-8 bg-lux-ivory-muted min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-lux-gold/20 border-t-lux-gold rounded-full animate-spin" />
          <p className="text-xs text-lux-ink/35 font-light tracking-wide">Loading orders…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 bg-lux-ivory-muted min-h-screen">

      {/* Detail modal */}
      {viewing && <OrderDetailModal order={viewing} onClose={() => setViewing(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-lux-ink">Manage Orders</h1>
          <p className="text-[0.7rem] text-lux-ink/40 mt-1 font-light flex items-center gap-2">
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
            {tab !== 'All' ? ` · ${tab}` : ''}
            {fromDb && (
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[0.55rem] font-semibold tracking-wide rounded">SUPABASE</span>
            )}
          </p>
        </div>
        {/* Quick stats + refresh */}
        <div className="flex gap-3 flex-wrap items-center">
          {['Processing', 'Shipped', 'Delivered'].map((s) => {
            const count = orders.filter((o) => o.status === s).length
            if (!count) return null
            return (
              <div key={s} className={`px-3 py-1.5 border text-[0.62rem] font-semibold flex items-center gap-1.5 ${STATUS_BADGE[s as OrderStatus]}`}>
                <span className="font-bold text-xs">{count}</span>
                {s}
              </div>
            )
          })}
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-2 border border-lux-ink/12 text-lux-ink/40 hover:border-lux-gold/40 hover:text-lux-gold text-[0.68rem] transition-all duration-150"
            aria-label="Refresh orders"
          >
            <RefreshCw size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-lux-ink/8 overflow-x-auto">
        {TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => { setTab(value); setPage(1) }}
            className={`px-4 py-3 text-[0.68rem] tracking-wide font-medium whitespace-nowrap border-b-2 transition-all duration-150 flex items-center gap-2 ${
              tab === value
                ? 'border-lux-gold text-lux-gold'
                : 'border-transparent text-lux-ink/40 hover:text-lux-ink/65'
            }`}
          >
            {label}
            <span className={`text-[0.58rem] px-1.5 py-0.5 rounded-full font-bold ${
              tab === value ? 'bg-lux-gold/15 text-lux-gold' : 'bg-lux-ink/8 text-lux-ink/30'
            }`}>
              {tabCount(value)}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-lux-ink/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          placeholder="Search by order ID, customer or email…"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-lux-ink/12 text-sm text-lux-ink placeholder-lux-ink/25 focus:outline-none focus:border-lux-gold/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-lux-ink/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-lux-ink/6 bg-lux-ivory">
                {['Order', 'Customer', 'Products', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[0.58rem] tracking-[0.2em] uppercase text-lux-ink/35 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lux-ink/5">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package size={28} strokeWidth={0.8} className="text-lux-ink/15 mx-auto mb-3" />
                    <p className="text-sm text-lux-ink/30 font-light">No orders found.</p>
                  </td>
                </tr>
              ) : paged.map((o) => (
                <tr key={o.id} className="hover:bg-lux-ivory transition-colors duration-100">
                  {/* Order ID */}
                  <td className="px-5 py-4 font-mono text-[0.72rem] font-bold text-lux-ink">
                    #{o.id}
                  </td>
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-lux-ink">{o.customer}</p>
                    <p className="text-[0.62rem] text-lux-ink/35 font-light mt-0.5">{o.email}</p>
                  </td>
                  {/* Products */}
                  <td className="px-5 py-4 max-w-[14rem]">
                    {o.items.map((item) => (
                      <p key={item.name} className="text-xs text-lux-ink/60 font-light truncate leading-relaxed">
                        {item.name} ×{item.quantity}
                      </p>
                    ))}
                  </td>
                  {/* Total */}
                  <td className="px-5 py-4 text-sm font-semibold text-lux-gold tabular-nums whitespace-nowrap">
                    {inr(o.total)}
                  </td>
                  {/* Status dropdown */}
                  <td className="px-5 py-4">
                    {o.status === 'Cancelled' ? (
                      <span className={`inline-block px-2.5 py-1 text-[0.58rem] font-semibold tracking-wide rounded-full ${STATUS_BADGE[o.status]}`}>
                        Cancelled
                      </span>
                    ) : (
                      <div className="relative">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                          aria-label={`Update status for order ${o.id}`}
                          className={`appearance-none pl-3 pr-7 py-1.5 text-[0.62rem] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-lux-gold/40 transition-colors ${STATUS_BADGE[o.status]}`}
                          style={{ borderRadius: '9999px' }}
                        >
                          {STATUS_SEQUENCE.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} strokeWidth={2} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                    )}
                  </td>
                  {/* Date */}
                  <td className="px-5 py-4 text-[0.68rem] text-lux-ink/35 font-light whitespace-nowrap">
                    {o.date}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setViewing(o)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[0.62rem] font-medium text-lux-ink/45 border border-lux-ink/12 hover:border-lux-gold/40 hover:text-lux-gold transition-all duration-150 whitespace-nowrap"
                      aria-label={`View details for order ${o.id}`}
                    >
                      <Eye size={11} strokeWidth={1.5} />
                      View
                    </button>
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
                  title={`Page ${n}`}
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
