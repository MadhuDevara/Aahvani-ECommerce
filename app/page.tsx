import Hero from '@/components/Hero'
import Marquee from '@/components/ui/Marquee'
import Categories from '@/components/Categories'
import FeaturedProducts from '@/components/FeaturedProducts'
import Banner from '@/components/Banner'
import Testimonials from '@/components/Testimonials'

const MARQUEE_ITEMS = [
  'Handcrafted in India',
  'Ethically sourced materials',
  'Timeless artistry',
  'Complimentary shipping over ₹999',
  '30-day returns',
]

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee>
        {MARQUEE_ITEMS.map((label) => (
          <span key={label} className="inline-flex items-center gap-3">
            <span className="text-lux-gold/50" aria-hidden>
              ✦
            </span>
            {label}
          </span>
        ))}
      </Marquee>
      <Categories />
      <FeaturedProducts />
      <Banner />
      <Testimonials />
    </>
  )
}
