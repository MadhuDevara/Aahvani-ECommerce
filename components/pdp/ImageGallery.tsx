'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion'

export type GallerySlide = {
  src: string
  alt: string
  /** Optional Tailwind background behind image (e.g. product card swatch) */
  surfaceClassName?: string
}

type ImageGalleryProps = {
  productName: string
  label?: string
  slides: GallerySlide[]
}

const PLACEHOLDER = '/file.svg'

function buildSlides(productName: string, incoming: GallerySlide[]): GallerySlide[] {
  const base =
    incoming.length > 0
      ? incoming
      : [{ src: PLACEHOLDER, alt: productName, surfaceClassName: 'bg-lux-ivory-muted' }]
  const out: GallerySlide[] = [...base]
  const padSurface = base[0]?.surfaceClassName ?? 'bg-lux-ivory-muted'
  while (out.length < 4) {
    out.push({
      src: PLACEHOLDER,
      alt: `${productName} — view ${out.length + 1}`,
      surfaceClassName: padSurface,
    })
  }
  return out.slice(0, 4)
}

export default function ImageGallery({ productName, label, slides: slidesProp }: ImageGalleryProps) {
  const slides = useMemo(() => buildSlides(productName, slidesProp), [productName, slidesProp])
  const [active, setActive] = useState(0)
  const [trackW, setTrackW] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const xMv = useMotionValue(0)
  const maxDrag = Math.max(0, (slides.length - 1) * trackW)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setTrackW(el.clientWidth))
    ro.observe(el)
    setTrackW(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (trackW <= 0) return
    void animate(xMv, -active * trackW, { type: 'spring', stiffness: 380, damping: 38 })
  }, [active, trackW, xMv])

  const mainSizes =
    '(max-width: 1023px) 100vw, (max-width: 1536px) 58vw, min(48rem, 58vw)'
  const thumbSizes = '64px'

  return (
    <div className="w-full">
      {/* Desktop: filmstrip + hero */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-12 lg:gap-5">
        <div className="flex flex-col gap-2 lg:col-span-2">
          {slides.map((slide, i) => (
            <button
              key={`d-thumb-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square w-full overflow-hidden ring-1 transition duration-200 ${
                active === i
                  ? 'ring-lux-gold ring-offset-2 ring-offset-lux-ivory'
                  : 'ring-lux-black/10 opacity-80 hover:opacity-100'
              } ${slide.surfaceClassName ?? 'bg-lux-ivory-muted'}`}
              aria-label={`Show image ${i + 1} of ${slides.length}`}
              aria-pressed={active === i}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes={thumbSizes}
                className="object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </button>
          ))}
        </div>

        <div
          className={`relative aspect-square overflow-hidden lg:col-span-10 ${slides[active]?.surfaceClassName ?? 'bg-lux-ivory-muted'}`}
        >
          {label ? (
            <span className="absolute left-4 top-4 z-[2] bg-lux-gold px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-lux-ivory">
              {label}
            </span>
          ) : null}
          <div className="group relative h-full w-full overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <motion.div className="relative h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-[1.08]">
                  <Image
                    src={slides[active]?.src ?? PLACEHOLDER}
                    alt={slides[active]?.alt ?? productName}
                    fill
                    priority={active === 0}
                    loading={active === 0 ? 'eager' : 'lazy'}
                    sizes={mainSizes}
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div ref={trackRef} className="w-full lg:hidden">
        <div className="relative aspect-square w-full overflow-hidden bg-lux-ivory-muted">
          {label ? (
            <span className="absolute left-3 top-3 z-[2] bg-lux-gold px-2.5 py-0.5 text-[0.55rem] font-medium uppercase tracking-[0.14em] text-lux-ivory">
              {label}
            </span>
          ) : null}
          <motion.div
            className="relative flex h-full cursor-grab touch-pan-y active:cursor-grabbing"
            style={{ x: xMv }}
            drag="x"
            dragConstraints={trackW > 0 ? { left: -maxDrag, right: 0 } : { left: 0, right: 0 }}
            dragElastic={0.07}
            onDragEnd={() => {
              if (trackW <= 0) return
              const x = xMv.get()
              const approx = Math.round(-x / trackW)
              setActive(Math.max(0, Math.min(slides.length - 1, approx)))
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={`m-${i}`}
                className={`relative h-full shrink-0 overflow-hidden ${slide.surfaceClassName ?? 'bg-lux-ivory-muted'}`}
                style={{ width: trackW > 0 ? trackW : '100%' }}
              >
                <div className="group relative h-full w-full overflow-hidden">
                  <motion.div className="relative h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-[1.08]">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              className={`h-2 w-2 rounded-full transition-colors ${
                i === active ? 'bg-lux-gold' : 'bg-lux-stone-mid/50'
              }`}
              onClick={() => setActive(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === active}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
