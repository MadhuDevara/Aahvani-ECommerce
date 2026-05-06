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
    bg:    'bg-lux-gold/10',
  },
  {
    Icon:  Shield,
    title: 'Quality',
    body:  'We use only certified, ethically sourced materials. Each piece passes through a rigorous quality check before it reaches you, ensuring it lasts a lifetime.',
    bg:    'bg-lux-gold/8',
  },
  {
    Icon:  Heart,
    title: 'Trust',
    body:  'Over 1,000 happy customers across India. We stand behind every piece with a 30-day return policy and a one-year craftsmanship warranty.',
    bg:    'bg-lux-gold/10',
  },
]

const MILESTONES = [
  { year: '2018', label: 'Founded in Mumbai' },
  { year: '2020', label: 'Crossed 10,000 orders' },
  { year: '2022', label: 'Launched online store' },
  { year: '2024', label: '1,000+ happy customers' },
]

function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-lux-gold/35" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
        <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" />
      </svg>
      <span className="h-px w-8 bg-lux-gold/35" />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="bg-lux-ivory">

      {/* ── Hero — editorial strip, minimal vertical cost ── */}
      <section className="relative overflow-hidden px-4 pb-[var(--lux-hero-compact-y)] pt-2 text-center md:pt-3">
        {/* Whisper rings: small, high anchor, low contrast — never dominate layout */}
        <div
          className="pointer-events-none absolute left-1/2 top-[26%] h-[min(56vw,220px)] w-[min(56vw,220px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lux-gold/[0.05] opacity-40 md:h-[260px] md:w-[260px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[26%] h-[min(40vw,150px)] w-[min(40vw,150px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lux-gold/[0.07] opacity-30 md:h-[180px] md:w-[180px]"
          aria-hidden="true"
        />

        <div className="relative z-[1]">
          <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.42em] text-lux-gold/90">
            Since 2018
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-[1.08] text-lux-ink md:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <div className="mt-2">
          <GoldDivider />
          </div>
          <p className="mx-auto mt-3 max-w-lg text-sm font-light leading-snug text-lux-ink/50 md:text-[0.95rem] md:leading-relaxed">
            An invitation to elegance — born in the heart of Mumbai, carried across India.
          </p>
        </div>
      </section>

      {/* ── Story — magazine spread: minimal gap from hero ── */}
      <section className="mx-auto grid max-w-[min(100%,var(--lux-max))] grid-cols-1 items-center gap-6 px-4 pb-10 pt-1 sm:px-6 md:grid-cols-2 md:gap-8 md:pb-12 md:pt-2 lg:gap-10 lg:px-8">
        <div className="relative order-2 aspect-[4/5] max-h-[min(52vh,300px)] min-h-[220px] w-full overflow-hidden bg-lux-ivory-deep md:order-1 md:max-h-[340px]">
          <div className="absolute inset-0 bg-gradient-to-br from-lux-gold/12 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-lux-gold/18 md:h-28 md:w-28">
              <Gem className="h-9 w-9 text-lux-gold/28 md:h-11 md:w-11" strokeWidth={0.5} aria-hidden />
            </div>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-lux-gold/45">
              Handcrafted in India
            </p>
          </div>
          <div className="absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-lux-gold/22" aria-hidden="true" />
          <div className="absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-lux-gold/22" aria-hidden="true" />
        </div>

        <div className="order-1 md:order-2">
          <p className="mb-1.5 text-[0.6rem] font-medium uppercase tracking-[0.32em] text-lux-gold">The Beginning</p>
          <h2 className="mb-4 font-serif text-[1.65rem] font-semibold leading-snug text-lux-ink md:text-3xl lg:text-[2.1rem]">
            Born from a love of<br />Indian artistry
          </h2>
          <div className="space-y-3.5 text-sm font-light leading-relaxed text-lux-ink/55 md:space-y-4 md:text-[0.9375rem]">
            <p>
              Aahvani Jewels was founded with a single belief — that every woman deserves to wear jewellery
              as unique and beautiful as she is. We started as a small workshop in Mumbai, working directly
              with artisan families who have been crafting jewellery for generations.
            </p>
            <p>
              The word <em className="font-medium not-italic text-lux-gold">Aahvani</em> means &ldquo;an
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

      <section className="bg-lux-black px-4 py-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-0 divide-x divide-white/8 md:grid-cols-4">
            {MILESTONES.map((m) => (
              <div key={m.year} className="px-4 py-3.5 text-center sm:px-6">
                <p className="mb-0.5 font-serif text-2xl font-bold text-lux-gold md:text-3xl">{m.year}</p>
                <p className="text-[0.62rem] font-light tracking-wide text-white/40">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-1.5 text-[0.6rem] font-medium uppercase tracking-[0.32em] text-lux-gold">What we stand for</p>
          <h2 className="font-serif text-2xl font-semibold text-lux-ink md:text-3xl lg:text-4xl">Our Values</h2>
          <GoldDivider className="mt-2" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {VALUES.map(({ Icon, title, body, bg }) => (
            <div key={title} className="group border border-lux-gold/10 bg-white p-6 text-center transition-all duration-200 hover:border-lux-gold/25 hover:shadow-sm md:p-8">
              <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center ${bg} md:mb-5`}>
                <Icon size={21} strokeWidth={1.2} className="text-lux-gold" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-lux-ink md:text-xl">{title}</h3>
              <p className="text-sm font-light leading-relaxed text-lux-ink/50">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-lux-gold/12 bg-lux-ivory-deep/40 px-4 py-10 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lux-gold/12 md:mb-5">
            <span className="font-serif text-xl font-bold text-lux-gold">A</span>
          </div>
          <div className="mb-4 text-lux-gold/45" aria-hidden="true">
            <Quote size={24} strokeWidth={1} className="mx-auto" />
          </div>
          <blockquote className="mx-auto mb-5 max-w-2xl font-serif text-lg font-medium italic leading-relaxed text-lux-ink/82 md:text-xl lg:text-2xl">
            &ldquo;I wanted every woman who wears Aahvani to feel the hands that made it — the care, the
            tradition, and the love woven into every detail.&rdquo;
          </blockquote>
          <p className="text-sm font-medium text-lux-ink">Aarti Mehta</p>
          <p className="mt-1 text-[0.65rem] font-light tracking-wide text-lux-ink/40">Founder, Aahvani Jewels</p>
          <GoldDivider className="mt-4" />
        </div>
      </section>

      <section className="px-4 py-12 text-center md:py-16">
        <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.38em] text-lux-gold">
          Ready to explore?
        </p>
        <h2 className="mb-2 font-serif text-2xl font-semibold text-lux-ink md:text-3xl lg:text-4xl">
          Shop Our Collection
        </h2>
        <GoldDivider className="mx-auto mt-1" />
        <p className="mx-auto mb-8 mt-4 max-w-sm text-sm font-light leading-relaxed text-lux-ink/45">
          From bridal sets to everyday elegance — find the piece that tells your story.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 bg-lux-gold px-8 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-lux-gold-hover"
          >
            Shop Now
            <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2.5 border border-lux-gold px-8 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-lux-gold transition-all duration-200 hover:bg-lux-gold hover:text-white"
          >
            Our Collections
          </Link>
        </div>
      </section>

    </div>
  )
}
