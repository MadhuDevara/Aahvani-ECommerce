import type { Metadata } from 'next'
import { Truck, Zap, Package, Gift, MapPin, Clock, Shield, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping & Delivery — Aahvani Jewels',
  description: 'Free standard delivery above ₹999, express delivery across all of India. Premium gift packaging available.',
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

const DELIVERY_OPTIONS = [
  {
    Icon:    Truck,
    name:    'Standard Delivery',
    price:   'FREE above ₹999',
    below:   '₹49 below ₹999',
    days:    '5–7 business days',
    desc:    'Delivered safely in our signature jewellery packaging. Available across India.',
    accent:  'bg-emerald-50 border-emerald-100',
    iconBg:  'bg-emerald-100 text-emerald-600',
    badge:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    badgeText: 'Most Popular',
  },
  {
    Icon:    Zap,
    name:    'Express Delivery',
    price:   '₹99',
    below:   null,
    days:    '2–3 business days',
    desc:    'Priority handling and faster courier. Perfect when you need it in a hurry.',
    accent:  'bg-lux-gold/6 border-lux-gold/20',
    iconBg:  'bg-lux-gold/15 text-lux-gold',
    badge:   'bg-lux-gold/12 text-lux-gold border border-lux-gold/25',
    badgeText: 'Fast',
  },
]

const STEPS = [
  { label: 'Order Placed',        desc: 'You receive an order confirmation email instantly.' },
  { label: 'Payment Verified',    desc: 'Payment is verified within a few minutes.' },
  { label: 'Handcrafted & Packed',desc: 'Your piece is carefully inspected, polished and packed.' },
  { label: 'Dispatched',          desc: 'A tracking number is sent to your email.' },
  { label: 'Out for Delivery',    desc: 'Your parcel is with the local delivery partner.' },
  { label: 'Delivered',           desc: 'Jewellery arrives at your doorstep.' },
]

export default function ShippingPage() {
  return (
    <div className="bg-lux-ivory">

      {/* Hero */}
      <section className="border-b border-lux-gold/10 px-4 py-10 text-center md:py-12">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-lux-gold font-medium mb-3">Fast & Safe</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-lux-ink mb-3">Shipping & Delivery</h1>
        <GoldDivider />
        <p className="mt-4 text-sm text-lux-ink/45 font-light max-w-md mx-auto leading-relaxed">
          We deliver across all of India. Free shipping on orders above ₹999.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Delivery options */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-lux-ink mb-2">Delivery Options</h2>
          <GoldDivider />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {DELIVERY_OPTIONS.map((opt) => (
              <div key={opt.name} className={`p-6 border ${opt.accent} relative`}>
                <span className={`absolute top-4 right-4 text-[0.58rem] font-semibold tracking-wide px-2 py-0.5 rounded-full ${opt.badge}`}>
                  {opt.badgeText}
                </span>
                <div className={`w-12 h-12 ${opt.iconBg} flex items-center justify-center mb-5`}>
                  <opt.Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-lux-ink mb-1">{opt.name}</h3>
                <p className="text-2xl font-bold text-lux-gold font-serif mb-0.5">{opt.price}</p>
                {opt.below && <p className="text-xs text-lux-ink/40 font-light mb-3">{opt.below}</p>}
                <div className="flex items-center gap-1.5 mb-4">
                  <Clock size={12} strokeWidth={1.5} className="text-lux-ink/35" />
                  <span className="text-xs text-lux-ink/55 font-medium">{opt.days}</span>
                </div>
                <p className="text-sm text-lux-ink/55 font-light leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* All-India coverage */}
        <section className="bg-white border border-lux-ink/8 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-lux-gold/10 flex items-center justify-center flex-shrink-0">
              <MapPin size={22} strokeWidth={1.5} className="text-lux-gold" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-lux-ink mb-2">All India Delivery</h3>
              <p className="text-sm text-lux-ink/55 font-light leading-relaxed mb-4">
                We ship to every pin code across India — from metro cities to smaller towns. Our courier partners include
                Blue Dart, Delhivery, Xpressbees and India Post for remote areas.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur', 'All India'].map((city) => (
                  <div key={city} className="flex items-center gap-1.5 text-xs text-lux-ink/55 font-light">
                    <CheckCircle size={11} strokeWidth={2} className="text-lux-gold" />
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Delivery timeline */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-lux-ink mb-2">How Your Order Travels</h2>
          <GoldDivider />
          <div className="mt-8 space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0 w-8">
                  <div className="w-8 h-8 rounded-full bg-lux-gold flex items-center justify-center flex-shrink-0 z-10">
                    <span className="text-[0.62rem] font-bold text-white">{i + 1}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="w-0.5 flex-1 bg-lux-gold/20 my-1 min-h-[2rem]" />}
                </div>
                <div className={`pb-6 ${i === STEPS.length - 1 ? 'pb-0' : ''} pt-1`}>
                  <p className="text-sm font-semibold text-lux-ink">{step.label}</p>
                  <p className="text-xs text-lux-ink/45 font-light mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gift packaging */}
        <section className="bg-lux-black p-6 md:p-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-lux-gold/20 flex items-center justify-center flex-shrink-0">
              <Gift size={22} strokeWidth={1.5} className="text-lux-gold" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-white mb-2">Premium Gift Packaging</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed mb-4">
                Every Aahvani order arrives in our signature jewellery box with a satin ribbon, tissue wrap and a handwritten note card — at no extra cost.
                Perfect for gifting without any additional packaging required.
              </p>
              <div className="space-y-2">
                {[
                  'Signature Aahvani jewellery box',
                  'Satin ribbon & tissue wrap',
                  'Free personalised note card',
                  'Anti-tarnish pouch included',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-white/60 font-light">
                    <CheckCircle size={13} strokeWidth={2} className="text-lux-gold flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { Icon: Shield,  title: '100% Secure',      sub: 'Tamper-proof packaging' },
              { Icon: Package, title: 'Insured Shipping',  sub: 'All orders are insured' },
              { Icon: Clock,   title: 'Real-time Tracking',sub: 'Track your order by email' },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 p-4 bg-white border border-lux-ink/8">
                <div className="w-10 h-10 bg-lux-gold/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} strokeWidth={1.5} className="text-lux-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-lux-ink">{title}</p>
                  <p className="text-xs text-lux-ink/40 font-light">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
