'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, Check } from 'lucide-react'

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-[#C6973F]/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" /></svg>
      <span className="h-px w-8 bg-[#C6973F]/40" />
    </div>
  )
}

const DUMMY_ORDERS: Record<string, {
  id: string; product: string; status: string; customer: string;
  eta: string; trackingNo: string;
  steps: { label: string; time: string | null; done: boolean; current: boolean }[]
}> = {
  'AHV-2024-001': {
    id: 'AHV-2024-001', product: 'Temple Necklace Set', status: 'Delivered',
    customer: 'Priya Sharma', eta: '3 May 2026', trackingNo: 'AHV1234567890IN',
    steps: [
      { label: 'Order Placed',      time: '28 Apr, 10:32 AM', done: true,  current: false },
      { label: 'Payment Confirmed', time: '28 Apr, 10:35 AM', done: true,  current: false },
      { label: 'Processing',        time: '28 Apr, 02:00 PM', done: true,  current: false },
      { label: 'Shipped',           time: '29 Apr, 09:15 AM', done: true,  current: false },
      { label: 'Out for Delivery',  time: '3 May, 08:00 AM',  done: true,  current: false },
      { label: 'Delivered',         time: '3 May, 01:42 PM',  done: true,  current: false },
    ],
  },
  'AHV-2024-002': {
    id: 'AHV-2024-002', product: 'Kundan Polki Ring', status: 'Shipped',
    customer: 'Riya Kapoor', eta: '4 May 2026', trackingNo: 'AHV9876543210IN',
    steps: [
      { label: 'Order Placed',      time: '1 May, 03:15 PM', done: true,  current: false },
      { label: 'Payment Confirmed', time: '1 May, 03:17 PM', done: true,  current: false },
      { label: 'Processing',        time: '1 May, 06:00 PM', done: true,  current: false },
      { label: 'Shipped',           time: '2 May, 10:30 AM', done: true,  current: true  },
      { label: 'Out for Delivery',  time: null,              done: false, current: false },
      { label: 'Delivered',         time: null,              done: false, current: false },
    ],
  },
  'AHV-2024-003': {
    id: 'AHV-2024-003', product: 'Meenakari Jhumka', status: 'Processing',
    customer: 'Sneha Reddy', eta: '8 May 2026', trackingNo: '',
    steps: [
      { label: 'Order Placed',      time: '2 May, 11:00 AM', done: true,  current: false },
      { label: 'Payment Confirmed', time: '2 May, 11:02 AM', done: true,  current: false },
      { label: 'Processing',        time: null,              done: false, current: true  },
      { label: 'Shipped',           time: null,              done: false, current: false },
      { label: 'Out for Delivery',  time: null,              done: false, current: false },
      { label: 'Delivered',         time: null,              done: false, current: false },
    ],
  },
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
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email,   setEmail]   = useState('')
  const [result,  setResult]  = useState<typeof DUMMY_ORDERS[string] | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [copied,   setCopied]   = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim() || !email.trim()) return
    setLoading(true)
    setNotFound(false)
    setResult(null)
    setTimeout(() => {
      setLoading(false)
      const key = orderId.trim().toUpperCase()
      const match = DUMMY_ORDERS[key]
      if (match) { setResult(match) }
      else        { setNotFound(true) }
    }, 1000)
  }

  const copyTracking = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* Hero */}
      <section className="py-16 md:py-20 text-center px-4 border-b border-[#C6973F]/10">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-3">Where is my order?</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-3">Track Your Order</h1>
        <GoldDivider />
        <p className="mt-4 text-sm text-[#1A1A1A]/45 font-light max-w-sm mx-auto leading-relaxed">
          Enter your Order ID and email address to get a live status update.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-10">

        {/* Search form */}
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
                placeholder="e.g. AHV-2024-001"
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
            Try: <span className="font-mono text-[#C6973F]">AHV-2024-001</span> or <span className="font-mono text-[#C6973F]">AHV-2024-002</span> with any email
          </p>
        </form>

        {/* Not found */}
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

        {/* Result */}
        {result && (
          <div className="space-y-6 animate-in">

            {/* Order summary bar */}
            <div className="bg-white border border-[#1A1A1A]/8 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[#1A1A1A]/35 font-semibold mb-1">Order</p>
                  <p className="font-mono text-sm font-bold text-[#1A1A1A]">#{result.id}</p>
                  <p className="text-xs text-[#1A1A1A]/50 font-light mt-0.5">{result.product}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.62rem] font-semibold tracking-wide rounded-full ${STATUS_COLOR[result.status]}`}>
                    {result.status in STATUS_ICON &&
                      (() => { const Ic = STATUS_ICON[result.status]; return <Ic size={11} strokeWidth={2} /> })()
                    }
                    {result.status}
                  </span>
                  <div className="flex items-center justify-end gap-1.5 mt-2 text-[0.62rem] text-[#1A1A1A]/35">
                    <MapPin size={10} strokeWidth={1.5} />
                    Est. {result.eta}
                  </div>
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

            {/* Timeline */}
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
