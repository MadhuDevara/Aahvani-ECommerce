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
    bg:          'bg-[#F7EDD8]',
    accent:      'from-[#C6973F]/20 to-[#C6973F]/5',
  },
  {
    slug:        'festive',
    name:        'Festive Collection',
    tag:         'Bestseller',
    description: 'Celebrate every festival with the brilliance of Meenakari, Jadau and polished gold. Designed to shine as brightly as your celebrations.',
    pieces:      '36 pieces',
    bg:          'bg-[#F0E4CC]',
    accent:      'from-[#C6973F]/15 to-[#F0E4CC]/0',
  },
  {
    slug:        'daily-wear',
    name:        'Daily Wear',
    tag:         'Lightweight',
    description: 'Understated elegance for every day. Delicate rings, subtle hoops and minimalist pendants that pair effortlessly with any outfit, any occasion.',
    pieces:      '62 pieces',
    bg:          'bg-[#EDE4D5]',
    accent:      'from-[#C6973F]/12 to-transparent',
  },
  {
    slug:        'gift-sets',
    name:        'Gift Sets',
    tag:         'Curated',
    description: 'Thoughtfully curated sets presented in our signature gift box. The perfect expression of love, wrapped in luxury and ready to delight.',
    pieces:      '24 sets',
    bg:          'bg-[#F3EAD6]',
    accent:      'from-[#C6973F]/18 to-transparent',
  },
]

// Decorative motif
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

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* ── Hero ── */}
      <section className="py-20 md:py-28 text-center px-4">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-4">
          Aahvani Jewels
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#1A1A1A] leading-tight mb-4">
          Our Collections
        </h1>
        <GoldDivider />
        <p className="mt-5 text-sm md:text-base text-[#1A1A1A]/50 font-light max-w-xl mx-auto leading-relaxed">
          Each collection is a chapter in our story — handcrafted in India, finished with the
          precision of generations, and offered to you with love.
        </p>
      </section>

      {/* ── Collection cards ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        {COLLECTIONS.map((col, i) => {
          const isEven = i % 2 === 1
          return (
            <article
              key={col.slug}
              className={`grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-[#C6973F]/12 bg-white group ${isEven ? 'md:[direction:rtl]' : ''}`}
            >
              {/* Image placeholder */}
              <div className={`relative h-72 md:h-auto min-h-[20rem] ${col.bg} flex items-center justify-center overflow-hidden ${isEven ? 'md:[direction:ltr]' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${col.accent}`} aria-hidden="true" />
                {/* Decorative rings */}
                <div className="absolute w-64 h-64 border border-[#C6973F]/10 rounded-full" aria-hidden="true" />
                <div className="absolute w-44 h-44 border border-[#C6973F]/15 rounded-full" aria-hidden="true" />
                <div className="relative z-10 text-center">
                  <Gem size={40} strokeWidth={0.6} className="text-[#C6973F]/30 mx-auto mb-3" />
                  <p className="text-[0.62rem] tracking-[0.3em] uppercase text-[#C6973F]/50 font-medium">
                    {col.pieces}
                  </p>
                </div>
                {/* Tag */}
                <span className="absolute top-5 left-5 px-3 py-1 bg-[#C6973F] text-white text-[0.6rem] tracking-[0.2em] uppercase font-semibold">
                  {col.tag}
                </span>
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center px-8 md:px-12 py-12 ${isEven ? 'md:[direction:ltr]' : ''}`}>
                <p className="text-[0.6rem] tracking-[0.35em] uppercase text-[#C6973F] font-medium mb-3">
                  Collection
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A] leading-snug mb-4">
                  {col.name}
                </h2>
                <div className="flex items-center gap-3 mb-5" aria-hidden="true">
                  <span className="h-px w-8 bg-[#C6973F]/40" />
                  <Sparkles size={10} strokeWidth={1.5} className="text-[#C6973F]/60" />
                </div>
                <p className="text-sm text-[#1A1A1A]/55 font-light leading-relaxed mb-8 max-w-sm">
                  {col.description}
                </p>
                <Link
                  href="/shop"
                  className="self-start flex items-center gap-3 px-7 py-3.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200 group"
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
      <section className="bg-[#1A1A1A] py-20 text-center px-4">
        <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-4">
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
          className="inline-flex items-center gap-3 px-10 py-4 border border-[#C6973F] text-[#C6973F] text-[0.68rem] tracking-[0.25em] uppercase font-medium hover:bg-[#C6973F] hover:text-white transition-all duration-200"
        >
          View All Products
          <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </section>

    </div>
  )
}
