import type { Metadata } from 'next'
import { Suspense } from 'react'
import ShopClient from '@/components/ShopClient'
import { mapSupabaseRowToProduct, type Product } from '@/lib/products'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop — Aahvani Jewels',
  description:
    'Browse our complete collection of handcrafted jewellery — rings, earrings, necklaces, bracelets and more. Filter by category, price and material.',
}

export default async function ShopPage() {
  let products: Product[] = []

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data?.length) {
      products = data.map(mapSupabaseRowToProduct)
    }
  } catch {
    /* empty list — no static fallback */
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    }>
      <ShopClient initialProducts={products} />
    </Suspense>
  )
}
