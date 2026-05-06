'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

const SHOW_AFTER = 420

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollUp}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="fixed bottom-6 right-6 z-[190] flex h-12 w-12 items-center justify-center rounded-full border border-lux-gold bg-lux-black text-lux-ivory shadow-[var(--lux-shadow-nav)] focus:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lux-ivory md:bottom-8 md:right-10"
          aria-label="Back to top"
        >
          <motion.span
            className="inline-flex"
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            <ChevronUp size={22} strokeWidth={1.5} className="text-lux-gold" aria-hidden />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
