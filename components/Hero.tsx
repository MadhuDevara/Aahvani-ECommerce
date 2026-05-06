'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--lux-nav-h))] flex-col justify-center overflow-hidden px-4 pb-12 pt-4 supports-[min-height:100dvh]:min-h-[calc(100dvh-var(--lux-nav-h))] sm:pb-14 sm:pt-6 md:pb-16 md:pt-8">
      <div className="lux-gradient-mesh absolute inset-0" aria-hidden="true" />
      <div
        className="lux-hero-radials pointer-events-none absolute inset-0 opacity-[0.45] md:opacity-[0.4]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-24 top-16 h-[min(70vw,400px)] w-[min(70vw,400px)] rounded-full border border-lux-gold/10" />
        <div className="absolute -bottom-28 -left-24 h-[min(75vw,420px)] w-[min(75vw,420px)] rounded-full border border-lux-black/6" />
      </div>

      <div className="relative mx-auto max-w-4xl py-8 text-center sm:py-10 md:max-w-[52rem] md:py-12">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-3 text-[0.62rem] uppercase tracking-[0.55em] text-lux-gold md:mb-3.5 md:tracking-[0.58em]"
        >
          Aahvani Jewels
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.02em] text-lux-black sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.85rem]"
        >
          An Invitation
          <br />
          <span className="bg-gradient-to-r from-lux-ink via-lux-stone-dark to-lux-ink bg-clip-text text-transparent">
            to Elegance
          </span>
        </motion.h1>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-4 mt-5 flex items-center justify-center gap-3 md:mb-5 md:mt-6"
          aria-hidden="true"
        >
          <span className="h-px w-14 shrink-0 bg-gradient-to-r from-transparent to-lux-gold/85" />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-lux-gold">
            <path
              d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          <span className="h-px w-14 shrink-0 bg-gradient-to-l from-transparent to-lux-gold/85" />
        </motion.div>

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-7 max-w-xl px-2 text-xs font-light uppercase tracking-[0.3em] text-lux-ink-muted md:mx-auto md:mb-8 md:text-[0.8125rem] md:tracking-[0.32em]"
        >
          Handcrafted jewellery for every moment that matters
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/shop"
            className="group relative inline-flex w-52 items-center justify-center overflow-hidden border border-lux-black bg-lux-black px-10 py-4 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-lux-ivory transition sm:w-auto"
          >
            <span
              className="absolute inset-0 origin-left scale-x-0 bg-lux-gold transition-transform duration-500 ease-out group-hover:scale-x-100"
              aria-hidden
            />
            <span className="relative z-10">Shop now</span>
          </Link>
          <Link
            href="/collections"
            className="w-52 border border-lux-black/12 bg-lux-elevated/80 px-10 py-4 text-center text-[0.68rem] font-medium uppercase tracking-[0.24em] text-lux-ink backdrop-blur-sm transition hover:border-lux-gold/45 hover:text-lux-gold sm:w-auto"
          >
            Collections
          </Link>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-10 flex flex-col items-center gap-1 px-4 sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]"
        aria-hidden="true"
      >
        <span className="whitespace-nowrap text-center text-[0.52rem] uppercase tracking-[0.22em] text-lux-ink-subtle sm:tracking-[0.28em]">
          Scroll
        </span>
        <motion.div
          className="h-9 w-px shrink-0 bg-gradient-to-b from-lux-gold/55 to-transparent"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
    </section>
  )
}
