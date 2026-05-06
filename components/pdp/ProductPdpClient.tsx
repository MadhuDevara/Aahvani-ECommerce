'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronRight, ShoppingBag, Check } from 'lucide-react'
import { inr, productRouteId } from '@/lib/products'
import type { Product } from '@/types/product'
import { useCartStore } from '@/lib/cartStore'
import { loginPath } from '@/lib/login-path'
import { hasAuthSession } from '@/lib/has-auth-session'
import ImageGallery, { type GallerySlide } from '@/components/pdp/ImageGallery'
import StickyAddToCart from '@/components/pdp/StickyAddToCart'
import AccordionDetails from '@/components/pdp/AccordionDetails'
import ProductRail from '@/components/pdp/ProductRail'
import RippleButton from '@/components/ui/RippleButton'
import { useToast } from '@/hooks/useToast'

function getSizes(category: string): string[] {
  if (category === 'Rings') return ['S (5)', 'M (6)', 'L (7)', 'XL (8)', 'Free Size']
  if (category === 'Necklaces') return ['16"', '18"', '20"', '22"', '24"']
  return ['S', 'M', 'L', 'XL', 'Free Size']
}

const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size']

function SizePicker({
  sizes,
  label,
  value,
  onChange,
  error,
}: {
  sizes: string[]
  label: string
  value: string
  onChange: (s: string) => void
  error: boolean
}) {
  return (
    <div>
      <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-lux-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`px-4 py-2 text-xs font-medium tracking-wide transition duration-150 ${
              value === size
                ? 'border border-lux-gold bg-lux-gold text-lux-ivory'
                : 'border border-lux-black/15 text-lux-ink-muted hover:border-lux-gold hover:text-lux-gold'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {error && !value ? (
        <p className="mt-2 text-[0.62rem] font-medium text-red-600">Please select a size to continue</p>
      ) : null}
    </div>
  )
}

function buildGallerySlides(product: Product): GallerySlide[] {
  const surfaces = [
    product.bg,
    'bg-lux-ivory-muted',
    'bg-lux-ivory-deep',
    'bg-lux-elevated',
  ]
  return surfaces.map((surface, i) => ({
    src: '/file.svg',
    alt: `${product.name} — view ${i + 1}`,
    surfaceClassName: surface,
  }))
}

export default function ProductPdpClient({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: Product[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const addToCart = useCartStore((s) => s.addToCart)
  const { toast } = useToast()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const [selectedSize, setSelectedSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)

  const sortedSizes =
    product.sizes && product.sizes.length > 0
      ? [...product.sizes].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
      : getSizes(product.category)

  const sizeLabel = product.category === 'Necklaces' ? 'Length' : 'Size'

  const handleAdd = async (): Promise<boolean> => {
    if (!selectedSize) {
      setSizeError(true)
      return false
    }
    setSizeError(false)
    const ok = await addToCart({
      id: productRouteId(product),
      name: product.name,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      quantity: 1,
      size: selectedSize,
      category: product.category,
      bg: product.bg,
    })
    if (!ok) {
      if (!(await hasAuthSession())) router.push(loginPath(pathname || '/shop'))
      return false
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    return true
  }

  const discount =
    product.originalPrice > 0
      ? Math.max(0, Math.round((1 - product.salePrice / product.originalPrice) * 100))
      : 0

  return (
    <>
      <StickyAddToCart
        sentinelRef={sentinelRef}
        product={product}
        selectedSize={selectedSize}
        onAddToBag={handleAdd}
        disabled={!selectedSize}
      />

      <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 pb-[var(--lux-section-y)] pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-lux-ink-subtle">
          <Link href="/" className="transition hover:text-lux-gold">
            Home
          </Link>
          <ChevronRight size={11} strokeWidth={1.5} className="flex-shrink-0" aria-hidden />
          <Link href="/shop" className="transition hover:text-lux-gold">
            Shop
          </Link>
          <ChevronRight size={11} strokeWidth={1.5} className="flex-shrink-0" aria-hidden />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="transition hover:text-lux-gold"
          >
            {product.category}
          </Link>
          <ChevronRight size={11} strokeWidth={1.5} className="flex-shrink-0" aria-hidden />
          <span className="max-w-[14rem] truncate text-lux-gold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="lg:col-span-7">
            <ImageGallery
              productName={product.name}
              label={product.label}
              slides={buildGallerySlides(product)}
            />
            <div ref={sentinelRef} className="h-px w-full translate-y-3" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-[var(--lux-sticky-top)] lg:col-span-5 lg:self-start">
            {product.label ? (
              <span className="inline-block w-fit bg-lux-gold/12 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-lux-gold">
                {product.label}
              </span>
            ) : null}

            <h1 className="font-serif text-3xl font-semibold leading-tight text-lux-ink md:text-4xl">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-3xl font-semibold text-lux-gold">{inr(product.salePrice)}</span>
              {product.originalPrice > product.salePrice ? (
                <span className="text-lg font-light text-lux-ink-subtle line-through">
                  {inr(product.originalPrice)}
                </span>
              ) : null}
              {discount > 0 ? (
                <span className="bg-lux-ink px-2 py-0.5 text-xs font-medium text-lux-ivory">{discount}% off</span>
              ) : null}
            </div>

            <p className="text-xs font-light tracking-wide text-lux-ink-muted">
              <span className="text-lux-ink">SKU</span> {product.sku} · {product.material}
            </p>

            <div className="h-px bg-lux-black/8" aria-hidden />

            <SizePicker
              label={sizeLabel}
              sizes={sortedSizes}
              value={selectedSize}
              onChange={(s) => {
                setSelectedSize(s)
                setSizeError(false)
              }}
              error={sizeError}
            />

            <RippleButton
              type="button"
              onClick={async () => {
                const ok = await handleAdd()
                if (ok) toast.success('Added to bag')
              }}
              className="flex w-full items-center justify-center gap-2 bg-lux-black py-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-lux-ivory transition hover:bg-lux-black/90"
            >
              {added ? (
                <>
                  <Check size={16} strokeWidth={2} aria-hidden />
                  Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={1.5} aria-hidden />
                  Add to bag
                </>
              )}
            </RippleButton>

            <AccordionDetails product={product} />
          </div>
        </div>
      </div>

      <ProductRail products={relatedProducts} />

      <div className="lux-gradient-mesh relative min-h-[200px] border-t border-lux-black/8">
        <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="font-serif text-2xl font-medium italic text-lux-ink md:text-3xl">
            Crafted for quiet luxury
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light text-lux-ink-muted">
            Each piece is finished by hand and inspected before it leaves our studio.
          </p>
        </div>
      </div>
    </>
  )
}
