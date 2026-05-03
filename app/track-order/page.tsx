'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-[#C6973F]/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" /></svg>
      <span className="h-px w-8 bg-[#C6973F]/40" />
    </div>
  )
}

type Step = { label: string; time: string | null; done: boolean; current: boolean }

interface TrackResult {
  id: string
  product: string
  status: string
  customer: string
  eta: string
  trackingNo: string
  steps: Step[]
}

const STATUS_ICON: Record<string, typeof Package> = {
  Delivered:  CheckCircle,
  Shipped:    Truck,
  Processing: Clock,
}

const STATUS_COLOR: Record<string, string> = {
  Delivered:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-[#C6973F]/10 text-[#C6973F] border border-[#C6973F]/25',
  Cancelled:  'bg-red-50 text-red-600 border border-red-200',
}

const LABELS = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'] as const

function buildSteps(status: string): Step[] {
  const norm = (status || 'Processing').toLowerCase()

  if (norm === 'delivered') {
    return LABELS.map((label) => ({ label, time: null, done: true, current: false }))
  }
  if (norm === 'cancelled') {
    return LABELS.map((label, i) => ({ label, time: null, done: false, current: i === 0 }))
  }

  let progress = 2
  if (norm === 'shipped') progress = 3
  else if (norm === 'processing') progress = 2

  return LABELS.map((label, i) => ({
    label,
    time: null,
    done: i < progress,
    current: i === progress,
  }))
}

function mapRowToTrackResult(row: Record<string, unknown>): TrackResult {
  const items = Array.isArray(row.items) ? (row.items as { name?: string }[]) : []
  const productSummary =
    items.length === 0 ? 'Order items'
    : items.length === 1 ? String(items[0]?.name ?? 'Order items')
    : `${items.length} items`

  const status = String(row.status ?? 'Processing')
  const orderNum = String(row.order_number ?? row.id ?? '')

  return {
    id:            orderNum,
    product:       productSummary,
    status,
    customer:      String(row.customer_name ?? ''),
    eta:           String(row.estimated_date ?? ''),
    trackingNo:    String(row.tracking_no ?? ''),
    steps:         buildSteps(status),
  }
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email,   setEmail]   = useState('')
  const [result,  setResult]  = useState<TrackResult | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [copied,   setCopied]   = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim() || !email.trim()) return
    setLoading(true)
    setNotFound(false)
    setResult(null)

    const oid   = orderId.trim()
    const em    = email.trim().toLowerCase()

    try {
      let row: Record<string, unknown> | null = null

      const byNumber = await supabase.from('orders').select('*').eq('order_number', oid).maybeSingle()
      if (!byNumber.error && byNumber.data) row = byNumber.data as Record<string, unknown>

      if (!row) {
        const byId = await supabase.from('orders').select('*').eq('id', oid).maybeSingle()
        if (!byId.error && byId.data) row = byId.data as Record<string, unknown>
      }

      if (!row) {
        setNotFound(true)
        return
      }

      const rowEmail = String(row.user_email ?? row.customer_email ?? '').toLowerCase()
      if (rowEmail !== em) {
        setNotFound(true)
        return
      }

      setResult(mapRowToTrackResult(row))
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const copyTracking = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      <section className="py-16 md:py-20 text-center px-4 border-b border-[#C6973F]/10">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-3">Where is my order?</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-3">Track Your Order</h1>
        <GoldDivider />
        <p className="mt-4 text-sm text-[#1A1A1A]/45 font-light max-w-sm mx-auto leading-relaxed">
          Enter your Order ID and email address to get a live status update.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-10">

        <form onSubmit={handleTrack} className="bg-white border border-[#1A1A1A]/8 p-6 md:p-8 space-y-4">
          <div>
            <label className="text-[0.63rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
              Order ID <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Package size={14} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/25" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Order number from confirmation email"
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-[0.63rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used to place the order"
              className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderId.trim() || !email.trim()}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Tracking…</>
            ) : (
              <><Search size={14} strokeWidth={1.5} />Track Order</>
            )}
          </button>
          <p className="text-[0.62rem] text-[#1A1A1A]/30 text-center font-light">
            Use the same email you entered at checkout. Your order number is in your confirmation email.
          </p>
        </form>

        {notFound && (
          <div className="flex gap-3 p-5 bg-red-50 border border-red-100">
            <AlertCircle size={16} strokeWidth={1.5} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Order not found</p>
              <p className="text-xs text-red-600/70 font-light mt-0.5">
                Please check your Order ID and email. Your Order ID is in your confirmation email.
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in">

            <div className="bg-white border border-[#1A1A1A]/8 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[#1A1A1A]/35 font-semibold mb-1">Order</p>
                  <p className="font-mono text-sm font-bold text-[#1A1A1A]">#{result.id}</p>
                  <p className="text-xs text-[#1A1A1A]/50 font-light mt-0.5">{result.product}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.62rem] font-semibold tracking-wide rounded-full ${STATUS_COLOR[result.status] ?? STATUS_COLOR.Processing}`}>
                    {result.status in STATUS_ICON &&
                      (() => { const Ic = STATUS_ICON[result.status]; return <Ic size={11} strokeWidth={2} /> })()
                    }
                    {result.status}
                  </span>
                  {result.eta && (
                    <div className="flex items-center justify-end gap-1.5 mt-2 text-[0.62rem] text-[#1A1A1A]/35">
                      <MapPin size={10} strokeWidth={1.5} />
                      Est. {result.eta}
                    </div>
                  )}
                </div>
              </div>

              {result.trackingNo && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1A1A1A]/6">
                  <Truck size={12} strokeWidth={1.5} className="text-[#C6973F]" />
                  <span className="text-[0.65rem] text-[#1A1A1A]/40 font-light">Tracking No:</span>
                  <span className="font-mono text-xs font-semibold text-[#1A1A1A]">{result.trackingNo}</span>
                  <button
                    onClick={() => copyTracking(result.trackingNo)}
                    className="ml-auto text-[#1A1A1A]/25 hover:text-[#C6973F] transition-colors"
                    aria-label="Copy tracking number"
                  >
                    {copied
                      ? <Check size={12} strokeWidth={2} className="text-emerald-500" />
                      : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    }
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white border border-[#1A1A1A]/8 p-6">
              <p className="text-[0.62rem] tracking-[0.25em] uppercase text-[#1A1A1A]/35 font-semibold mb-6">Order Timeline</p>
              <div className="space-y-0">
                {result.steps.map((step, i) => {
                  const isLast = i === result.steps.length - 1
                  return (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center flex-shrink-0 w-6">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                          step.done
                            ? 'bg-[#C6973F] border-[#C6973F]'
                            : step.current
                              ? 'bg-white border-[#C6973F]'
                              : 'bg-white border-[#1A1A1A]/15'
                        }`}>
                          {step.done    ? <Check size={11} strokeWidth={2.5} className="text-white" />
                          : step.current ? <span className="w-2.5 h-2.5 rounded-full bg-[#C6973F] animate-pulse" />
                          : <span className="w-2 h-2 rounded-full bg-[#1A1A1A]/15" />}
                        </div>
                        {!isLast && <div className={`w-0.5 flex-1 min-h-[2rem] my-1 rounded-full ${step.done ? 'bg-[#C6973F]/40' : 'bg-[#1A1A1A]/8'}`} />}
                      </div>
                      <div className={`${isLast ? 'pb-0' : 'pb-5'} flex-1 pt-0.5`}>
                        <p className={`text-sm font-medium ${step.current ? 'text-[#C6973F]' : step.done ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/25'}`}>
                          {step.label}
                          {step.current && (
                            <span className="ml-2 text-[0.55rem] tracking-[0.15em] uppercase bg-[#C6973F]/12 text-[#C6973F] px-2 py-0.5 font-semibold">Current</span>
                          )}
                        </p>
                        {step.time && <p className="text-[0.62rem] text-[#1A1A1A]/30 mt-0.5 font-light">{step.time}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
