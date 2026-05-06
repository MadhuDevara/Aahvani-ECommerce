'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { inr } from '@/lib/products'
import { loginPath } from '@/lib/login-path'
import { supabase } from '@/lib/supabase'
import StepIndicator from '@/components/checkout/StepIndicator'
import OrderSummary from '@/components/checkout/OrderSummary'
import StepInfo, { type StepInfoData } from '@/components/checkout/StepInfo'
import StepShipping, { shippingFeeForMethod, type ShippingMethod } from '@/components/checkout/StepShipping'
import StepPayment, {
  type PaymentMode,
  type StepPaymentFields,
} from '@/components/checkout/StepPayment'

const DELIVERY_LABEL: Record<ShippingMethod, string> = {
  standard: 'Standard delivery',
  express: 'Express delivery',
}

function validateInfo(d: StepInfoData): Partial<Record<keyof StepInfoData, string>> {
  const e: Partial<Record<keyof StepInfoData, string>> = {}
  if (!d.email.trim()) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Enter a valid email'
  if (!d.firstName.trim()) e.firstName = 'Required'
  if (!d.lastName.trim()) e.lastName = 'Required'
  if (!d.address1.trim()) e.address1 = 'Address is required'
  if (!d.city.trim()) e.city = 'City is required'
  if (!d.state.trim()) e.state = 'State is required'
  if (!d.postcode.trim()) e.postcode = 'Postcode is required'
  else if (!/^\d{6}$/.test(d.postcode.trim())) e.postcode = 'Enter a valid 6-digit pincode'
  return e
}

function validatePayment(mode: PaymentMode, f: StepPaymentFields): Partial<Record<keyof StepPaymentFields, string>> {
  const e: Partial<Record<keyof StepPaymentFields, string>> = {}
  if (mode === 'card') {
    const digits = f.cardNumber.replace(/\s/g, '')
    if (digits.length < 12) e.cardNumber = 'Enter a valid card number'
    if (!/^\d{2}\/\d{2}$/.test(f.expiry.trim())) e.expiry = 'Use MM/YY'
    if (f.cvv.trim().length < 3) e.cvv = 'Enter CVV'
  } else {
    if (!f.upiId.trim()) e.upiId = 'UPI ID is required'
    else if (!f.upiId.includes('@')) e.upiId = 'Enter a valid UPI ID'
  }
  return e
}

