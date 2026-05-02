import type { Metadata } from 'next'
import Link from 'next/link'
import { Gem, Heart, Shield, Award, ArrowRight, Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Story — Aahvani Jewels',
  description: 'Learn about Aahvani Jewels — handcrafted in India with love, quality materials and generations of craftsmanship.',
}

const VALUES = [
  {
    Icon:  Award,
    title: 'Craftsmanship',
    body:  'Every piece is handcrafted by master artisans with decades of experience in traditional Indian jewellery-making techniques — Meenakari, Kundan, Jadau and more.',
    bg:    'bg-[#C6973F]/10',
  },
  {
    Icon:  Shield,
    title: 'Quality',
    body:  'We use only certified, ethically sourced materials. Each piece passes through a rigorous quality check before it reaches you, ensuring it lasts a lifetime.',
    bg:    'bg-[#C6973F]/8',
  },
  {
    Icon:  Heart,
    title: 'Trust',
    body:  'Over 1,000 happy customers across India. We stand behind every piece with a 30-day return policy and a one-year craftsmanship warranty.',
    bg:    'bg-[#C6973F]/10',
  },
]

const MILESTONES = [
  { year: '2018', label: 'Founded in Mumbai' },
  { year: '2020', label: 'Crossed 10,000 orders' },
  { year: '2022', label: 'Launched online store' },
  { year: '2024', label: '1,000+ happy customers' },
]

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-10 bg-[#C6973F]/40" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" />
      </svg>
      <span className="h-px w-10 bg-[#C6973F]/40" />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 md:py-36 text-center px-4 bg-[#FDF6EC]">
        {/* Background rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#C6973F]/6 rounded-full pointer-events-none" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#C6973F]/8 rounded-full pointer-events-none" aria-hidden="true" />

        <div className="relative">
          <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-4">
            Since 2018
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-semibold text-[#1A1A1A] leading-none mb-4">
            Our Story
          </h1>
          <GoldDivider />
          <p className="mt-6 text-sm md:text-base text-[#1A1A1A]/50 font-light max-w-lg mx-auto leading-relaxed">
            An invitation to elegance — born in the heart of Mumbai, carried across India.
          </p>
        </div>
      </section>

      {/* ── Story section ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image placeholder */}
        <div className="relative h-[420px] bg-[#F0E4CC] overflow-hidden order-2 md:order-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6973F]/15 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 border border-[#C6973F]/20 rounded-full flex items-center justify-center">
              <Gem size={48} strokeWidth={0.5} className="text-[#C6973F]/30" />
            </div>
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#C6973F]/40 font-medium">
              Handcrafted in India
            </p>
          </div>
          {/* Corner ornament */}
          <div className="absolute top-5 left-5 w-12 h-12 border-l-2 border-t-2 border-[#C6973F]/25" aria-hidden="true" />
          <div className="absolute bottom-5 right-5 w-12 h-12 border-r-2 border-b-2 border-[#C6973F]/25" aria-hidden="true" />
        </div>

        {/* Text */}
        <div className="order-1 md:order-2">
          <p className="text-[0.62rem] tracking-[0.35em] uppercase text-[#C6973F] font-medium mb-3">The Beginning</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A] leading-snug mb-6">
            Born from a love of<br />Indian artistry
          </h2>
          <div className="space-y-4 text-sm text-[#1A1A1A]/55 font-light leading-relaxed">
            <p>
              Aahvani Jewels was founded with a single belief — that every woman deserves to wear jewellery
              as unique and beautiful as she is. We started as a small workshop in Mumbai, working directly
              with artisan families who have been crafting jewellery for generations.
            </p>
            <p>
              The word <em className="text-[#C6973F] not-italic font-medium">Aahvani</em> means &ldquo;an
              invitation&rdquo; — and that is exactly what we offer: an invitation to elegance, tradition,
              and the timeless art of Indian jewellery.
            </p>
            <p>
              Today, each piece in our collection is still handcrafted using traditional techniques —
              Kundan setting, Meenakari enamel work, and Jadau craftsmanship — ensuring that every item
              you receive carries the soul of its maker.
            </p>
          </div>
        </div>
      </section>

      {/* ── Milestones ── */}
      <section className="bg-[#1A1A1A] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/8">
            {MILESTONES.map((m) => (
              <div key={m.year} className="text-center px-6 py-4">
                <p className="font-serif text-3xl font-bold text-[#C6973F] mb-1">{m.year}</p>
                <p className="text-[0.65rem] text-white/40 font-light tracking-wide">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-[0.62rem] tracking-[0.35em] uppercase text-[#C6973F] font-medium mb-3">What we stand for</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A]">Our Values</h2>
          <GoldDivider />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map(({ Icon, title, body, bg }) => (
            <div key={title} className="bg-white border border-[#C6973F]/10 p-8 text-center group hover:border-[#C6973F]/25 hover:shadow-sm transition-all duration-200">
              <div className={`w-14 h-14 ${bg} mx-auto mb-5 flex items-center justify-center`}>
                <Icon size={22} strokeWidth={1.2} className="text-[#C6973F]" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-3">{title}</h3>
              <p className="text-sm text-[#1A1A1A]/50 font-light leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="bg-[#F5ECD8]/40 border-y border-[#C6973F]/12 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-[#C6973F]/15 mx-auto mb-6 flex items-center justify-center">
            <span className="font-serif text-2xl font-bold text-[#C6973F]">A</span>
          </div>
          <div className="mb-5 text-[#C6973F]/50" aria-hidden="true">
            <Quote size={28} strokeWidth={1} className="mx-auto" />
          </div>
          <blockquote className="font-serif text-xl md:text-2xl font-medium text-[#1A1A1A]/80 leading-relaxed italic mb-6 max-w-2xl mx-auto">
            &ldquo;I wanted every woman who wears Aahvani to feel the hands that made it — the care, the
            tradition, and the love woven into every detail.&rdquo;
          </blockquote>
          <p className="text-sm font-medium text-[#1A1A1A]">Aarti Mehta</p>
          <p className="text-[0.68rem] text-[#1A1A1A]/40 font-light mt-1 tracking-wide">Founder, Aahvani Jewels</p>
          <GoldDivider />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 text-center px-4">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-4">
          Ready to explore?
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-4">
          Shop Our Collection
        </h2>
        <GoldDivider />
        <p className="mt-5 text-sm text-[#1A1A1A]/45 font-light max-w-sm mx-auto leading-relaxed mb-10">
          From bridal sets to everyday elegance — find the piece that tells your story.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200"
          >
            Shop Now
            <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 px-10 py-4 border border-[#C6973F] text-[#C6973F] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[#C6973F] hover:text-white transition-all duration-200"
          >
            Our Collections
          </Link>
        </div>
      </section>

    </div>
  )
}
