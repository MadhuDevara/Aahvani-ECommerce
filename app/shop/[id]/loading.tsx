import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton'

export default function Loading() {
  return (
    <div className="flex min-h-[40dvh] items-center justify-center bg-white py-12">
      <ProductDetailSkeleton />
    </div>
  )
}