export default function CheckoutShell() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const cartUserId = useCartStore((s) => s.userId)
  const cartReady = useCartStore((s) => s.ready)
  const cartLoading = useCartStore((s) => s.loading)

  const [mounted, setMounted] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState<ShippingMethod>('standard')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('card')
  const [payFields, setPayFields] = useState<StepPaymentFields>({
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
  })
  const [payErrors, setPayErrors] = useState<Partial<Record<keyof StepPaymentFields, string>>>({})

  const [info, setInfo] = useState<StepInfoData>({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
  })
  const [infoErrors, setInfoErrors] = useState<Partial<Record<keyof StepInfoData, string>>>({})

  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace(loginPath('/checkout'))
        return
      }
      const em = data.session.user.email ?? ''
      setInfo((i) => ({ ...i, email: i.email || em }))
      setAuthReady(true)
    })
  }, [router])

  useEffect(() => {
    if (!mounted || !authReady) return
    if (!cartReady || cartLoading) return
    if (!cartUserId) return
    if (items.length === 0 && !placed) router.replace('/cart')
  }, [mounted, authReady, cartReady, cartLoading, cartUserId, items.length, placed, router])

  const subtotal = getTotal()
  const shippingFee = shippingFeeForMethod(shipping)

  const applyPromo = useCallback(() => {
    const raw = promoCode.trim().toUpperCase()
    setPromoError('')
    if (!raw) {
      setPromoError('Enter a code')
      return
    }
    if (raw === 'AAHVANI10') {
      const d = Math.round(subtotal * 0.1)
      setDiscount(d)
      setPromoApplied(true)
      return
    }
    setPromoError('Invalid promo code')
    setPromoApplied(false)
    setDiscount(0)
  }, [promoCode, subtotal])

  const patchInfo = useCallback(<K extends keyof StepInfoData>(field: K, value: StepInfoData[K]) => {
    setInfo((prev) => ({ ...prev, [field]: value }))
    setInfoErrors((er) => ({ ...er, [field]: undefined }))
  }, [])

  const patchPay = useCallback(<K extends keyof StepPaymentFields>(field: K, value: StepPaymentFields[K]) => {
    setPayFields((prev) => ({ ...prev, [field]: value }))
    setPayErrors((er) => ({ ...er, [field]: undefined }))
  }, [])

  const goNext = () => {
    if (step === 0) {
      const e = validateInfo(info)
      setInfoErrors(e)
      if (Object.keys(e).length > 0) return
      setStep(1)
      return
    }
    if (step === 1) {
      setStep(2)
      return
    }
  }

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const placeOrder = async () => {
    const e = validatePayment(paymentMode, payFields)
    setPayErrors(e)
    if (Object.keys(e).length > 0) return

    setPlacing(true)
    const total = Math.max(0, subtotal + shippingFee - discount)
    const deliveryOption = DELIVERY_LABEL[shipping]
    const estimatedDays = shipping === 'express' ? 3 : 7
    const estimatedDate = new Date(Date.now() + estimatedDays * 86400000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const orderNumber = `AHV-${Date.now().toString().slice(-8)}`

    const { data: sessionData } = await supabase.auth.getSession()
    const sessionUser = sessionData.session?.user
    const userId = sessionUser?.id ?? null
    const accountEmail = (sessionUser?.email ?? '').trim() || info.email.trim()

    if (!userId) {
      setPlacing(false)
      return
    }

    const addressLine = `${info.address1}${info.address2.trim() ? ', ' + info.address2.trim() : ''}`

    const { error } = await supabase.from('orders').insert({
      order_number: orderNumber,
      user_id: userId,
      user_email: accountEmail,
      items: items.map((i) => ({
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
        bg: i.bg,
      })),
      total,
      status: 'Processing',
      address: addressLine,
      city: info.city,
      state: info.state,
      pincode: info.postcode,
      delivery_method: deliveryOption,
      payment_method: paymentMode === 'card' ? 'Card' : 'UPI',
      estimated_date: estimatedDate,
    })

    if (error) {
      console.error('[checkout] order failed:', error)
      setPlacing(false)
      return
    }

    await clearCart()
    setPlacing(false)
    setPlaced(true)
  }

  const itemCount = items.reduce((a, i) => a + i.quantity, 0)
  const grandTotal = Math.max(0, subtotal + shippingFee - discount)

  if (!mounted || !authReady) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-lux-ivory">
        <div
          className="h-9 w-9 animate-spin rounded-full border-[3px] border-lux-gold/25 border-t-lux-gold"
          aria-hidden
        />
      </div>
    )
  }

  if (placed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-lux-ivory px-4 py-12 md:min-h-[45vh] md:py-16">
        <div className="w-full max-w-md border border-lux-stone-light bg-lux-elevated p-10 text-center shadow-[var(--lux-shadow-nav)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-lux-gold/30 bg-lux-ivory">
            <Check size={28} strokeWidth={2} className="text-lux-gold" />
          </div>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-lux-ink">Order placed</h2>
          <p className="mb-2 text-sm font-light leading-relaxed text-lux-ink-muted">
            Thank you. A confirmation has been sent to
          </p>
          <p className="mb-6 text-sm font-medium text-lux-gold">{info.email}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-lux-black px-8 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-lux-ivory transition hover:bg-lux-gold hover:text-lux-black"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-lux-ivory">
      <header className="border-b border-lux-black/8 bg-lux-ivory px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-[min(100%,var(--lux-max))] flex-col gap-4">
          <Link href="/" className="font-serif text-xl font-semibold tracking-[0.08em] text-lux-gold">
            Aahvani
          </Link>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-lux-ink-subtle">
            <Link href="/" className="transition hover:text-lux-gold">
              Home
            </Link>
            <span aria-hidden className="text-lux-stone-mid">
              /
            </span>
            <Link href="/cart" className="transition hover:text-lux-gold">
              Cart
            </Link>
            <span aria-hidden className="text-lux-stone-mid">
              /
            </span>
            <span className="text-lux-gold">Checkout</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-lux-ink md:text-4xl">Checkout</h1>
        <p className="mt-1 text-sm font-light text-lux-ink-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} · {inr(grandTotal)} total
        </p>

        <div className="mt-8 lg:grid lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <StepIndicator activeStep={step} />

            <div className="mt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 ? (
                    <section aria-labelledby="step-info-title">
                      <h2 id="step-info-title" className="mb-6 font-serif text-lg font-semibold text-lux-ink">
                        Contact & delivery
                      </h2>
                      <StepInfo data={info} errors={infoErrors} onChange={patchInfo} />
                    </section>
                  ) : null}
                  {step === 1 ? (
                    <section aria-labelledby="step-ship-title">
                      <h2 id="step-ship-title" className="mb-6 font-serif text-lg font-semibold text-lux-ink">
                        Shipping method
                      </h2>
                      <StepShipping method={shipping} onSelect={setShipping} />
                    </section>
                  ) : null}
                  {step === 2 ? (
                    <section aria-labelledby="step-pay-title">
                      <h2 id="step-pay-title" className="mb-6 font-serif text-lg font-semibold text-lux-ink">
                        Payment
                      </h2>
                      <StepPayment
                        mode={paymentMode}
                        onModeChange={setPaymentMode}
                        fields={payFields}
                        onFieldChange={patchPay}
                        errors={payErrors}
                      />
                    </section>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex flex-col gap-4 border-t border-lux-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="text-sm text-lux-ink-muted underline decoration-lux-stone-mid underline-offset-4 transition hover:text-lux-ink"
                    >
                      Back
                    </button>
                  ) : (
                    <Link
                      href="/cart"
                      className="text-sm text-lux-ink-muted underline decoration-lux-stone-mid underline-offset-4 transition hover:text-lux-ink"
                    >
                      Back to cart
                    </Link>
                  )}
                </div>
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="bg-lux-black px-8 py-3.5 text-center text-[0.68rem] font-medium uppercase tracking-[0.2em] text-lux-ivory transition hover:bg-lux-gold hover:text-lux-black"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={placing}
                    onClick={() => void placeOrder()}
                    className="bg-lux-black px-8 py-3.5 text-center text-[0.68rem] font-medium uppercase tracking-[0.2em] text-lux-ivory transition hover:bg-lux-gold hover:text-lux-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {placing ? 'Placing order…' : `Place order · ${inr(grandTotal)}`}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 min-w-0 lg:mt-[7.25rem]">
            <OrderSummary
              shippingFee={shippingFee}
              discount={discount}
              promoCode={promoCode}
              promoError={promoError}
              promoApplied={promoApplied}
              onPromoCodeChange={(v) => {
                setPromoCode(v)
                setPromoError('')
              }}
              onApplyPromo={applyPromo}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
