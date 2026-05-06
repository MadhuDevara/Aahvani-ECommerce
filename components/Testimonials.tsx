import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    review:
      "The quality is unmatched. I've been wearing my Aahvani ring every day for a year and it still shines like new. Truly exceptional craftsmanship.",
    name: 'Priya Sharma',
    location: 'Mumbai',
    initials: 'PS',
  },
  {
    id: 2,
    review:
      "Ordered a necklace set for my wedding. It was absolutely breathtaking. Every guest complimented it. I will definitely be ordering again!",
    name: 'Meera Patel',
    location: 'Delhi',
    initials: 'MP',
  },
  {
    id: 3,
    review:
      "The attention to detail in their jewellery is remarkable. Each piece feels truly handcrafted with immense love and precision.",
    name: 'Kavya Reddy',
    location: 'Bangalore',
    initials: 'KR',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-white px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[min(100%,var(--lux-max))]">
        {/* Header */}
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-[0.6rem] uppercase tracking-[0.4em] text-lux-gold">Reviews</p>
          <h2 className="font-serif text-3xl font-semibold text-lux-ink md:text-4xl lg:text-[2.75rem]">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-lux-gold" />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z" fill="var(--lux-gold)" />
            </svg>
            <span className="h-px w-10 bg-lux-gold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map(({ id, review, name, location, initials }) => (
            <div key={id} className="relative bg-lux-ivory p-7 md:p-9">
              {/* Decorative quote mark */}
              <span
                className="absolute top-4 right-6 font-serif text-7xl leading-none text-lux-gold/12 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-lux-gold text-lux-gold" />
                ))}
              </div>

              <p className="text-lux-ink/60 text-sm leading-[1.85] mb-6 font-light">
                &ldquo;{review}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-lux-gold/15">
                <div className="w-9 h-9 rounded-full bg-lux-gold/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-lux-gold text-[0.65rem] font-semibold tracking-wide">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="text-lux-ink text-sm font-medium">{name}</p>
                  <p className="text-lux-ink/35 text-xs mt-0.5 tracking-wide">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
