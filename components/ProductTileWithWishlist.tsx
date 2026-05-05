'use client'

import Link from 'next/link'
import { Gem, Heart } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

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
  const g = GEM[gemSize]

  return (
    <div className={`relative overflow-hidden ${aspectClassName} ${bgClassName}`}>
      <Link href={href} aria-label={`View ${productName}`} className="block h-full w-full cursor-pointer">
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
      </Link>
      <RippleButton
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
      </RippleButton>
    </div>
  )
}
