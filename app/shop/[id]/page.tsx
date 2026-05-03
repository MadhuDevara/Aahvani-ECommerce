import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/ProductDetailClient'
import { mapSupabaseRowToProduct, productRouteId, type Product } from '@/lib/products'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getProduct(id: string): Promise<Product | null> {
  const decoded = decodeURIComponent(id)

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', decoded)
      .single()

    if (!error && data) {
      return mapSupabaseRowToProduct(data as Record<string, unknown>)
    }
  } catch {
    /* not found */
  }

  return null
}

async function fetchRelatedProducts(
  category: string,
  excludeDbId: string,
  take: number
): Promise<Product[]> {
  if (!category.trim() || !excludeDbId.trim()) return []
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', excludeDbId)
      .limit(take)

    if (error || !data?.length) return []
    return data.map((row) => mapSupabaseRowToProduct(row as Record<string, unknown>))
  } catch {
    return []
  }
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

  const dbId = product.routeId ?? productRouteId(product)
  const related = await fetchRelatedProducts(product.category, dbId, 8)

  return <ProductDetailClient product={product} relatedProducts={related.slice(0, 4)} />
}
