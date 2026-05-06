'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import Toast, { type ToastPayload, type ToastType } from '@/components/ui/Toast'

export type AddToastInput = {
  type: ToastType
  message: string
  duration?: number
}

type ToastItem = ToastPayload & { id: string; duration: number }

type ToastContextValue = {
  addToast: (input: AddToastInput) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider')
  return ctx
}

const MAX_VISIBLE = 3
const DEFAULT_DURATION = 3500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const clearTimer = useCallback((id: string) => {
    const t = timers.current.get(id)
    if (t) {
      clearTimeout(t)
      timers.current.delete(id)
    }
  }, [])

  const dismissToast = useCallback(
    (id: string) => {
      clearTimer(id)
      setToasts((prev) => prev.filter((t) => t.id !== id))
    },
    [clearTimer],
  )

  const addToast = useCallback(
    (input: AddToastInput) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const duration = input.duration ?? DEFAULT_DURATION

      setToasts((prev) => {
        let next = [...prev, { ...input, id, duration }]
        if (next.length > MAX_VISIBLE) {
          const dropped = next.slice(0, next.length - MAX_VISIBLE)
          dropped.forEach((d) => {
            clearTimer(d.id)
          })
          next = next.slice(-MAX_VISIBLE)
        }
        return next
      })

      clearTimer(id)
      const tid = setTimeout(() => dismissToast(id), duration)
      timers.current.set(id, tid)
    },
    [clearTimer, dismissToast],
  )

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t))
      timers.current.clear()
    },
    [],
  )

  const value = useMemo(() => ({ addToast, dismissToast }), [addToast, dismissToast])

  const portal =
    mounted &&
    createPortal(
      <div
        role="status"
        aria-live="polite"
        aria-relevant="additions text"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((t) => (
            <Toast
              key={t.id}
              id={t.id}
              type={t.type}
              message={t.message}
              duration={t.duration}
              onDismiss={() => dismissToast(t.id)}
            />
          ))}
        </AnimatePresence>
      </div>,
      document.body,
    )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {portal}
    </ToastContext.Provider>
  )
}
