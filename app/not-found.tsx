import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-lux-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Decorative ornament */}
        <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
          <span className="h-px w-12 bg-lux-gold/40" />
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 0L13.2 8.8L22 11L13.2 13.2L11 22L8.8 13.2L0 11L8.8 8.8Z" fill="var(--lux-gold)" fillOpacity="0.35" />
          </svg>
          <span className="h-px w-12 bg-lux-gold/40" />
        </div>

        <p className="font-serif text-[5rem] leading-none font-semibold text-lux-gold/20 mb-2 select-none">
          404
        </p>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-lux-ink mb-3">
          Page Not Found
        </h1>

        <div className="flex items-center justify-center gap-4 my-5" aria-hidden="true">
          <span className="h-px w-8 bg-lux-gold/40" />
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" />
          </svg>
          <span className="h-px w-8 bg-lux-gold/40" />
        </div>

        <p className="text-sm text-lux-ink/50 font-light leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist yet.<br />
          Explore our collection instead.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-44 sm:w-auto px-8 py-3 bg-lux-gold text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-lux-gold-hover transition-colors duration-200"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="w-44 sm:w-auto px-8 py-3 border border-lux-gold text-lux-gold text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-lux-gold hover:text-white transition-all duration-200"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}
