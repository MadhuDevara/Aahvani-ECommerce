'use client'

import type { ReactNode } from 'react'
import { CartDrawerProvider } from '@/components/cart/cart-drawer-context'
import { ToastProvider } from '@/components/ui/ToastProvider'

export function LuxuryProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartDrawerProvider>
        {children}
      </CartDrawerProvider>
    </ToastProvider>
  )
}
