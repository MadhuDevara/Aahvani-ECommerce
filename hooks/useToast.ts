'use client'

import { useMemo } from 'react'
import { useToastContext } from '@/components/ui/ToastProvider'

export function useToast() {
  const { addToast, dismissToast } = useToastContext()

  return useMemo(
    () => ({
      toast: {
        success: (message: string, duration?: number) =>
          addToast({ type: 'success', message, duration }),
        error: (message: string, duration?: number) =>
          addToast({ type: 'error', message, duration }),
        info: (message: string, duration?: number) =>
          addToast({ type: 'info', message, duration }),
      },
      dismissToast,
    }),
    [addToast, dismissToast],
  )
}
