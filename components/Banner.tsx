import Link from 'next/link'

export default function Banner() {
  return (
    <section className="relative py-28 overflow-hidden bg-[#1A1A1A]">
      {/* Decorative rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 -right-28 w-[450px] h-[450px] rounded-full border border-[#C6973F]/15" />
        <div className="absolute -bottom-28 -left-28 w-[500px] h-[500px] rounded-full border border-[#C6973F]/10" />
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-[#C6973F]/8" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center px-4">
        <p className="text-[0.6rem] tracking-[0.45em] uppercase text-[#C6973F] mb-7">Just Arrived</p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-white leading-tight mb-6">
          New Collection<br />Arrived
        </h2>
        <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
          <span className="h-px w-14 bg-[#C6973F]/50 flex-shrink-0" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z" fill="#C6973F" />
          </svg>
          <span className="h-px w-14 bg-[#C6973F]/50 flex-shrink-0" />
        </div>
        <p className="text-white/45 text-sm md:text-base font-light tracking-wide leading-relaxed mb-10 max-w-md mx-auto">
          Discover our latest handcrafted pieces — inspired by tradition,
          designed for the modern woman
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center px-10 py-4 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.25em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-300"
        >
          Explore Now
        </Link>
      </div>
    </section>
  )
}
