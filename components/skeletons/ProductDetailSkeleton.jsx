export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div>
          <div className="skeleton-shimmer aspect-square w-full rounded-2xl bg-gray-200" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer aspect-square rounded bg-gray-200" />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="skeleton-shimmer h-7 w-full rounded bg-gray-200" />
            <div className="skeleton-shimmer h-7 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="skeleton-shimmer h-6 w-1/4 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="skeleton-shimmer h-3 w-full rounded bg-gray-200" />
            <div className="skeleton-shimmer h-3 w-11/12 rounded bg-gray-200" />
            <div className="skeleton-shimmer h-3 w-4/5 rounded bg-gray-200" />
            <div className="skeleton-shimmer h-3 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="skeleton-shimmer h-12 w-full rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
