import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#FDF6EC] flex items-center justify-center px-4 pb-24 sm:pb-28">
      {/* Decorative concentric rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-[#C6973F]/10" />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full border border-[#C6973F]/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#C6973F]/5" />
      </div>

      <div className="relative text-center max-w-3xl mx-auto py-24">
        <p className="text-[0.6rem] tracking-[0.45em] uppercase text-[#C6973F] mb-10">
          Aahvani Jewels
        </p>

        <h1 className="font-serif text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-semibold text-[#1A1A1A] leading-[1.05] tracking-tight mb-8">
          An Invitation<br />to Elegance
        </h1>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
          <span className="h-px w-16 bg-[#C6973F] flex-shrink-0" />
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 0L7.8 5.2L13 6.5L7.8 7.8L6.5 13L5.2 7.8L0 6.5L5.2 5.2Z" fill="#C6973F" />
          </svg>
          <span className="h-px w-16 bg-[#C6973F] flex-shrink-0" />
        </div>

        <p className="text-sm md:text-base text-[#1A1A1A]/50 mb-12 font-light tracking-widest leading-loose uppercase">
          Handcrafted jewellery for every moment that matters
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="w-52 sm:w-auto px-10 py-4 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.25em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-300"
          >
            Shop Now
          </Link>
          <Link
            href="/collections"
            className="w-52 sm:w-auto px-10 py-4 border border-[#C6973F] text-[#C6973F] text-[0.68rem] tracking-[0.25em] uppercase font-medium hover:bg-[#C6973F] hover:text-white transition-all duration-300"
          >
            View Collections
          </Link>
        </div>
      </div>

      {/* Scroll hint — inset-x + flex center avoids clip from overflow; rings stay clipped in inner layer */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center gap-2 px-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom,0px))]"
        aria-hidden="true"
      >
        <span className="whitespace-nowrap text-center text-[0.55rem] uppercase text-[#1A1A1A]/35 tracking-[0.16em] sm:tracking-[0.26em]">
          Scroll
        </span>
        <div className="h-10 w-px shrink-0 bg-gradient-to-b from-[#C6973F]/50 to-transparent" />
      </div>
    </section>
  )
}
