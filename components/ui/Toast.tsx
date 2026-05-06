'use client'

import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'info'

export type ToastPayload = {
  type: ToastType
  message: string
}

type ToastProps = ToastPayload & {
  id: string
  duration: number
  onDismiss: () => void
}

function Icon({ type }: { type: ToastType }) {
  if (type === 'success') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-lux-gold">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.25" className="opacity-35" />
        <path
          d="M7.5 12.5l2.8 2.8L16.5 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'error') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-lux-ivory/75">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.25" className="opacity-45" />
        <path
          d="M15 9l-6 6M9 9l6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-lux-gold">
      <circle cx="12" cy="12" r="4" fill="currentColor" className="opacity-90" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.1" className="opacity-35" />
    </svg>
  )
}

export default function Toast({ id, type, message, duration, onDismiss }: ToastProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = barRef.current
    if (!el) return
    el.style.transition = 'none'
    el.style.width = '100%'
    void el.offsetWidth
    requestAnimationFrame(() => {
      el.style.transition = `width ${duration}ms linear`
      el.style.width = '0%'
    })
  }, [duration, id])

  return (
    <motion.div
      layout
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.85 }}
      className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-sm border border-lux-gold/30 bg-lux-black shadow-[var(--lux-shadow-nav)]"
    >
      <div className="flex items-center gap-3 px-4 py-3 pr-2">
        <Icon type={type} />
        <p className="min-w-0 flex-1 text-center text-sm font-medium leading-snug text-lux-ivory">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-lux-ivory/70 transition hover:bg-lux-ivory/10 hover:text-lux-ivory"
          aria-label="Dismiss notification"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="h-0.5 w-full bg-lux-black">
        <div
          ref={barRef}
          className="h-full bg-lux-gold/80"
          style={{ width: '100%' }}
          aria-hidden
        />
      </div>
    </motion.div>
  )
}
