import type { Metadata } from 'next'
import { Suspense } from 'react'
import ShopClient from '@/components/ShopClient'
import { PRODUCTS, type Product } from '@/lib/products'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Shop — Aahvani Jewels',
  description:
    'Browse our complete collection of handcrafted jewellery — rings, earrings, necklaces, bracelets and more. Filter by category, price and material.',
}

function mapDbProduct(row: Record<string, unknown>): Product {
  return {
    id:            Number(row.id) || 0,
    name:          String(row.name ?? ''),
    category:      String(row.category ?? ''),
    originalPrice: Number(row.price ?? 0),
    salePrice:     Number(row.discount_price ?? row.price ?? 0),
    material:      String(row.material ?? ''),
    rating:        Number(row.rating ?? 4.0),
    reviews:       Number(row.reviews ?? 0),
    popularity:    Number(row.popularity ?? 50),
    bg:            String(row.bg ?? 'bg-[#F5EBD8]'),
    label:         row.badge as string | undefined,
    sku:           String(row.sku ?? ''),
  }
}

export default async function ShopPage() {
  let products: Product[] = PRODUCTS

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      products = data.map(mapDbProduct)
    }
  } catch {
    // Supabase unavailable — use local fallback silently
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
