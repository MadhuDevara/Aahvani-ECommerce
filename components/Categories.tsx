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
  { name: 'Rings',     href: '/collections/rings',     Icon: CircleDot as IconComponent, count: '42 designs', bg: 'bg-[#F5EBD8]' },
  { name: 'Earrings',  href: '/collections/earrings',  Icon: Sparkles  as IconComponent, count: '68 designs', bg: 'bg-[#EFE0C9]' },
  { name: 'Necklaces', href: '/collections/necklaces', Icon: Gem       as IconComponent, count: '35 designs', bg: 'bg-[#F9F0E3]' },
  { name: 'Bracelets', href: '/collections/bracelets', Icon: Link2     as IconComponent, count: '29 designs', bg: 'bg-[#EDE4D5]' },
]

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-10 bg-[#C6973F]" />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z" fill="#C6973F" />
      </svg>
      <span className="h-px w-10 bg-[#C6973F]" />
    </div>
  )
}

export default function Categories() {
  return (
    <section className="py-24 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[#C6973F] mb-4">Browse</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-[#1A1A1A] mb-5">
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
                    <div className="absolute w-20 h-20 rounded-full border border-[#C6973F]/20" />
                    <Icon size={34} className="relative text-[#C6973F]" strokeWidth={1} />
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-lg md:text-xl font-medium text-[#1A1A1A] group-hover:text-[#C6973F] transition-colors duration-200">
                {name}
              </h3>
              <p className="text-xs text-[#1A1A1A]/40 mt-1 tracking-wide font-light">{count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
