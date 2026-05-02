import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/ProductDetailClient'
import { PRODUCTS } from '@/lib/products'

// Pre-generate a static shell for every known product ID
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = PRODUCTS.find((p) => p.id === Number(id))

  if (!product) {
    return { title: 'Product Not Found — Aahvani Jewels' }
  }

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
  const product = PRODUCTS.find((p) => p.id === Number(id))

  if (!product) notFound()

  return <ProductDetailClient productId={id} />
}
