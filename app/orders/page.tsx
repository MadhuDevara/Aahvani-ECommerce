'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  Package,
  PackageCheck,
  PackageX,
  Clock,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Star,
  TrendingUp,
  Gem,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'

interface OrderItem {
  name:     string
  size:     string
  quantity: number
  price:    number
  bg:       string
}

interface TrackingStep {
  label:     string
  time:      string | null
  completed: boolean
  current:   boolean
}

interface Order {
  id:             string
  date:           string
  status:         OrderStatus
  items:          OrderItem[]
  total:          number
  address:        string
  city:           string
  state:          string
  pincode:        string
  deliveryMethod: string
  paymentMethod:  string
  estimatedDate:  string
  trackingNumber: string | null
  tracking:       TrackingStep[]
}

// ─── Dummy data ────────────────────────────────────────────────────────────────


// ─── Helpers ───────────────────────────────────────────────────────────────────

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, {
  badge:    string
  Icon:     React.FC<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>
  dot:      string
}> = {
  Delivered:  { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',  Icon: PackageCheck as never, dot: 'bg-emerald-500'  },
  Shipped:    { badge: 'bg-blue-50 text-blue-700 border border-blue-200',           Icon: Truck        as never, dot: 'bg-blue-500'     },
  Processing: { badge: 'bg-lux-gold/12 text-lux-gold border border-lux-gold/30',Icon: Clock        as never, dot: 'bg-lux-gold'   },
  Cancelled:  { badge: 'bg-red-50 text-red-600 border border-red-200',             Icon: PackageX     as never, dot: 'bg-red-500'     },
}

// ─── Tracking timeline ─────────────────────────────────────────────────────────

function TrackingTimeline({ steps, trackingNumber }: { steps: TrackingStep[]; trackingNumber: string | null }) {
  const [copied, setCopied] = useState(false)

  const copyTracking = () => {
    if (!trackingNumber) return
    navigator.clipboard.writeText(trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2">
      {trackingNumber && (
        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-lux-ivory border border-lux-gold/20">
          <Truck size={13} strokeWidth={1.5} className="text-lux-gold flex-shrink-0" />
          <span className="text-[0.68rem] text-lux-ink/55 font-light">Tracking:</span>
          <span className="text-[0.72rem] font-mono font-semibold text-lux-ink">{trackingNumber}</span>
          <button
            onClick={copyTracking}
            className="ml-auto text-lux-ink/30 hover:text-lux-gold transition-colors duration-150"
            aria-label="Copy tracking number"
          >
            {copied ? <Check size={13} strokeWidth={2} className="text-emerald-500" /> : <Copy size={13} strokeWidth={1.5} />}
          </button>
        </div>
      )}

      <div className="space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <div key={step.label} className="flex gap-4">
              {/* Spine */}
              <div className="flex flex-col items-center flex-shrink-0 w-6">
                {/* Node */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all duration-200 ${
                  step.completed
                    ? 'bg-lux-gold border-lux-gold'
                    : step.current
                      ? 'bg-white border-lux-gold'
                      : 'bg-white border-lux-ink/15'
                }`}>
                  {step.completed ? (
                    <Check size={11} strokeWidth={2.5} className="text-white" />
                  ) : step.current ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-lux-gold animate-pulse" />
                  ) : (
                    <Circle size={8} strokeWidth={1.5} className="text-lux-ink/20" />
                  )}
                </div>
                {/* Line */}
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[2rem] my-1 rounded-full ${
                    step.completed ? 'bg-lux-gold/50' : 'bg-lux-ink/10'
                  }`} />
                )}
              </div>
              {/* Content */}
              <div className={`pb-5 ${isLast ? 'pb-0' : ''} flex-1 min-w-0 pt-0.5`}>
                <p className={`text-sm font-medium ${
                  step.current    ? 'text-lux-gold'
                  : step.completed ? 'text-lux-ink'
                  : 'text-lux-ink/30'
                }`}>
                  {step.label}
                  {step.current && (
                    <span className="ml-2 text-[0.58rem] tracking-[0.15em] uppercase bg-lux-gold/12 text-lux-gold px-2 py-0.5 font-semibold">
                      Current
                    </span>
                  )}
                </p>
                {step.time && (
                  <p className="text-[0.65rem] text-lux-ink/35 mt-0.5 font-light">{step.time}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Order card ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)
  const { badge, Icon } = STATUS_CONFIG[order.status]

  return (
    <article className="bg-white border border-lux-ink/8 overflow-hidden">

      {/* Card header */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-lux-ink/6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-lux-ink tracking-wide">
              #{order.id}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.62rem] font-semibold tracking-wide rounded-full ${badge}`}>
              <Icon size={10} strokeWidth={2} />
              {order.status}
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-[0.68rem] text-lux-ink/40 font-light">
            <Calendar size={11} strokeWidth={1.5} />
            Ordered on {order.date}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[0.62rem] text-lux-ink/35 font-light mb-0.5 tracking-wide">Order Total</p>
          <p className="font-serif text-xl font-semibold text-lux-gold tabular-nums">{inr(order.total)}</p>
        </div>
      </div>

      {/* Products */}
      <div className="px-6 py-5 space-y-4">
        {order.items.map((item) => (
          <div key={`${item.name}-${item.size}`} className="flex gap-4 items-center">
            <div className={`w-14 h-14 flex-shrink-0 ${item.bg} relative overflow-hidden rounded-lg`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.18]" aria-hidden="true">
                <Gem size={24} strokeWidth={0.8} className="text-lux-gold" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[0.9rem] font-medium text-lux-ink leading-snug truncate">
                {item.name}
              </p>
              <p className="text-[0.65rem] text-lux-ink/40 mt-0.5 font-light">
                Size: {item.size} · Qty: {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-lux-ink tabular-nums whitespace-nowrap flex-shrink-0">
              {inr(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 bg-lux-ivory/60 border-t border-lux-ink/6 flex-wrap">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-[0.7rem] tracking-[0.12em] uppercase font-medium text-lux-gold hover:text-lux-gold-hover transition-colors duration-150"
        >
          {expanded ? <ChevronUp size={13} strokeWidth={1.5} /> : <ChevronDown size={13} strokeWidth={1.5} />}
          {expanded ? 'Hide Details' : 'View Details'}
        </button>
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1.5 px-4 py-2 border border-lux-ink/15 text-[0.68rem] tracking-[0.12em] uppercase font-medium text-lux-ink/60 hover:border-lux-gold hover:text-lux-gold transition-all duration-150"
        >
          <Truck size={12} strokeWidth={1.5} />
          Track Order
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-lux-ink/6 px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left: order info */}
          <div className="space-y-5">
            {/* Delivery address */}
            <div>
              <p className="text-[0.62rem] tracking-[0.25em] uppercase text-lux-ink/35 font-semibold mb-2">
                Delivery Address
              </p>
              <div className="flex gap-2.5">
                <MapPin size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
                <p className="text-sm text-lux-ink/70 font-light leading-relaxed">
                  {order.address},<br />
                  {order.city}, {order.state} – {order.pincode}
                </p>
              </div>
            </div>

            {/* Delivery method */}
            <div>
              <p className="text-[0.62rem] tracking-[0.25em] uppercase text-lux-ink/35 font-semibold mb-2">
                Delivery Method
              </p>
              <div className="flex gap-2.5 items-center">
                <Truck size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0" />
                <p className="text-sm text-lux-ink/70 font-light">{order.deliveryMethod}</p>
              </div>
            </div>

            {/* Payment */}
            <div>
              <p className="text-[0.62rem] tracking-[0.25em] uppercase text-lux-ink/35 font-semibold mb-2">
                Payment Method
              </p>
              <div className="flex gap-2.5 items-center">
                <CreditCard size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0" />
                <p className="text-sm text-lux-ink/70 font-light">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Estimated date */}
            <div>
              <p className="text-[0.62rem] tracking-[0.25em] uppercase text-lux-ink/35 font-semibold mb-2">
                {order.status === 'Delivered' ? 'Delivered On' : 'Estimated Delivery'}
              </p>
              <div className="flex gap-2.5 items-center">
                <Calendar size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0" />
                <p className="text-sm text-lux-ink/70 font-light">{order.estimatedDate}</p>
              </div>
            </div>
          </div>

          {/* Right: tracking */}
          <div>
            <p className="text-[0.62rem] tracking-[0.25em] uppercase text-lux-ink/35 font-semibold mb-4">
              Order Timeline
            </p>
            <TrackingTimeline steps={order.tracking} trackingNumber={order.trackingNumber} />
          </div>
        </div>
      )}
    </article>
  )
}

// ─── Stats card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, Icon, accent,
}: {
  label: string
  value: string
  sub:   string
  Icon:  React.FC<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>
  accent: string
}) {
  return (
    <div className="bg-white border border-lux-ink/8 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${accent}`}>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[0.62rem] tracking-[0.2em] uppercase text-lux-ink/40 font-medium mb-1">{label}</p>
        <p className="font-serif text-xl font-semibold text-lux-ink leading-none">{value}</p>
        <p className="text-[0.68rem] text-lux-ink/35 mt-1 font-light">{sub}</p>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

function mapDbOrder(row: Record<string, unknown>): Order {
  const items = Array.isArray(row.items) ? row.items as OrderItem[] : []
  const status = (row.status as OrderStatus) ?? 'Processing'

  const statusSteps: Record<OrderStatus, number> = { Processing: 2, Shipped: 3, Delivered: 5, Cancelled: 0 }
  const doneUntil = statusSteps[status] ?? 2
  const stepLabels = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']

  const tracking: TrackingStep[] = stepLabels.map((label, i) => ({
    label,
    time:      i < doneUntil ? (row.created_at ? new Date(row.created_at as string).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null) : null,
    completed: i < doneUntil,
    current:   i === doneUntil,
  }))

  return {
    id:             (row.order_number as string) ?? String(row.id),
    date:           row.created_at ? new Date(row.created_at as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    status,
    total:          Number(row.total ?? 0),
    address:        String(row.address ?? ''),
    city:           String(row.city ?? ''),
    state:          String(row.state ?? ''),
    pincode:        String(row.pincode ?? ''),
    deliveryMethod: String(row.delivery_method ?? 'Standard Delivery'),
    paymentMethod:  String(row.payment_method ?? ''),
    estimatedDate:  String(row.estimated_date ?? ''),
    trackingNumber: null,
    items,
    tracking,
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [mounted,   setMounted]   = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [orders,    setOrders]    = useState<Order[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    let cancelled = false

    ;(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (cancelled) return
        if (!data.session) {
          router.replace('/auth/login')
          return
        }
        const email = data.session.user.email ?? ''
        setUserEmail(email)
        const uid = data.session.user.id

        const ORDERS_MS = 15_000
        const query = supabase
          .from('orders')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })

        const timedOut = new Promise<{ data: null }>((resolve) => {
          setTimeout(() => resolve({ data: null }), ORDERS_MS)
        })

        const { data: rows } = await Promise.race([query, timedOut])
        if (!cancelled && rows) setOrders(rows.map(mapDbOrder))
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [mounted, router])

  // Only block on hydration — never on async data fetches
  if (!mounted) return null

  const totalSpent   = orders.reduce((s, o) => s + o.total, 0)
  const showEmpty    = orders.length === 0

  const favouriteCat = (() => {
    const counts: Record<string, number> = {}
    orders.forEach((o) => o.items.forEach((i) => {
      counts[i.name] = (counts[i.name] ?? 0) + 1
    }))
    return Object.keys(counts).length > 0 ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] : '—'
  })()

  return (
    <div className="bg-lux-ivory">

      {/* Page header */}
      <div className="bg-lux-ivory border-b border-lux-gold/12 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-lux-ink/40 mb-4 flex-wrap">
            <Link href="/" className="hover:text-lux-gold transition-colors duration-150">Home</Link>
            <ChevronRight size={11} strokeWidth={1.5} />
            <span className="text-lux-gold">My Orders</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-lux-ink mb-1">
            My Orders
          </h1>
          <p className="text-sm text-lux-ink/40 font-light">
            {userEmail}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {loading ? (
          /* ── Inline loading skeleton ── */
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-9 h-9 border-[3px] border-lux-gold/25 border-t-lux-gold rounded-full animate-spin" />
          </div>
        ) : showEmpty ? (
          /* ── Empty state ── */
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-lux-gold/10 flex items-center justify-center">
                <ShoppingBag size={34} strokeWidth={1} className="text-lux-gold/50" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-lux-ink mb-2">No orders yet</h2>
              <div className="flex items-center justify-center gap-3 my-4" aria-hidden="true">
                <span className="h-px w-8 bg-lux-gold/40" />
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" />
                </svg>
                <span className="h-px w-8 bg-lux-gold/40" />
              </div>
              <p className="text-sm text-lux-ink/45 font-light leading-relaxed mb-8">
                You haven&apos;t placed any orders yet.<br />
                Start exploring our handcrafted collection.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-lux-gold text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-lux-gold-hover transition-colors duration-200"
              >
                Start Shopping
                <ChevronRight size={13} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ── Stats row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Orders"
                value={String(orders.length)}
                sub={`${orders.filter((o) => o.status === 'Delivered').length} delivered`}
                Icon={Package as never}
                accent="bg-lux-gold/12 text-lux-gold"
              />
              <StatCard
                label="Amount Spent"
                value={inr(totalSpent)}
                sub="Across all orders"
                Icon={TrendingUp as never}
                accent="bg-emerald-50 text-emerald-600"
              />
              <StatCard
                label="Favourite Category"
                value={favouriteCat}
                sub="Most ordered"
                Icon={Star as never}
                accent="bg-blue-50 text-blue-500"
              />
            </div>

            {/* ── Section header ── */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl font-semibold text-lux-ink">
                  Order History
                </h2>
                <span className="text-[0.65rem] font-semibold px-2.5 py-1 bg-lux-gold/12 text-lux-gold rounded-full">
                  {orders.length}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 text-[0.62rem] tracking-wide font-medium border border-lux-ink/12 text-lux-ink/45 cursor-default"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Order cards ── */}
            <div className="space-y-5">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
