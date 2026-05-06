import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductPdpClient from '@/components/pdp/ProductPdpClient'
import { fetchProductByPdpSegment, fetchRelatedForPdp } from '@/lib/fetch-product-pdp'
import { productRouteId } from '@/lib/products'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductByPdpSegment(slug)

  if (!product) return { title: 'Product Not Found — Aahvani Jewels' }

  return {
    title: `${product.name} — Aahvani Jewels`,
    description: `Shop ${product.name} — handcrafted ${product.material} jewellery at Aahvani Jewels. ${product.salePrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}.`,
  }
}

export default async function ProductBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await fetchProductByPdpSegment(slug)

  if (!product) notFound()

  const dbId = product.routeId ?? productRouteId(product)
  const related = await fetchRelatedForPdp(product.category, dbId, 8)

  return <ProductPdpClient product={product} relatedProducts={related} />
}
