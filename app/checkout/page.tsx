'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, type ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Truck,
  Zap,
  Lock,
  AlertCircle,
  ShoppingBag,
  Check,
  Gem,
} from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { loginPath } from '@/lib/login-path'
import { supabase } from '@/lib/supabase'

// ─── Data ──────────────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

interface DeliveryOption {
  id:    'standard' | 'express'
  label: string
  sub:   string
  fee:   number
  Icon:  React.FC<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'standard', label: 'Standard Delivery', sub: '5–7 business days', fee: 0,  Icon: Truck as DeliveryOption['Icon'] },
  { id: 'express',  label: 'Express Delivery',  sub: '2–3 business days', fee: 99, Icon: Zap  as DeliveryOption['Icon'] },
]

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  fullName: string
  email:    string
  phone:    string
  addr1:    string
  addr2:    string
  city:     string
  state:    string
  pincode:  string
}

type FormErrors = Partial<Record<keyof FormData, string>>

// ─── Input component ───────────────────────────────────────────────────────────

function Field({
  id, label, error, required, children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.68rem] tracking-[0.18em] uppercase text-[#1A1A1A]/55 font-medium mb-1.5"
      >
        {label}
        {required && <span className="text-[#C6973F] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 text-[0.63rem] text-red-500 font-medium">
          <AlertCircle size={11} strokeWidth={2} />
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (error?: string) =>
  `w-full px-4 py-3 text-sm bg-[#FDF6EC] text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 border focus:outline-none transition-colors duration-200 ${
    error ? 'border-red-400 focus:border-red-400' : 'border-[#1A1A1A]/15 focus:border-[#C6973F]'
  }`

// ─── Section header ────────────────────────────────────────────────────────────

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-7 h-7 rounded-full bg-[#C6973F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {step}
      </span>
      <h2 className="font-serif text-lg font-semibold text-[#1A1A1A]">{title}</h2>
    </div>
  )
}

// ─── Payment icon SVGs ─────────────────────────────────────────────────────────

function UpiIcon() {
  return (
    <svg width="32" height="16" viewBox="0 0 60 24" fill="none">
      <rect width="60" height="24" rx="3" fill="#F5F5F5" stroke="#E0E0E0" />
      <text x="50%" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4CAF50">UPI</text>
    </svg>
  )
}
function VisaIcon() {
  return (
    <svg width="38" height="16" viewBox="0 0 75 24" fill="none">
      <rect width="75" height="24" rx="3" fill="#1A1F71" />
      <text x="50%" y="17" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontStyle="italic">VISA</text>
    </svg>
  )
}
function McIcon() {
  return (
    <svg width="28" height="16" viewBox="0 0 44 24" fill="none">
      <rect width="44" height="24" rx="3" fill="#EB001B" fillOpacity="0.07" />
      <circle cx="14" cy="12" r="9" fill="#EB001B" />
      <circle cx="30" cy="12" r="9" fill="#F79E1B" />
      <path d="M22 6.3a9 9 0 0 1 0 11.4A9 9 0 0 1 22 6.3z" fill="#FF5F00" />
    </svg>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router  = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const cartUserId    = useCartStore((s) => s.userId)
  const cartReady     = useCartStore((s) => s.ready)
  const cartLoading   = useCartStore((s) => s.loading)

  const [mounted,   setMounted]   = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [placing,   setPlacing]   = useState(false)
  const [placed,    setPlaced]    = useState(false)
  const [delivery,  setDelivery]  = useState<'standard' | 'express'>('standard')

  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '',
    addr1: '', addr2: '', city: '', state: '', pincode: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // ── Hydration guard ─────────────────────────────────────────────────────────
  useEffect(() => { setMounted(true) }, [])

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace(loginPath('/checkout'))
        return
      }
      // Pre-fill email from session
      const userEmail = data.session.user.email ?? ''
      setForm((f) => ({ ...f, email: userEmail }))
      setAuthReady(true)
    })
  }, [router])

  // ── Cart guard: wait for server-backed cart, then send empty carts to /cart ─
  useEffect(() => {
    if (!mounted || !authReady) return
    if (!cartReady || cartLoading) return
    if (!cartUserId) return
    if (items.length === 0 && !placed) router.replace('/cart')
  }, [mounted, authReady, cartReady, cartLoading, cartUserId, items.length, placed, router])

  // ── Derived totals ──────────────────────────────────────────────────────────
  const deliveryFee = DELIVERY_OPTIONS.find((o) => o.id === delivery)!.fee
  const subtotal    = getTotal()
  const total       = subtotal + deliveryFee
  const itemCount   = items.reduce((s, i) => s + i.quantity, 0)

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim())    e.email    = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim())    e.phone    = 'Phone number is required'
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number'
    if (!form.addr1.trim())    e.addr1    = 'Address is required'
    if (!form.city.trim())     e.city     = 'City is required'
    if (!form.state)           e.state    = 'Please select a state'
    if (!form.pincode.trim())  e.pincode  = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setPlacing(true)

    const deliveryOption = DELIVERY_OPTIONS.find((o) => o.id === delivery)!
    const estimatedDays  = delivery === 'express' ? 3 : 7
    const estimatedDate  = new Date(Date.now() + estimatedDays * 86400000)
      .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

    const orderNumber = `AHV-${Date.now().toString().slice(-8)}`

    const { data: sessionData } = await supabase.auth.getSession()
    const sessionUser = sessionData.session?.user
    const userId        = sessionUser?.id ?? null
    const accountEmail  = (sessionUser?.email ?? '').trim() || form.email.trim()

    if (!userId) {
      alert('You must be signed in to place an order.')
      setPlacing(false)
      return
    }

    const { error } = await supabase.from('orders').insert({
      order_number:    orderNumber,
      user_id:         userId,
      user_email:      accountEmail,
      items:           items.map((i) => ({
        name:     i.name,
        size:     i.size,
        quantity: i.quantity,
        price:    i.price,
        bg:       i.bg,
      })),
      total:           total,
      status:          'Processing',
      address:         `${form.addr1}${form.addr2 ? ', ' + form.addr2 : ''}`,
      city:            form.city,
      state:           form.state,
      pincode:         form.pincode,
      delivery_method: deliveryOption.label,
      payment_method:  'Online Payment',
      estimated_date:  estimatedDate,
    })

    if (error) {
      console.error('Order save failed:', error.message, error.details, error.hint)
      setPlacing(false)
      // Show error to user instead of silently failing
      alert(`Failed to place order: ${error.message}`)
      return
    }

    await clearCart()
    setPlacing(false)
    setPlaced(true)
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  if (!mounted || !authReady) {
    return (
      <div className="min-h-[70vh] bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    )
  }

  // ── Order placed success screen ─────────────────────────────────────────────
  if (placed) {
    return (
      <div className="min-h-[70vh] bg-[#FDF6EC] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center bg-white p-10 shadow-[0_8px_40px_rgba(198,151,63,0.12)]">
          <div className="w-16 h-16 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
            <Check size={28} strokeWidth={2} className="text-emerald-500" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-2">
            Order Placed!
          </h2>
          <div className="flex items-center justify-center gap-3 my-4" aria-hidden="true">
            <span className="h-px w-8 bg-[#C6973F]/40" />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" />
            </svg>
            <span className="h-px w-8 bg-[#C6973F]/40" />
          </div>
          <p className="text-sm text-[#1A1A1A]/50 font-light leading-relaxed mb-2">
            Thank you for your order. A confirmation has been sent to
          </p>
          <p className="text-sm font-medium text-[#C6973F] mb-6">{form.email}</p>
          <p className="text-xs text-[#1A1A1A]/35 mb-8 font-light">
            Estimated delivery: {delivery === 'express' ? '2–3' : '5–7'} business days
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // ── Main checkout layout ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* Page header */}
      <div className="bg-[#FDF6EC] border-b border-[#C6973F]/12 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/40 mb-3 flex-wrap">
            <Link href="/" className="hover:text-[#C6973F] transition-colors duration-150">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-[#C6973F] transition-colors duration-150">Cart</Link>
            <span>/</span>
            <span className="text-[#C6973F]">Checkout</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
            Checkout
          </h1>
          <p className="text-sm text-[#1A1A1A]/40 font-light mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · {inr(total)} total
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">

            {/* ── LEFT ──────────────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-7">

              {/* Section 1 — Contact */}
              <div className="bg-white p-6 sm:p-8">
                <SectionTitle step={1} title="Contact Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <Field id="fullName" label="Full Name" error={errors.fullName} required>
                    <div className="relative">
                      <User size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 pointer-events-none" />
                      <input
                        id="fullName" name="fullName" type="text"
                        value={form.fullName} onChange={handleChange}
                        autoComplete="name" placeholder="Your full name"
                        className={`${inputCls(errors.fullName)} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field id="email" label="Email Address" error={errors.email} required>
                    <div className="relative">
                      <Mail size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 pointer-events-none" />
                      <input
                        id="email" name="email" type="email"
                        value={form.email} onChange={handleChange}
                        autoComplete="email" placeholder="you@example.com"
                        className={`${inputCls(errors.email)} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field id="phone" label="Phone Number" error={errors.phone} required>
                    <div className="flex">
                      <span className="flex-shrink-0 inline-flex items-center px-3 border border-r-0 border-[#1A1A1A]/15 bg-[#F0EBE0] text-[#1A1A1A]/50 text-sm font-medium select-none gap-1.5">
                        <Phone size={13} strokeWidth={1.5} />
                        +91
                      </span>
                      <input
                        id="phone" name="phone" type="tel"
                        value={form.phone} onChange={handleChange}
                        autoComplete="tel-national" placeholder="9876543210"
                        maxLength={10}
                        className={`${inputCls(errors.phone)} flex-1 min-w-0`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="flex items-center gap-1.5 mt-1.5 text-[0.63rem] text-red-500 font-medium">
                        <AlertCircle size={11} strokeWidth={2} />
                        {errors.phone}
                      </p>
                    )}
                  </Field>

                </div>
              </div>

              {/* Section 2 — Address */}
              <div className="bg-white p-6 sm:p-8">
                <SectionTitle step={2} title="Delivery Address" />
                <div className="space-y-5">

                  <Field id="addr1" label="Address Line 1" error={errors.addr1} required>
                    <div className="relative">
                      <MapPin size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 pointer-events-none" />
                      <input
                        id="addr1" name="addr1" type="text"
                        value={form.addr1} onChange={handleChange}
                        autoComplete="address-line1"
                        placeholder="House no., Building, Street"
                        className={`${inputCls(errors.addr1)} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field id="addr2" label="Address Line 2" required={false}>
                    <input
                      id="addr2" name="addr2" type="text"
                      value={form.addr2} onChange={handleChange}
                      autoComplete="address-line2"
                      placeholder="Apartment, Area, Landmark (optional)"
                      className={inputCls()}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field id="city" label="City" error={errors.city} required>
                      <input
                        id="city" name="city" type="text"
                        value={form.city} onChange={handleChange}
                        autoComplete="address-level2" placeholder="Mumbai"
                        className={inputCls(errors.city)}
                      />
                    </Field>

                    <Field id="pincode" label="Pincode" error={errors.pincode} required>
                      <input
                        id="pincode" name="pincode" type="text"
                        value={form.pincode} onChange={handleChange}
                        autoComplete="postal-code" placeholder="400001"
                        maxLength={6}
                        className={inputCls(errors.pincode)}
                      />
                    </Field>
                  </div>

                  <Field id="state" label="State" error={errors.state} required>
                    <div className="relative">
                      <select
                        id="state" name="state"
                        value={form.state} onChange={handleChange}
                        aria-label="State" title="State"
                        className={`${inputCls(errors.state)} appearance-none pr-10`}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.5} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/35 pointer-events-none" />
                    </div>
                  </Field>

                </div>
              </div>

              {/* Section 3 — Delivery method */}
              <div className="bg-white p-6 sm:p-8">
                <SectionTitle step={3} title="Delivery Method" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DELIVERY_OPTIONS.map(({ id, label, sub, fee, Icon }) => {
                    const active = delivery === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDelivery(id)}
                        className={`flex items-start gap-4 p-4 border-2 transition-all duration-200 text-left ${
                          active
                            ? 'border-[#C6973F] bg-[#C6973F]/6'
                            : 'border-[#1A1A1A]/12 hover:border-[#C6973F]/50 bg-white'
                        }`}
                      >
                        <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                          active ? 'bg-[#C6973F] text-white' : 'bg-[#FDF6EC] text-[#1A1A1A]/40'
                        }`}>
                          <Icon size={17} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <p className={`text-sm font-semibold ${active ? 'text-[#C6973F]' : 'text-[#1A1A1A]'}`}>
                              {label}
                            </p>
                            <p className={`text-sm font-bold tabular-nums flex-shrink-0 ${active ? 'text-[#C6973F]' : 'text-[#1A1A1A]'}`}>
                              {fee === 0 ? 'FREE' : inr(fee)}
                            </p>
                          </div>
                          <p className="text-xs text-[#1A1A1A]/45 mt-0.5 font-light">{sub}</p>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-[#C6973F] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={11} strokeWidth={2.5} className="text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT — Order summary ──────────────────────────────────────── */}
            <div className="w-full lg:w-80 xl:w-[22rem] flex-shrink-0 lg:sticky lg:top-24 space-y-4">
              <div className="bg-white p-6">

                {/* Summary title */}
                <h2 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-5">
                  Order Summary
                </h2>

                {/* Items list */}
                <ul className="divide-y divide-[#1A1A1A]/6 mb-5">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.size}`} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                      <div className={`w-12 h-12 flex-shrink-0 ${item.bg} relative overflow-hidden rounded`}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-15" aria-hidden="true">
                          <Gem size={20} strokeWidth={0.8} className="text-[#C6973F]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-[0.82rem] font-medium text-[#1A1A1A] leading-snug truncate">
                          {item.name}
                        </p>
                        <p className="text-[0.62rem] text-[#1A1A1A]/40 mt-0.5">
                          {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap self-center">
                        {inr(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="space-y-2.5 text-sm mb-5 pt-4 border-t border-[#1A1A1A]/8">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/55 font-light">Subtotal</span>
                    <span className="font-medium text-[#1A1A1A] tabular-nums">{inr(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/55 font-light">Delivery</span>
                    {deliveryFee === 0
                      ? <span className="text-emerald-600 font-medium text-xs">FREE</span>
                      : <span className="font-medium text-[#1A1A1A] tabular-nums">{inr(deliveryFee)}</span>
                    }
                  </div>
                </div>

                {/* Ornament divider */}
                <div className="flex items-center gap-2 mb-4" aria-hidden="true">
                  <span className="h-px flex-1 bg-[#C6973F]/20" />
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <path d="M3.5 0L4.2 2.8L7 3.5L4.2 4.2L3.5 7L2.8 4.2L0 3.5L2.8 2.8Z" fill="#C6973F" fillOpacity="0.5" />
                  </svg>
                  <span className="h-px flex-1 bg-[#C6973F]/20" />
                </div>

                {/* Grand total */}
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-[0.68rem] tracking-[0.2em] uppercase text-[#1A1A1A] font-medium">
                    Total
                  </span>
                  <span className="font-serif text-2xl font-semibold text-[#C6973F] tabular-nums">
                    {inr(total)}
                  </span>
                </div>

                {/* Pay Now */}
                <button
                  type="submit"
                  disabled={placing}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#C6973F] text-white text-[0.72rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 mb-4"
                >
                  {placing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock size={14} strokeWidth={1.5} />
                      Pay Now · {inr(total)}
                    </>
                  )}
                </button>

                {/* Secure badge */}
                <div className="flex items-center justify-center gap-1.5 text-[0.65rem] text-[#1A1A1A]/35 font-light mb-5">
                  <Lock size={11} strokeWidth={1.5} className="text-emerald-500" />
                  100% Secure Checkout
                </div>

                {/* Payment methods */}
                <div className="border-t border-[#1A1A1A]/6 pt-4">
                  <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A1A1A]/30 mb-2.5 font-medium text-center">
                    Accepted Payments
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <UpiIcon />
                    <VisaIcon />
                    <McIcon />
                  </div>
                </div>
              </div>

              {/* Back to cart */}
              <Link
                href="/cart"
                className="flex items-center justify-center gap-1.5 w-full py-3 border border-[#1A1A1A]/15 text-xs text-[#1A1A1A]/45 hover:border-[#C6973F] hover:text-[#C6973F] transition-all duration-200 bg-white"
              >
                <ShoppingBag size={13} strokeWidth={1.5} />
                Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
