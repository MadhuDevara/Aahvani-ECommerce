'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-lux-gold/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" /></svg>
      <span className="h-px w-8 bg-lux-gold/40" />
    </div>
  )
}

const FAQS = [
  {
    q: 'What materials are your jewellery pieces made from?',
    a: 'Our jewellery is crafted from a range of high-quality materials including 22kt gold plating, 925 sterling silver, Kundan settings, pearl, and Meenakari enamel. Each product page lists the exact material used. All materials are sourced ethically from certified suppliers.',
  },
  {
    q: 'How do I find my ring size?',
    a: 'You can use our detailed Size Guide at /size-guide. In short, wrap a thin strip of paper around your finger, mark where it meets, then measure the length — that is your finger circumference. Compare it to the chart to find your Indian ring size (5–22).',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes! Standard delivery is completely FREE on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹49 applies. We also offer Express Delivery (2–3 business days) for ₹99 on any order.',
  },
  {
    q: 'Can I return or exchange my jewellery?',
    a: 'We offer a 7-day return policy from the date of delivery for items that are damaged, defective, or incorrectly delivered. Custom or personalised pieces and earrings (for hygiene reasons) are not eligible for return unless defective. Please visit our Returns page for the full process.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 5–7 business days across India. Express delivery takes 2–3 business days. Remote locations may take 1–2 additional days. You will receive a tracking number by email once your order is dispatched.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Absolutely. We use industry-standard SSL encryption for all transactions. We accept UPI, Visa, Mastercard, Net Banking, and popular wallets like PhonePe and Google Pay. We never store your card or bank details on our servers.',
  },
  {
    q: 'Can I customise a piece or request a specific design?',
    a: 'Yes! We do take custom jewellery orders for special occasions like weddings and engagements. Please reach out to us via the Contact page or email us at hello@aahvani.com with your requirements and budget. Custom pieces typically take 10–14 business days.',
  },
  {
    q: 'How do I care for my Aahvani jewellery?',
    a: 'To keep your jewellery looking its best: store it in the anti-tarnish pouch provided, avoid contact with water, perfume, and lotions, clean gently with a soft dry cloth, and keep pieces separately to avoid scratches. For gold-plated pieces, avoid prolonged exposure to sweat and moisture.',
  },
]

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`border-b border-lux-ink/8 last:border-0 transition-colors ${isOpen ? 'bg-lux-gold/4' : 'bg-white hover:bg-lux-ivory'}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-medium leading-relaxed transition-colors ${isOpen ? 'text-lux-gold' : 'text-lux-ink'}`}>
          {q}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-lux-gold' : 'text-lux-ink/30'}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 pb-5 text-sm text-lux-ink/55 font-light leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="bg-lux-ivory">

      {/* Hero */}
      <section className="border-b border-lux-gold/10 px-4 py-10 text-center md:py-12">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-lux-gold font-medium mb-3">Got questions?</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-lux-ink mb-3">
          Frequently Asked Questions
        </h1>
        <GoldDivider />
        <p className="mt-4 text-sm text-lux-ink/45 font-light max-w-md mx-auto leading-relaxed">
          Find quick answers to the most common questions about our jewellery, shipping, returns and more.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-10">

        {/* Accordion */}
        <div className="bg-white border border-lux-ink/8 overflow-hidden">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div className="bg-lux-black p-8 text-center">
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-lux-gold font-medium mb-3">Didn&apos;t find your answer?</p>
          <h3 className="font-serif text-2xl font-semibold text-white mb-3">We&apos;re here to help</h3>
          <p className="text-sm text-white/40 font-light max-w-sm mx-auto leading-relaxed mb-6">
            Our team replies within 24 hours. Write to us and we&apos;ll get back to you as soon as possible.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 border border-lux-gold text-lux-gold text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-lux-gold hover:text-white transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  )
}
