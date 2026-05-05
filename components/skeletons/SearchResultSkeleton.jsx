export default function SearchResultSkeleton() {
  return (
    <div className="rounded-2xl border border-[#1A1A1A]/8 bg-white p-4">
      <div className="flex items-start gap-4">
        <div className="skeleton-shimmer h-24 w-24 flex-shrink-0 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="skeleton-shimmer h-4 w-3/4 rounded bg-gray-200" />
          <div className="skeleton-shimmer h-4 w-2/3 rounded bg-gray-200" />
          <div className="skeleton-shimmer h-4 w-1/2 rounded bg-gray-200" />
          <div className="skeleton-shimmer h-4 w-1/6 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
