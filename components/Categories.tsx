import Link from 'next/link'
import { CircleDot, Sparkles, Gem, Link2 } from 'lucide-react'
import type { FC, SVGProps } from 'react'

type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>

interface Category {
  name: string
  href: string
  Icon: IconComponent
  count: string
  bg: string
}

const CATEGORIES: Category[] = [
  { name: 'Rings',     href: '/shop?category=Rings',     Icon: CircleDot as IconComponent, count: '42 designs', bg: 'bg-lux-ivory-muted' },
  { name: 'Earrings',  href: '/shop?category=Earrings',  Icon: Sparkles  as IconComponent, count: '68 designs', bg: 'bg-lux-ivory-muted' },
  { name: 'Necklaces', href: '/shop?category=Necklaces', Icon: Gem       as IconComponent, count: '35 designs', bg: 'bg-lux-ivory' },
  { name: 'Bracelets', href: '/shop?category=Bracelets', Icon: Link2     as IconComponent, count: '29 designs', bg: 'bg-lux-ivory-deep' },
]

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-10 bg-lux-gold" />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z" fill="var(--lux-gold)" />
      </svg>
      <span className="h-px w-10 bg-lux-gold" />
    </div>
  )
}

export default function Categories() {
  return (
    <section className="bg-white px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[min(100%,var(--lux-max))]">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-[0.6rem] uppercase tracking-[0.4em] text-lux-gold">Browse</p>
          <h2 className="font-serif text-3xl font-semibold text-lux-ink md:text-4xl lg:text-[2.75rem]">
            Shop by Category
          </h2>
          <SectionDivider />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {CATEGORIES.map(({ name, href, Icon, count, bg }) => (
            <Link key={name} href={href} className="group block">
              {/* Zoom container */}
              <div className="overflow-hidden mb-4">
                <div
                  className={`aspect-square ${bg} flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out`}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-20 h-20 rounded-full border border-lux-gold/20" />
                    <Icon size={34} className="relative text-lux-gold" strokeWidth={1} />
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-lg md:text-xl font-medium text-lux-ink group-hover:text-lux-gold transition-colors duration-200">
                {name}
              </h3>
              <p className="text-xs text-lux-ink/40 mt-1 tracking-wide font-light">{count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
