export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="skeleton-shimmer aspect-square w-full rounded-2xl bg-gray-200" />
      <div className="mt-4 flex items-center gap-3">
        <div className="skeleton-shimmer h-8 w-8 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-shimmer h-3 w-3/4 rounded bg-gray-200" />
          <div className="skeleton-shimmer h-3 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 skeleton-shimmer h-4 w-1/4 rounded bg-gray-200" />
    </div>
  )
}
