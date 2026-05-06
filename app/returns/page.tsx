import type { Metadata } from 'next'
import { RotateCcw, CheckCircle, Clock, AlertCircle, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Returns & Refunds — Aahvani Jewels',
  description: '7-day hassle-free return policy. Full refund within 7–10 business days.',
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-lux-gold/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" /></svg>
      <span className="h-px w-8 bg-lux-gold/40" />
    </div>
  )
}

const RETURN_STEPS = [
  {
    step: '01',
    title: 'Initiate Return',
    desc:  'Email us at hello@aahvani.com with your Order ID and reason for return within 7 days of delivery.',
  },
  {
    step: '02',
    title: 'Get Approval',
    desc:  'Our team reviews your request within 24 hours and sends you a return authorisation number.',
  },
  {
    step: '03',
    title: 'Pack & Ship',
    desc:  'Pack the item in its original box with all accessories. We\'ll arrange a free pickup from your address.',
  },
  {
    step: '04',
    title: 'Quality Check',
    desc:  'Once we receive the item, our team inspects it within 2 business days.',
  },
  {
    step: '05',
    title: 'Refund Processed',
    desc:  'Your refund is credited to the original payment method within 5–7 business days after approval.',
  },
]

const ELIGIBLE = [
  'Item received in damaged or defective condition',
  'Wrong item delivered',
  'Item does not match the description on the website',
  'Manufacturing defect discovered within 7 days',
]

const NOT_ELIGIBLE = [
  'Items returned after 7 days of delivery',
  'Custom or personalised jewellery',
  'Items showing signs of wear, alteration or damage by the customer',
  'Items without original packaging or accessories',
  'Earrings (for hygiene reasons — unless defective)',
]

export default function ReturnsPage() {
  return (
    <div className="bg-lux-ivory">

      {/* Hero */}
      <section className="border-b border-lux-gold/10 px-4 py-10 text-center md:py-12">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-lux-gold font-medium mb-3">Hassle-free</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-lux-ink mb-3">Returns & Refunds</h1>
        <GoldDivider />
        <p className="mt-4 text-sm text-lux-ink/45 font-light max-w-md mx-auto leading-relaxed">
          Not happy with your order? We offer a 7-day return policy — no questions asked for eligible items.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Policy highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { Icon: RotateCcw, title: '7-Day Returns',     sub: 'From date of delivery',     bg: 'bg-lux-gold/10 text-lux-gold' },
            { Icon: Clock,     title: '5–7 Day Refund',    sub: 'To original payment method', bg: 'bg-blue-50 text-blue-600'       },
            { Icon: CheckCircle,title: 'Free Pickup',       sub: 'We collect from your door',  bg: 'bg-emerald-50 text-emerald-600'  },
          ].map(({ Icon, title, sub, bg }) => (
            <div key={title} className="bg-white border border-lux-ink/8 p-5 text-center">
              <div className={`w-12 h-12 ${bg} mx-auto mb-4 flex items-center justify-center`}>
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <p className="font-serif text-lg font-semibold text-lux-ink">{title}</p>
              <p className="text-xs text-lux-ink/40 font-light mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Return steps */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-lux-ink mb-2">Return Process</h2>
          <GoldDivider />
          <div className="mt-8 space-y-0">
            {RETURN_STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0 w-10">
                  <div className="w-10 h-10 bg-lux-black flex items-center justify-center flex-shrink-0">
                    <span className="text-[0.65rem] font-bold text-lux-gold">{s.step}</span>
                  </div>
                  {i < RETURN_STEPS.length - 1 && <div className="w-0.5 flex-1 bg-lux-ink/10 my-1 min-h-[2rem]" />}
                </div>
                <div className={`pb-7 ${i === RETURN_STEPS.length - 1 ? 'pb-0' : ''} pt-2`}>
                  <p className="text-sm font-semibold text-lux-ink">{s.title}</p>
                  <p className="text-sm text-lux-ink/50 font-light mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Eligible / not eligible */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 border border-emerald-100 p-6">
            <h3 className="font-serif text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle size={18} strokeWidth={1.5} className="text-emerald-600" />
              Eligible for Return
            </h3>
            <ul className="space-y-3">
              {ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-emerald-800/70 font-light">
                  <CheckCircle size={13} strokeWidth={2} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 p-6">
            <h3 className="font-serif text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertCircle size={18} strokeWidth={1.5} className="text-red-500" />
              Not Eligible
            </h3>
            <ul className="space-y-3">
              {NOT_ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-red-800/70 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Refund timeline */}
        <section className="bg-white border border-lux-ink/8 p-6 md:p-8">
          <h2 className="font-serif text-xl font-semibold text-lux-ink mb-5">Refund Timeline</h2>
          <div className="space-y-4">
            {[
              { method: 'UPI / Net Banking',       days: '3–5 business days'  },
              { method: 'Credit / Debit Card',     days: '5–7 business days'  },
              { method: 'Store Credit / Coupon',   days: 'Instant'            },
              { method: 'Cash on Delivery (COD)',  days: '7–10 business days via NEFT' },
            ].map(({ method, days }) => (
              <div key={method} className="flex items-center justify-between py-3 border-b border-lux-ink/6 last:border-0">
                <span className="text-sm text-lux-ink/65 font-light">{method}</span>
                <span className="text-sm font-semibold text-lux-gold">{days}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-lux-black p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-white mb-2">Need Help with a Return?</h3>
          <p className="text-sm text-white/45 font-light mb-6 leading-relaxed">
            Our customer care team is available Monday – Saturday, 10 AM – 7 PM.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="mailto:hello@aahvani.com" className="flex items-center gap-3 text-white/60 hover:text-lux-gold transition-colors text-sm font-light">
              <Mail size={15} strokeWidth={1.5} className="text-lux-gold" />hello@aahvani.com
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-3 text-white/60 hover:text-lux-gold transition-colors text-sm font-light">
              <Phone size={15} strokeWidth={1.5} className="text-lux-gold" />+91 98765 43210
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
