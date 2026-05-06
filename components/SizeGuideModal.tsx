'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Info, Ruler } from 'lucide-react'
import {
  BRACELET_SIZES,
  NECKLACE_LENGTHS,
  RING_SIZES,
  type SizeGuideVariant,
} from '@/lib/size-guide-charts'

function ModalSectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-serif text-lg font-semibold text-lux-ink">{title}</h3>
      <p className="text-xs text-lux-ink/50 font-light mt-1 leading-relaxed">{sub}</p>
    </div>
  )
}

function RingChart() {
  return (
    <>
      <ModalSectionTitle
        title="Ring sizes"
        sub="Indian sizes 5–22. Match your finger circumference or diameter (mm)."
      />
      <div className="flex gap-2 p-3 bg-lux-gold/8 border border-lux-gold/15 mb-3 rounded-sm">
        <Info size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
        <p className="text-xs text-lux-ink/60 font-light leading-relaxed">
          Wrap a strip of paper around your finger, mark the overlap, measure length in mm for circumference. Diameter ≈ circumference ÷ 3.14.
        </p>
      </div>
      <div className="overflow-x-auto rounded-sm border border-lux-ink/10">
        <table className="w-full text-left text-sm bg-white">
          <thead>
            <tr className="bg-lux-black text-white">
              <th className="px-3 py-2.5 text-[0.58rem] tracking-[0.15em] uppercase font-semibold">IN</th>
              <th className="px-3 py-2.5 text-[0.58rem] tracking-[0.15em] uppercase font-semibold">Ø mm</th>
              <th className="px-3 py-2.5 text-[0.58rem] tracking-[0.15em] uppercase font-semibold">Circ. mm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lux-ink/6">
            {RING_SIZES.map((r, i) => (
              <tr key={r.indian} className={i % 2 === 0 ? 'bg-white' : 'bg-lux-ivory'}>
                <td className="px-3 py-2 font-semibold text-lux-gold">{r.indian}</td>
                <td className="px-3 py-2 text-lux-ink/70 font-light">{r.diameter}</td>
                <td className="px-3 py-2 text-lux-ink/70 font-light">{r.circumference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[0.65rem] text-lux-ink/45 font-light mt-3 flex gap-2">
        <Ruler size={12} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
        Between sizes — choose the larger. Fingers swell slightly by evening and in warm weather.
      </p>
    </>
  )
}

function NecklaceChart() {
  return (
    <>
      <ModalSectionTitle
        title="Necklace lengths"
        sub="Lengths refer to the chain when closed. Pick based on neckline and look."
      />
      <div className="grid gap-2 mb-3">
        {NECKLACE_LENGTHS.map((n) => (
          <div
            key={n.inches}
            className="flex gap-3 p-3 bg-white border border-lux-ink/8 rounded-sm"
          >
            <div className="flex flex-col items-center flex-shrink-0 w-12 pt-0.5">
              <span className="font-serif text-lg font-bold text-lux-gold leading-none">{n.inches}</span>
              <span className="text-[0.55rem] text-lux-ink/40">{n.cm}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-lux-ink">{n.name}</p>
              <p className="text-[0.65rem] text-lux-ink/50 font-light leading-relaxed mt-0.5">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3 bg-lux-gold/8 border border-lux-gold/15 rounded-sm">
        <Info size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
        <p className="text-xs text-lux-ink/60 font-light leading-relaxed">
          Measure with a soft tape where you want the piece to sit; add 1–2 cm if you prefer a looser hang.
        </p>
      </div>
    </>
  )
}

function BraceletChart() {
  return (
    <>
      <ModalSectionTitle
        title="Bracelet & wrist sizing"
        sub="Use wrist circumference; bangles often need the hand circumference at the knuckles for sliding on."
      />
      <div className="overflow-x-auto rounded-sm border border-lux-ink/10 mb-3">
        <table className="w-full text-left text-sm bg-white">
          <thead>
            <tr className="bg-lux-black text-white">
              <th className="px-3 py-2.5 text-[0.58rem] tracking-[0.15em] uppercase font-semibold">Size</th>
              <th className="px-3 py-2.5 text-[0.58rem] tracking-[0.15em] uppercase font-semibold">Wrist</th>
              <th className="px-3 py-2.5 text-[0.58rem] tracking-[0.15em] uppercase font-semibold">Bracelet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lux-ink/6">
            {BRACELET_SIZES.map((b, i) => (
              <tr key={b.size} className={i % 2 === 0 ? 'bg-white' : 'bg-lux-ivory'}>
                <td className="px-3 py-2 font-semibold text-lux-gold">{b.size}</td>
                <td className="px-3 py-2 text-lux-ink/70 font-light">{b.wrist}</td>
                <td className="px-3 py-2 text-lux-ink/70 font-light">{b.bracelet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 p-3 bg-lux-gold/8 border border-lux-gold/15 rounded-sm">
        <Info size={14} strokeWidth={1.5} className="text-lux-gold flex-shrink-0 mt-0.5" />
        <p className="text-xs text-lux-ink/60 font-light leading-relaxed">
          For closed bangles, measure the widest part of your hand (knuckles) with fingers tucked — that is the minimum inner circumference needed.
        </p>
      </div>
    </>
  )
}

function SetsCharts() {
  return (
    <div className="space-y-8">
      <p className="text-xs text-lux-ink/55 font-light leading-relaxed border-b border-lux-gold/15 pb-4">
        Sets may include multiple piece types. Use the sections below for each component you need to size.
      </p>
      <div>
        <RingChart />
      </div>
      <div className="border-t border-lux-gold/15 pt-6">
        <NecklaceChart />
      </div>
      <div className="border-t border-lux-gold/15 pt-6">
        <BraceletChart />
      </div>
    </div>
  )
}

export default function SizeGuideModal({
  open,
  onClose,
  variant,
}: {
  open: boolean
  onClose: () => void
  variant: SizeGuideVariant
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open || variant === 'earrings') return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-lux-black/45 backdrop-blur-[2px]"
        aria-label="Close size guide"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-modal-title"
        className="relative z-[101] w-full max-w-lg max-h-[88vh] flex flex-col bg-lux-ivory border border-lux-gold/25 shadow-[0_24px_80px_rgba(26,26,26,0.18)] rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between gap-4 px-5 py-4 border-b border-lux-gold/15 bg-lux-ivory">
          <div>
            <p className="text-[0.58rem] tracking-[0.28em] uppercase text-lux-gold font-semibold mb-1">Aahvani</p>
            <h2 id="size-guide-modal-title" className="font-serif text-xl font-semibold text-lux-ink">
              Size guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-lux-ink/10 text-lux-ink/50 hover:border-lux-gold/40 hover:text-lux-gold transition-colors duration-150"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-6">
          {variant === 'rings' && <RingChart />}
          {variant === 'necklaces' && <NecklaceChart />}
          {variant === 'bracelets' && <BraceletChart />}
          {variant === 'sets' && <SetsCharts />}
          {variant === 'other' && (
            <div className="text-center py-2">
              <p className="text-sm text-lux-ink/60 font-light leading-relaxed mb-5">
                For this category we recommend our full reference with illustrations and detailed tips.
              </p>
              <Link
                href="/size-guide"
                onClick={onClose}
                className="inline-flex items-center justify-center px-8 py-3 border border-lux-ink text-lux-ink text-[0.68rem] tracking-[0.2em] uppercase font-medium hover:bg-lux-black hover:text-white transition-colors duration-200"
              >
                Open full size guide
              </Link>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-t border-lux-gold/12 bg-lux-ivory/80">
          <p className="text-[0.62rem] text-lux-ink/40 text-center font-light">
            Still unsure?{' '}
            <Link href="/contact" onClick={onClose} className="text-lux-gold font-medium hover:underline underline-offset-2">
              Contact us
            </Link>
            {' · '}
            <Link href="/size-guide" onClick={onClose} className="text-lux-gold font-medium hover:underline underline-offset-2">
              Full guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
