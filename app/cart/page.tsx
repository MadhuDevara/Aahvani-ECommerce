import type { Metadata } from 'next'
import CartClient from '@/components/CartClient'

export const metadata: Metadata = {
  title: 'Cart — Aahvani Jewels',
  description: 'Review your selected items and proceed to checkout.',
}

export default function CartPage() {
  return <CartClient />
}
