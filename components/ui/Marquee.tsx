'use client'

import { Children, cloneElement, isValidElement, type ReactNode } from 'react'

type MarqueeProps = {
  children: ReactNode
  className?: string
  /** Duplicate content for seamless loop */
  duplicate?: boolean
}

/**
 * Horizontal ticker; pause on hover. Respects reduced motion via CSS.
 */
export default function Marquee({ children, className = '', duplicate = true }: MarqueeProps) {
  const kids = Children.toArray(children)
  return (
    <div
      className={`group relative w-full overflow-hidden border-y border-lux-gold/15 bg-lux-black py-3 text-lux-ivory ${className}`}
    >
      <div className="lux-marquee-track flex w-max gap-16 px-6 font-sans text-[0.65rem] font-medium uppercase tracking-[0.35em] text-lux-ivory/85 md:gap-24 md:text-[0.68rem]">
        <div className="flex shrink-0 items-center gap-16 md:gap-24">{children}</div>
        {duplicate ? (
          <div className="flex shrink-0 items-center gap-16 md:gap-24" aria-hidden="true">
            {kids.map((child, i) =>
              isValidElement(child)
                ? cloneElement(child, { key: `marquee-dup-${i}` })
                : child,
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
