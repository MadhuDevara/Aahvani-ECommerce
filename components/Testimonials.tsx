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
    <section className="py-24 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[#C6973F] mb-4">Reviews</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-[#1A1A1A] mb-5">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-[#C6973F]" />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z" fill="#C6973F" />
            </svg>
            <span className="h-px w-10 bg-[#C6973F]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map(({ id, review, name, location, initials }) => (
            <div key={id} className="relative bg-[#FDF6EC] p-8">
              {/* Decorative quote mark */}
              <span
                className="absolute top-4 right-6 font-serif text-7xl leading-none text-[#C6973F]/12 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-[#C6973F] text-[#C6973F]" />
                ))}
              </div>

              <p className="text-[#1A1A1A]/60 text-sm leading-[1.85] mb-6 font-light">
                &ldquo;{review}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-[#C6973F]/15">
                <div className="w-9 h-9 rounded-full bg-[#C6973F]/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C6973F] text-[0.65rem] font-semibold tracking-wide">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="text-[#1A1A1A] text-sm font-medium">{name}</p>
                  <p className="text-[#1A1A1A]/35 text-xs mt-0.5 tracking-wide">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
