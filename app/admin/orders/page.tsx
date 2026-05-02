'use client'

import { useState, useMemo } from 'react'
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
} from 'lucide-react'

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

// ─── Dummy data ────────────────────────────────────────────────────────────────

const ALL_ORDERS: Order[] = [
  {
    id: 'AHV-2024-048', customer: 'Priya Sharma',   email: 'priya@example.com',
    items: [{ name: 'Temple Necklace Set',  size: '18"',       quantity: 1, price: 5499, bg: 'bg-[#F9F0E3]' }],
    total: 5499, status: 'Delivered',  date: '2 May 2026',
    address: '12, MG Road', city: 'Mumbai',    state: 'Maharashtra', pincode: '400001',
    deliveryMethod: 'Standard', paymentMethod: 'UPI', estimatedDate: '7 May 2026',
  },
  {
    id: 'AHV-2024-047', customer: 'Riya Kapoor',    email: 'riya@example.com',
    items: [{ name: 'Kundan Polki Ring',    size: 'M (6)',      quantity: 1, price: 3499, bg: 'bg-[#F5EBD8]' }],
    total: 3499, status: 'Shipped',    date: '1 May 2026',
    address: '17-B, Lajpat Nagar', city: 'Delhi',      state: 'Delhi',       pincode: '110024',
    deliveryMethod: 'Express', paymentMethod: 'Visa **4242', estimatedDate: '4 May 2026',
  },
  {
    id: 'AHV-2024-046', customer: 'Sneha Reddy',    email: 'sneha@example.com',
    items: [{ name: 'Meenakari Jhumka',     size: 'Free Size',  quantity: 1, price: 1799, bg: 'bg-[#EFE0C9]' }],
    total: 1799, status: 'Processing', date: '1 May 2026',
    address: '5, Koramangala', city: 'Bangalore', state: 'Karnataka',  pincode: '560034',
    deliveryMethod: 'Standard', paymentMethod: 'Mastercard **8888', estimatedDate: '8 May 2026',
  },
  {
    id: 'AHV-2024-045', customer: 'Anita Nair',     email: 'anita@example.com',
    items: [
      { name: 'Jadau Bangle Pair',    size: 'Free Size', quantity: 1, price: 3499, bg: 'bg-[#EDE4D5]' },
      { name: 'Temple Necklace Set',  size: '18"',       quantity: 1, price: 5499, bg: 'bg-[#F9F0E3]' },
    ],
    total: 8998, status: 'Delivered',  date: '30 Apr 2026',
    address: '22, Residency Road', city: 'Chennai',   state: 'Tamil Nadu',  pincode: '600002',
    deliveryMethod: 'Express', paymentMethod: 'Net Banking', estimatedDate: '4 May 2026',
  },
  {
    id: 'AHV-2024-044', customer: 'Meera Joshi',    email: 'meera@example.com',
    items: [{ name: 'Diamond Cut Bracelet',  size: 'Free Size', quantity: 1, price: 2299, bg: 'bg-[#F0E8D9]' }],
    total: 2299, status: 'Cancelled',  date: '29 Apr 2026',
    address: '8, Civil Lines', city: 'Jaipur',    state: 'Rajasthan',   pincode: '302006',
    deliveryMethod: 'Standard', paymentMethod: 'PhonePe', estimatedDate: '5 May 2026',
  },
  {
    id: 'AHV-2024-043', customer: 'Kavya Menon',    email: 'kavya@example.com',
    items: [{ name: 'Pearl Drop Earrings',   size: 'Free Size', quantity: 2, price: 1499, bg: 'bg-[#EEE8DD]' }],
    total: 2998, status: 'Delivered',  date: '29 Apr 2026',
    address: '3, Park Street', city: 'Kolkata',   state: 'West Bengal', pincode: '700016',
    deliveryMethod: 'Standard', paymentMethod: 'UPI', estimatedDate: '4 May 2026',
  },
  {
    id: 'AHV-2024-042', customer: 'Divya Pillai',   email: 'divya@example.com',
    items: [{ name: 'Antique Gold Necklace', size: '20"',       quantity: 1, price: 4799, bg: 'bg-[#F3E9D8]' }],
    total: 4799, status: 'Shipped',    date: '28 Apr 2026',
    address: '1, Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001',
    deliveryMethod: 'Express', paymentMethod: 'Amazon Pay', estimatedDate: '2 May 2026',
  },
  {
    id: 'AHV-2024-041', customer: 'Pooja Singh',    email: 'pooja@example.com',
    items: [{ name: 'Silver Toe Ring Set',   size: 'Free Size', quantity: 1, price:  899, bg: 'bg-[#E8E0D3]' }],
    total:  899, status: 'Processing', date: '28 Apr 2026',
    address: '45, Shivaji Nagar', city: 'Pune',      state: 'Maharashtra', pincode: '411005',
    deliveryMethod: 'Standard', paymentMethod: 'Paytm', estimatedDate: '3 May 2026',
  },
  {
    id: 'AHV-2024-040', customer: 'Lakshmi Rao',    email: 'lakshmi@example.com',
    items: [{ name: 'Gold Hoops Earrings',   size: 'Free Size', quantity: 1, price: 1299, bg: 'bg-[#F2EBE0]' }],
    total: 1299, status: 'Delivered',  date: '27 Apr 2026',
    address: '7, Banjara Hills', city: 'Hyderabad', state: 'Telangana',   pincode: '500034',
    deliveryMethod: 'Standard', paymentMethod: 'Debit Card', estimatedDate: '2 May 2026',
  },
  {
    id: 'AHV-2024-039', customer: 'Nisha Verma',    email: 'nisha@example.com',
    items: [{ name: 'Kundan Choker Set',     size: '14"',       quantity: 1, price: 6299, bg: 'bg-[#F7EDDA]' }],
    total: 6299, status: 'Shipped',    date: '26 Apr 2026',
    address: '9, Hazratganj', city: 'Lucknow',   state: 'Uttar Pradesh',pincode: '226001',
    deliveryMethod: 'Express', paymentMethod: 'UPI', estimatedDate: '1 May 2026',
  },
]

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_SEQUENCE: OrderStatus[] = ['Processing', 'Shipped', 'Delivered']

