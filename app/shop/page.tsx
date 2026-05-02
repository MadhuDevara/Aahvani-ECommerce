import type { Metadata } from 'next'
import { Suspense } from 'react'
import ShopClient from '@/components/ShopClient'

export const metadata: Metadata = {
  title: 'Shop — Aahvani Jewels',
  description:
    'Browse our complete collection of handcrafted jewellery — rings, earrings, necklaces, bracelets and more. Filter by category, price and material.',
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    }>
      <ShopClient />
    </Suspense>
  )
}
