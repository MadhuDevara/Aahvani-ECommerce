import type { Metadata } from 'next'
import { Ruler, Info } from 'lucide-react'
import { BRACELET_SIZES, NECKLACE_LENGTHS, RING_SIZES } from '@/lib/size-guide-charts'

export const metadata: Metadata = {
  title: 'Size Guide — Aahvani Jewels',
  description: 'Find your perfect jewellery size — ring sizes, necklace lengths, bracelet sizes and measuring guides.',
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-lux-gold/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" /></svg>
      <span className="h-px w-8 bg-lux-gold/40" />
    </div>
  )
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-lux-ink mb-1">{title}</h2>
      <GoldDivider />
      <p className="text-sm text-lux-ink/45 font-light mt-3">{sub}</p>
    </div>
  )
}

export default function SizeGuidePage() {
  return (
    <div className="bg-lux-ivory">

      {/* Hero */}
      <section className="border-b border-lux-gold/10 px-4 py-10 text-center md:py-12">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-lux-gold font-medium mb-3">Fit perfectly</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-lux-ink mb-3">Size Guide</h1>
        <GoldDivider />
        <p className="mt-4 text-sm text-lux-ink/45 font-light max-w-md mx-auto leading-relaxed">
          Use our sizing charts to find your perfect fit across rings, necklaces and bracelets.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── Rings ── */}
        <section>
          <SectionHead
            title="Ring Sizes"
            sub="Indian ring sizes range from 5 to 22. Use the diameter or circumference of your finger to find your size."
          />

          {/* How to measure */}
          <div className="flex gap-3 p-4 bg-lux-gold/6 border border-lux-gold/15 mb-7">
            <Info size={15} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
            <div className="text-sm text-lux-ink/60 font-light leading-relaxed">
              <span className="font-medium text-lux-ink">How to measure: </span>
              Wrap a thin strip of paper or a thread around your finger. Mark where it meets, then measure the length in mm — that is your circumference. Divide by π (3.14) to get your diameter.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white border border-lux-ink/8">
              <thead>
                <tr className="bg-lux-black text-white">
                  <th className="px-5 py-3.5 text-[0.62rem] tracking-[0.2em] uppercase font-semibold">Indian Size</th>
                  <th className="px-5 py-3.5 text-[0.62rem] tracking-[0.2em] uppercase font-semibold">Diameter (mm)</th>
                  <th className="px-5 py-3.5 text-[0.62rem] tracking-[0.2em] uppercase font-semibold">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lux-ink/6">
                {RING_SIZES.map((r, i) => (
                  <tr key={r.indian} className={i % 2 === 0 ? 'bg-white' : 'bg-lux-ivory'}>
                    <td className="px-5 py-3 font-semibold text-lux-gold text-sm">{r.indian}</td>
                    <td className="px-5 py-3 text-sm text-lux-ink/65 font-light">{r.diameter}</td>
                    <td className="px-5 py-3 text-sm text-lux-ink/65 font-light">{r.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-3 p-4 bg-lux-ivory border border-lux-gold/12 mt-5">
            <Ruler size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-lux-ink/50 font-light leading-relaxed">
              <span className="font-medium text-lux-ink">Tip: </span>
              Fingers are slightly larger in the evening and in warm weather. Measure at the end of the day for the most accurate fit. If you are between sizes, choose the larger size.
            </p>
          </div>
        </section>

        {/* ── Necklaces ── */}
        <section>
          <SectionHead
            title="Necklace Lengths"
            sub="Choose your necklace length based on your neckline and personal style. All our necklaces show their length on the product page."
          />

          {/* Visual length guide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {NECKLACE_LENGTHS.map((n) => (
              <div key={n.inches} className="flex items-start gap-4 p-4 bg-white border border-lux-ink/8 hover:border-lux-gold/25 transition-colors">
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                  <span className="font-serif text-xl font-bold text-lux-gold leading-none">{n.inches}</span>
                  <span className="text-[0.58rem] text-lux-ink/35 font-light">{n.cm}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-lux-ink mb-1">{n.name}</p>
                  <p className="text-xs text-lux-ink/50 font-light leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 p-4 bg-lux-gold/6 border border-lux-gold/15">
            <Info size={15} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-lux-ink/60 font-light leading-relaxed">
              <span className="font-medium text-lux-ink">How to measure: </span>
              Use a soft measuring tape and wrap it around your neck at the position where you want the necklace to sit. Add 1–2 cm for comfort.
            </p>
          </div>
        </section>

        {/* ── Bracelets ── */}
        <section>
          <SectionHead
            title="Bracelet Sizes"
            sub="Our bracelets are sized by wrist circumference. Most of our bangles and cuffs are 'Free Size' and fit wrists up to 17 cm comfortably."
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white border border-lux-ink/8">
              <thead>
                <tr className="bg-lux-black text-white">
                  <th className="px-5 py-3.5 text-[0.62rem] tracking-[0.2em] uppercase font-semibold">Size</th>
                  <th className="px-5 py-3.5 text-[0.62rem] tracking-[0.2em] uppercase font-semibold">Wrist Circumference</th>
                  <th className="px-5 py-3.5 text-[0.62rem] tracking-[0.2em] uppercase font-semibold">Bracelet Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lux-ink/6">
                {BRACELET_SIZES.map((b, i) => (
                  <tr key={b.size} className={i % 2 === 0 ? 'bg-white' : 'bg-lux-ivory'}>
                    <td className="px-5 py-3 font-semibold text-lux-gold text-sm">{b.size}</td>
                    <td className="px-5 py-3 text-sm text-lux-ink/65 font-light">{b.wrist}</td>
                    <td className="px-5 py-3 text-sm text-lux-ink/65 font-light">{b.bracelet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 p-4 bg-lux-gold/6 border border-lux-gold/15 mt-5">
            <Info size={15} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-lux-ink/60 font-light leading-relaxed">
              <span className="font-medium text-lux-ink">How to measure: </span>
              Wrap a tape measure around the widest part of your hand (just below your knuckles), keeping your fingers together. This gives your wrist opening size. Add 1–2 cm for a comfortable fit.
            </p>
          </div>
        </section>

        {/* Still unsure */}
        <section className="bg-lux-black p-8 text-center">
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-lux-gold font-medium mb-3">Still unsure?</p>
          <h3 className="font-serif text-2xl font-semibold text-white mb-3">We&apos;re happy to help</h3>
          <p className="text-sm text-white/40 font-light max-w-sm mx-auto leading-relaxed mb-6">
            Contact our team with your measurements and we&apos;ll recommend the perfect size for you.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 border border-lux-gold text-lux-gold text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-lux-gold hover:text-white transition-all duration-200"
          >
            Contact Us
          </a>
        </section>

      </div>
    </div>
  )
}