const STATUS_BADGE: Record<OrderStatus, string> = {
  Delivered:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-[#C6973F]/10 text-[#C6973F] border border-[#C6973F]/25',
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]/8 sticky top-0 bg-white z-10">
          <div>
            <p className="font-mono text-xs font-bold text-[#1A1A1A]">#{order.id}</p>
            <h2 className="font-serif text-lg font-semibold text-[#1A1A1A] mt-0.5">Order Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/30 hover:text-[#1A1A1A] border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/25 transition-all duration-150"
            aria-label="Close"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Customer */}
          <div>
            <p className="text-[0.58rem] tracking-[0.25em] uppercase text-[#1A1A1A]/30 font-semibold mb-2">Customer</p>
            <p className="text-sm font-medium text-[#1A1A1A]">{order.customer}</p>
            <p className="text-xs text-[#1A1A1A]/40 font-light mt-0.5">{order.email}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-[0.58rem] tracking-[0.25em] uppercase text-[#1A1A1A]/30 font-semibold mb-3">Items</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={`${item.name}-${item.size}`} className="flex items-center gap-3 p-3 bg-[#FAFAF8] border border-[#1A1A1A]/6">
                  <div className={`w-10 h-10 ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Gem size={13} strokeWidth={0.8} className="text-[#C6973F]/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</p>
                    <p className="text-[0.62rem] text-[#1A1A1A]/40 font-light">Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#C6973F] tabular-nums">{inr(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1A1A1A]/8">
              <span className="text-xs text-[#1A1A1A]/40 font-light">Total</span>
              <span className="font-serif text-base font-semibold text-[#C6973F]">{inr(order.total)}</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-[#1A1A1A]/30 font-semibold mb-2">Delivery Address</p>
              <div className="flex gap-2">
                <MapPin size={12} strokeWidth={1.5} className="text-[#C6973F] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#1A1A1A]/60 font-light leading-relaxed">
                  {order.address},<br />{order.city}, {order.state} – {order.pincode}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-[#1A1A1A]/30 font-semibold mb-2">Payment</p>
              <div className="flex gap-2 items-start">
                <CreditCard size={12} strokeWidth={1.5} className="text-[#C6973F] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#1A1A1A]/60 font-light">{order.paymentMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-[#1A1A1A]/30 font-semibold mb-2">Delivery Method</p>
              <div className="flex gap-2 items-center">
                <Truck size={12} strokeWidth={1.5} className="text-[#C6973F] flex-shrink-0" />
                <p className="text-xs text-[#1A1A1A]/60 font-light">{order.deliveryMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-[0.58rem] tracking-[0.25em] uppercase text-[#1A1A1A]/30 font-semibold mb-2">Est. Delivery</p>
              <div className="flex gap-2 items-center">
                <Calendar size={12} strokeWidth={1.5} className="text-[#C6973F] flex-shrink-0" />
                <p className="text-xs text-[#1A1A1A]/60 font-light">{order.estimatedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [tab,     setTab]     = useState<OrderStatus | 'All'>('All')
  const [query,   setQuery]   = useState('')
  const [page,    setPage]    = useState(1)
  const [orders,  setOrders]  = useState<Order[]>(ALL_ORDERS)
  const [viewing, setViewing] = useState<Order | null>(null)

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

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
  }

  const tabCount = (t: OrderStatus | 'All') =>
    t === 'All' ? orders.length : orders.filter((o) => o.status === t).length

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F7F7F5] min-h-screen">

      {/* Detail modal */}
      {viewing && <OrderDetailModal order={viewing} onClose={() => setViewing(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Manage Orders</h1>
          <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light">
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
            {tab !== 'All' ? ` · ${tab}` : ''}
          </p>
        </div>
        {/* Quick stats */}
        <div className="flex gap-3 flex-wrap">
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#1A1A1A]/8 overflow-x-auto">
        {TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => { setTab(value); setPage(1) }}
            className={`px-4 py-3 text-[0.68rem] tracking-wide font-medium whitespace-nowrap border-b-2 transition-all duration-150 flex items-center gap-2 ${
              tab === value
                ? 'border-[#C6973F] text-[#C6973F]'
                : 'border-transparent text-[#1A1A1A]/40 hover:text-[#1A1A1A]/65'
            }`}
          >
            {label}
            <span className={`text-[0.58rem] px-1.5 py-0.5 rounded-full font-bold ${
              tab === value ? 'bg-[#C6973F]/15 text-[#C6973F]' : 'bg-[#1A1A1A]/8 text-[#1A1A1A]/30'
            }`}>
              {tabCount(value)}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          placeholder="Search by order ID, customer or email…"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#1A1A1A]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1A1A1A]/6 bg-[#FAFAF8]">
                {['Order', 'Customer', 'Products', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/5">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package size={28} strokeWidth={0.8} className="text-[#1A1A1A]/15 mx-auto mb-3" />
                    <p className="text-sm text-[#1A1A1A]/30 font-light">No orders found.</p>
                  </td>
                </tr>
              ) : paged.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAFAF8] transition-colors duration-100">
                  {/* Order ID */}
                  <td className="px-5 py-4 font-mono text-[0.72rem] font-bold text-[#1A1A1A]">
                    #{o.id}
                  </td>
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#1A1A1A]">{o.customer}</p>
                    <p className="text-[0.62rem] text-[#1A1A1A]/35 font-light mt-0.5">{o.email}</p>
                  </td>
                  {/* Products */}
                  <td className="px-5 py-4 max-w-[14rem]">
                    {o.items.map((item) => (
                      <p key={item.name} className="text-xs text-[#1A1A1A]/60 font-light truncate leading-relaxed">
                        {item.name} ×{item.quantity}
                      </p>
                    ))}
                  </td>
                  {/* Total */}
                  <td className="px-5 py-4 text-sm font-semibold text-[#C6973F] tabular-nums whitespace-nowrap">
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
                          className={`appearance-none pl-3 pr-7 py-1.5 text-[0.62rem] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C6973F]/40 transition-colors ${STATUS_BADGE[o.status]}`}
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
                  <td className="px-5 py-4 text-[0.68rem] text-[#1A1A1A]/35 font-light whitespace-nowrap">
                    {o.date}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setViewing(o)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[0.62rem] font-medium text-[#1A1A1A]/45 border border-[#1A1A1A]/12 hover:border-[#C6973F]/40 hover:text-[#C6973F] transition-all duration-150 whitespace-nowrap"
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
