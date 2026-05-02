'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ChevronRight, ShoppingBag, Gem, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/lib/wishlistStore'
import { useCartStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'
import { inr } from '@/lib/products'

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-8 bg-[#C6973F]/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" /></svg>
      <span className="h-px w-8 bg-[#C6973F]/40" />
    </div>
  )
}

export default function WishlistPage() {
  const router = useRouter()
  const [mounted,   setMounted]   = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [addedIds,  setAddedIds]  = useState<Set<string>>(new Set())

  const items             = useWishlistStore((s) => s.items)
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist)
  const clearWishlist     = useWishlistStore((s) => s.clearWishlist)
  const addToCart         = useCartStore((s) => s.addToCart)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace('/auth/login'); return }
      setAuthReady(true)
    })
  }, [router])

  const handleAddToCart = (item: typeof items[number]) => {
    addToCart({
      id:            item.id,
      name:          item.name,
      price:         item.price,
      originalPrice: item.originalPrice,
      quantity:      1,
      size:          'Free Size',
      category:      item.category,
      bg:            item.bg,
    })
    setAddedIds((prev) => new Set(prev).add(item.id))
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(item.id); return n }), 1500)
  }

  if (!mounted || !authReady) {
    return (
      <div className="min-h-[60vh] bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* Header */}
      <div className="bg-[#FDF6EC] border-b border-[#C6973F]/12 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/40 mb-4">
            <Link href="/" className="hover:text-[#C6973F] transition-colors">Home</Link>
            <ChevronRight size={11} strokeWidth={1.5} />
            <span className="text-[#C6973F]">My Wishlist</span>
          </nav>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A] flex items-center gap-3">
                My Wishlist
                {items.length > 0 && (
                  <span className="text-[0.65rem] font-semibold px-2.5 py-1 bg-[#C6973F]/12 text-[#C6973F] rounded-full font-sans">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => { if (window.confirm('Clear entire wishlist?')) clearWishlist() }}
                className="text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[#1A1A1A]/35 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={12} strokeWidth={1.5} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#C6973F]/10 flex items-center justify-center">
                <Heart size={34} strokeWidth={1} className="text-[#C6973F]/50" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-2">Your wishlist is empty</h2>
              <GoldDivider />
              <p className="text-sm text-[#1A1A1A]/45 font-light leading-relaxed my-5">
                Save pieces you love to your wishlist.<br />They&apos;ll be waiting for you here.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200"
              >
                Explore Collection
                <ChevronRight size={13} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => {
              const discount = item.originalPrice > item.price
                ? Math.round((1 - item.price / item.originalPrice) * 100)
                : 0
              const added = addedIds.has(item.id)

              return (
                <div key={item.id} className="group bg-white border border-[#1A1A1A]/8 hover:shadow-[0_8px_32px_rgba(198,151,63,0.1)] hover:border-[#C6973F]/20 transition-all duration-300">
                  {/* Image */}
                  <Link href={`/shop/${item.id}`}>
                    <div className={`relative aspect-square ${item.bg} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.14]" aria-hidden="true">
                        <Gem size={72} strokeWidth={0.8} className="text-[#C6973F]" />
                      </div>
                      <div className="absolute inset-0 bg-[#C6973F]/0 group-hover:bg-[#C6973F]/4 transition-colors duration-300" />
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-emerald-500 text-white font-medium">
                          {discount}% off
                        </span>
                      )}
                      {/* Remove button */}
                      <button
                        onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id) }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-red-50 transition-colors duration-200 border border-transparent hover:border-red-100"
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={14} strokeWidth={1.5} className="fill-[#C6973F] text-[#C6973F]" />
                      </button>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-[0.62rem] tracking-[0.15em] uppercase text-[#1A1A1A]/35 font-medium mb-1">
                      {item.category}
                    </p>
                    <Link href={`/shop/${item.id}`}>
                      <h3 className="font-serif text-base font-medium text-[#1A1A1A] mb-3 group-hover:text-[#C6973F] transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-[#C6973F] font-semibold text-sm">{inr(item.price)}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-[#1A1A1A]/30 text-xs line-through">{inr(item.originalPrice)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 border text-[0.65rem] tracking-[0.16em] uppercase font-medium transition-all duration-200 ${
                          added
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-[#C6973F] text-[#C6973F] hover:bg-[#C6973F] hover:text-white'
                        }`}
                      >
                        <ShoppingBag size={12} strokeWidth={1.5} />
                        {added ? 'Added!' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-10 flex items-center justify-center border border-[#1A1A1A]/12 text-[#1A1A1A]/30 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                        aria-label="Remove"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
