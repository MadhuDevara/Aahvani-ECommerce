import { useCallback, useRef, useState } from 'react'

export function useRipple(duration = 600) {
  const [ripples, setRipples] = useState([])
  const nextId = useRef(0)

  const createRipple = useCallback((event, host) => {
    if (!host) return

    const rect = host.getBoundingClientRect()
    const source = 'touches' in event && event.touches?.length > 0 ? event.touches[0] : event
    const x = source.clientX - rect.left
    const y = source.clientY - rect.top
    const size = Math.max(rect.width, rect.height, 600)

    const id = nextId.current++
    const ripple = { id, x, y, size }

    setRipples((prev) => [...prev, ripple])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, duration)
  }, [duration])

  return { ripples, createRipple }
}
