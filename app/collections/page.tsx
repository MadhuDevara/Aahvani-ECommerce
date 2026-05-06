import type { Metadata } from 'next'
import Link from 'next/link'
import { Gem, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Collections — Aahvani Jewels',
  description: 'Explore our curated jewellery collections — Bridal, Festive, Daily Wear and Gift Sets.',
}

const COLLECTIONS = [
  {
    slug:        'bridal',
    name:        'Bridal Collection',
    tag:         'New Season',
    description: 'Luminous pieces crafted for the most cherished moments of your life. From temple-inspired sets to modern Kundan, each design tells a story of eternal love.',
    pieces:      '48 pieces',
    bg:          'bg-lux-ivory-muted',
    accent:      'from-lux-gold/20 to-lux-gold/5',
  },
  {
    slug:        'festive',
    name:        'Festive Collection',
    tag:         'Bestseller',
    description: 'Celebrate every festival with the brilliance of Meenakari, Jadau and polished gold. Designed to shine as brightly as your celebrations.',
    pieces:      '36 pieces',
    bg:          'bg-lux-ivory-deep',
    accent:      'from-lux-gold/15 to-transparent',
  },
  {
    slug:        'daily-wear',
    name:        'Daily Wear',
    tag:         'Lightweight',
    description: 'Understated elegance for every day. Delicate rings, subtle hoops and minimalist pendants that pair effortlessly with any outfit, any occasion.',
    pieces:      '62 pieces',
    bg:          'bg-lux-ivory-deep',
    accent:      'from-lux-gold/12 to-transparent',
  },
  {
    slug:        'gift-sets',
    name:        'Gift Sets',
    tag:         'Curated',
    description: 'Thoughtfully curated sets presented in our signature gift box. The perfect expression of love, wrapped in luxury and ready to delight.',
    pieces:      '24 sets',
    bg:          'bg-lux-ivory-muted',
    accent:      'from-lux-gold/18 to-transparent',
  },
]

// Decorative motif
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-10 bg-lux-gold/40" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" />
      </svg>
      <span className="h-px w-10 bg-lux-gold/40" />
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <div className="bg-lux-ivory">

      {/* ── Hero ── */}
      <section className="px-4 pb-5 pt-2 text-center md:pb-6 md:pt-3">
        <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.42em] text-lux-gold">
          Aahvani Jewels
        </p>
        <h1 className="mb-2 font-serif text-[1.75rem] font-semibold leading-tight text-lux-ink sm:text-4xl md:text-5xl lg:text-5xl">
          Our Collections
        </h1>
        <GoldDivider />
        <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-snug text-lux-ink/50 md:text-[0.95rem] md:leading-relaxed">
          Each collection is a chapter in our story — handcrafted in India, finished with the
          precision of generations, and offered to you with love.
        </p>
      </section>

      {/* ── Collection cards ── */}
      <section className="mx-auto max-w-[min(100%,var(--lux-max))] space-y-5 px-4 pb-12 pt-1 sm:px-6 sm:pb-16 lg:px-8">
        {COLLECTIONS.map((col, i) => {
          const isEven = i % 2 === 1
          return (
            <article
              key={col.slug}
              className={`grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-lux-gold/12 bg-white group ${isEven ? 'md:[direction:rtl]' : ''}`}
            >
              {/* Image placeholder */}
              <div className={`relative h-56 min-h-[14rem] md:h-auto md:min-h-[17rem] ${col.bg} flex items-center justify-center overflow-hidden ${isEven ? 'md:[direction:ltr]' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${col.accent}`} aria-hidden="true" />
                {/* Decorative rings */}
                <div className="absolute h-44 w-44 rounded-full border border-lux-gold/8" aria-hidden="true" />
                <div className="absolute h-32 w-32 rounded-full border border-lux-gold/12" aria-hidden="true" />
                <div className="relative z-10 text-center">
                  <Gem size={40} strokeWidth={0.6} className="text-lux-gold/30 mx-auto mb-3" />
                  <p className="text-[0.62rem] tracking-[0.3em] uppercase text-lux-gold/50 font-medium">
                    {col.pieces}
                  </p>
                </div>
                {/* Tag */}
                <span className="absolute top-5 left-5 px-3 py-1 bg-lux-gold text-white text-[0.6rem] tracking-[0.2em] uppercase font-semibold">
                  {col.tag}
                </span>
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:px-12 ${isEven ? 'md:[direction:ltr]' : ''}`}>
                <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-lux-gold">
                  Collection
                </p>
                <h2 className="mb-3 font-serif text-2xl font-semibold leading-snug text-lux-ink md:text-3xl lg:text-4xl">
                  {col.name}
                </h2>
                <div className="mb-4 flex items-center gap-3" aria-hidden="true">
                  <span className="h-px w-8 bg-lux-gold/40" />
                  <Sparkles size={10} strokeWidth={1.5} className="text-lux-gold/60" />
                </div>
                <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-lux-ink/55 md:mb-8">
                  {col.description}
                </p>
                <Link
                  href="/shop"
                  className="self-start flex items-center gap-3 px-7 py-3.5 bg-lux-gold text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-lux-gold-hover transition-colors duration-200 group"
                >
                  Shop Now
                  <ArrowRight size={13} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </article>
          )
        })}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-lux-black px-4 py-12 text-center md:py-14">
        <p className="text-[0.6rem] tracking-[0.4em] uppercase text-lux-gold font-medium mb-4">
          Can&apos;t decide?
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
          Browse All Jewellery
        </h2>
        <GoldDivider />
        <p className="text-sm text-white/40 font-light mt-4 mb-10 max-w-md mx-auto leading-relaxed">
          Explore our complete range of over 170 handcrafted pieces — from statement necklaces to delicate daily wear.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 px-10 py-4 border border-lux-gold text-lux-gold text-[0.68rem] tracking-[0.25em] uppercase font-medium hover:bg-lux-gold hover:text-white transition-all duration-200"
        >
          View All Products
          <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </section>

    </div>
  )
}
