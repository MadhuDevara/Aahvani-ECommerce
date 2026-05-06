'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

function ScrollProgressInner() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left bg-lux-gold/90 mix-blend-multiply"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}

export default function ScrollProgress() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return <ScrollProgressInner />
}
