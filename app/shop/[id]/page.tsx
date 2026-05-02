import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/ProductDetailClient'
import { PRODUCTS, type Product } from '@/lib/products'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Pre-generate static shells for known product IDs (extended at runtime via Supabase)
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }))
}

async function getProduct(id: string): Promise<Product | null> {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      return {
        id:            Number(data.id) || 0,
        name:          String(data.name ?? ''),
        category:      String(data.category ?? ''),
        originalPrice: Number(data.price ?? 0),
        salePrice:     Number(data.discount_price ?? data.price ?? 0),
        material:      String(data.material ?? ''),
        rating:        Number(data.rating ?? 4.0),
        reviews:       Number(data.reviews ?? 0),
        popularity:    Number(data.popularity ?? 50),
        bg:            String(data.bg ?? 'bg-[#F5EBD8]'),
        label:         data.badge as string | undefined,
        sku:           String(data.sku ?? ''),
      }
    }
  } catch {
    // Supabase unavailable
  }

  // Fall back to local data
  return PRODUCTS.find((p) => p.id === Number(id)) ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) return { title: 'Product Not Found — Aahvani Jewels' }

  return {
    title: `${product.name} — Aahvani Jewels`,
    description: `Shop ${product.name} — handcrafted ${product.material} jewellery at Aahvani Jewels. ₹${product.salePrice.toLocaleString('en-IN')} only.`,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  return <ProductDetailClient productId={id} />
}
