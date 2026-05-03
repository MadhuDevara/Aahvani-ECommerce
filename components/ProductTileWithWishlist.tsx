'use client'

import { useRouter } from 'next/navigation'
import { Gem, Heart } from 'lucide-react'

const GEM = {
  sm: { size: 48, stroke: 0.8 as const },
  md: { size: 64, stroke: 0.8 as const },
  lg: { size: 72, stroke: 0.8 as const },
} as const

export type ProductTileGemSize = keyof typeof GEM

type ProductTileWithWishlistProps = {
  href: string
  productName: string
  aspectClassName?: string
  bgClassName: string
  label?: React.ReactNode
  wishlisted: boolean
  onWishlistClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  wishlistPosition?: string
  gemSize?: ProductTileGemSize
  wishlistButtonClassName?: string
}

/**
 * Image tile: no &lt;Link&gt; on the image — div + router.push only.
 * Heart uses stopPropagation so it never triggers navigation.
 */
export default function ProductTileWithWishlist({
  href,
  productName,
  aspectClassName = 'aspect-square',
  bgClassName,
  label,
  wishlisted,
  onWishlistClick,
  wishlistPosition = 'top-3 right-3',
  gemSize = 'md',
  wishlistButtonClassName = 'h-8 w-8',
}: ProductTileWithWishlistProps) {
  const router = useRouter()
  const g = GEM[gemSize]

  return (
    <div
      role="presentation"
      className={`relative cursor-pointer overflow-hidden ${aspectClassName} ${bgClassName}`}
      onClick={() => router.push(href)}
    >
      <div className="pointer-events-none relative z-0 h-full w-full">
        {label}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.14]"
          aria-hidden="true"
        >
          <Gem size={g.size} strokeWidth={g.stroke} className="text-[#C6973F]" />
        </div>
        <div
          className="absolute inset-0 bg-[#C6973F]/0 transition-colors duration-300 group-hover:bg-[#C6973F]/4"
          aria-hidden="true"
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onWishlistClick(e)
        }}
        title={wishlisted ? 'Remove from wishlist' : `Save ${productName} to wishlist`}
        className={`absolute ${wishlistPosition} z-10 flex ${wishlistButtonClassName} cursor-pointer items-center justify-center bg-white/85 transition-colors duration-200 hover:bg-white`}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={gemSize === 'sm' ? 12 : 14}
          strokeWidth={1.5}
          className={wishlisted ? 'fill-[#C6973F] text-[#C6973F]' : 'text-[#1A1A1A]/50'}
        />
      </button>
    </div>
  )
}
