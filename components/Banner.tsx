import Link from 'next/link'

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-lux-black py-12 md:py-16">
      {/* Decorative rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 -right-28 w-[450px] h-[450px] rounded-full border border-lux-gold/15" />
        <div className="absolute -bottom-28 -left-28 w-[500px] h-[500px] rounded-full border border-lux-gold/10" />
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-lux-gold/8" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <p className="mb-4 text-[0.6rem] uppercase tracking-[0.45em] text-lux-gold md:mb-5">Just Arrived</p>
        <h2 className="font-serif text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
          New Collection<br />Arrived
        </h2>
        <div className="mb-6 mt-5 flex items-center justify-center gap-4 md:mb-7" aria-hidden="true">
          <span className="h-px w-14 bg-lux-gold/50 flex-shrink-0" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z" fill="var(--lux-gold)" />
          </svg>
          <span className="h-px w-14 bg-lux-gold/50 flex-shrink-0" />
        </div>
        <p className="mx-auto mb-8 max-w-md text-sm font-light leading-relaxed tracking-wide text-white/45 md:mb-9 md:text-base">
          Discover our latest handcrafted pieces — inspired by tradition,
          designed for the modern woman
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center px-10 py-4 bg-lux-gold text-white text-[0.68rem] tracking-[0.25em] uppercase font-medium hover:bg-lux-gold-hover transition-colors duration-300"
        >
          Explore Now
        </Link>
      </div>
    </section>
  )
}
