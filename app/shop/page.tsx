import type { Metadata } from 'next'
import ShopClient from '@/components/ShopClient'

export const metadata: Metadata = {
  title: 'Shop — Aahvani Jewels',
  description:
    'Browse our complete collection of handcrafted jewellery — rings, earrings, necklaces, bracelets and more. Filter by category, price and material.',
}

export default function ShopPage() {
  return <ShopClient />
}
