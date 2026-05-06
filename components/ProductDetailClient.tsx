'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  ChevronRight,
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  PackageCheck,
  Copy,
  Check,
  Gem,
  Droplet,
  Sun,
  ZapOff,
  Sparkles,
} from 'lucide-react'
import { inr, productRouteId, type Product } from '@/lib/products'
import { sizeGuideVariantFromCategory } from '@/lib/size-guide-charts'
import ProductTileWithWishlist from '@/components/ProductTileWithWishlist'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore, wishlistItemFromProduct } from '@/lib/wishlistStore'
import { loginPath } from '@/lib/login-path'
import { hasAuthSession } from '@/lib/has-auth-session'
import SizeGuideModal from '@/components/SizeGuideModal'
import RippleButton from '@/components/ui/RippleButton'

// ─── Thumbnail image variants (simulate 4 angles of the same product) ─────────

const THUMB_BG = [
  'bg-lux-ivory-muted',
  'bg-lux-ivory-deep',
  'bg-lux-ivory',
  'bg-lux-ivory-muted',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSizes(category: string): string[] {
  if (category === 'Rings')     return ['S (5)', 'M (6)', 'L (7)', 'XL (8)', 'Free Size']
  if (category === 'Necklaces') return ['16"', '18"', '20"', '22"', '24"']
  return ['S', 'M', 'L', 'XL', 'Free Size']
}

function getDetails(p: Product) {
  const metal =
    p.material === 'Gold Plated' ? 'Brass'
    : p.material === 'Silver'    ? 'Sterling Silver'
    : 'Alloy'

  const plating =
    p.material === 'Gold Plated' ? '22K Gold Micro-Plating'
    : p.material === 'Silver'    ? 'Rhodium'
    : p.material

  const stone =
    p.name.toLowerCase().includes('pearl')   ? 'Fresh Water Pearl'
    : p.name.toLowerCase().includes('polki') ? 'Polki (Uncut Diamond)'
    : p.name.toLowerCase().includes('kundan')? 'Glass Kundan'
    : p.material === 'Oxidised'              ? 'None'
    : 'Cubic Zirconia'

  return [
    { label: 'Metal',    value: metal },
    { label: 'Plating',  value: plating },
    { label: 'Stone',    value: stone },
    { label: 'Weight',   value: 'Approx. 8–14g' },
    { label: 'Occasion', value: 'Wedding, Festive, Party, Daily' },
    { label: 'Style',    value: 'Traditional, Ethnic, Contemporary' },
  ]
}

// ─── Share: WhatsApp SVG ──────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── Related product card (compact) ──────────────────────────────────────────

function RelatedCard({ product }: { product: Product }) {
  const router         = useRouter()
  const pathname       = usePathname()
  const addToCart      = useCartStore((s) => s.addToCart)
  const wishlistItems  = useWishlistStore((s) => s.items)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const wishlisted     = wishlistItems.some((i) => i.id === productRouteId(product))
  const discount = Math.round((1 - product.salePrice / product.originalPrice) * 100)
  return (
    <div className="group bg-white hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--lux-gold)_12%,transparent)] transition-shadow duration-300 flex-shrink-0 w-52 sm:w-auto">
      <ProductTileWithWishlist
        href={`/shop/${encodeURIComponent(productRouteId(product))}`}
        productName={product.name}
        bgClassName={product.bg}
        wishlisted={wishlisted}
        gemSize="sm"
        wishlistPosition="top-2 right-2"
        wishlistButtonClassName="h-7 w-7"
        onWishlistClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void (async () => {
            const ok = await toggleWishlist(wishlistItemFromProduct(product))
            if (!ok && !(await hasAuthSession())) {
              router.push(loginPath(pathname || '/shop'))
            }
          })()
        }}
        label={
          product.label ? (
            <span className="pointer-events-none absolute top-2 left-2 text-[0.55rem] tracking-[0.12em] uppercase px-2 py-0.5 bg-lux-gold text-white font-medium">
              {product.label}
            </span>
          ) : null
        }
      />
      <div className="p-3.5">
        <Link href={`/shop/${encodeURIComponent(productRouteId(product))}`}>
          <h3 className="font-serif text-[0.88rem] font-medium text-lux-ink mb-2 group-hover:text-lux-gold transition-colors duration-200 leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lux-gold font-semibold text-sm">{inr(product.salePrice)}</span>
          <span className="text-lux-ink/30 text-xs line-through">{inr(product.originalPrice)}</span>
          <span className="text-[0.58rem] text-emerald-600 font-medium">{discount}% off</span>
        </div>
        <RippleButton
          onClick={async () => {
            const ok = await addToCart({
              id:            productRouteId(product),
              name:          product.name,
              price:         product.salePrice,
              originalPrice: product.originalPrice,
              quantity:      1,
              size:          'Free Size',
              category:      product.category,
              bg:            product.bg,
            })
            if (!ok && !(await hasAuthSession())) {
              router.push(loginPath(pathname || '/shop'))
            }
          }}
          className="w-full py-2 border border-lux-gold text-lux-gold text-[0.62rem] tracking-[0.15em] uppercase font-medium hover:bg-lux-gold hover:text-white transition-all duration-200"
        >
          Add to Cart
        </RippleButton>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: Product[]
}) {
  const router            = useRouter()
  const pathname          = usePathname()
  const [selectedThumb, setSelectedThumb] = useState(0)
  const [selectedSize, setSelectedSize]   = useState('')
  const [quantity, setQuantity]           = useState(1)
  const [activeTab, setActiveTab]         = useState('Description')
  const wishlistItems   = useWishlistStore((s) => s.items)
  const toggleWishlist  = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted    = wishlistItems.some((i) => i.id === productRouteId(product))
  const [copied, setCopied]               = useState(false)
  const [addedToCart, setAddedToCart]     = useState(false)
  const [sizeError, setSizeError]         = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [pageUrl, setPageUrl]             = useState('')

  const addToCart = useCartStore((s) => s.addToCart)
  const sizeGuideVariant = sizeGuideVariantFromCategory(product.category)

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size']
  const sortedSizes =
    product.sizes && product.sizes.length > 0
      ? [...product.sizes].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
      : getSizes(product.category)
  const details = getDetails(product)
  const discount = Math.round((1 - product.salePrice / product.originalPrice) * 100)

  const whatsappShareHref = pageUrl
    ? `https://wa.me/?text=${encodeURIComponent(pageUrl)}`
    : '#'

  const copyLink = () => {
    const url = pageUrl || window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    const ok = await addToCart({
      id:            productRouteId(product),
      name:          product.name,
      price:         product.salePrice,
      originalPrice: product.originalPrice,
      quantity,
      size:          selectedSize,
      category:      product.category,
      bg:            product.bg,
    })
    if (!ok) {
      if (!(await hasAuthSession())) router.push(loginPath(pathname || '/shop'))
      return
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const mainBg = THUMB_BG[selectedThumb]

  return (
    <div className="bg-white">

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="border-b border-lux-gold/12 bg-lux-ivory px-4 py-2.5 md:py-3">
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[min(100%,var(--lux-max))] flex-wrap items-center gap-1.5 text-xs text-lux-ink/40">
          <Link href="/" className="hover:text-lux-gold transition-colors duration-150">Home</Link>
          <ChevronRight size={11} strokeWidth={1.5} className="flex-shrink-0" />
          <Link href="/shop" className="hover:text-lux-gold transition-colors duration-150">Shop</Link>
          <ChevronRight size={11} strokeWidth={1.5} className="flex-shrink-0" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-lux-gold transition-colors duration-150">
            {product.category}
          </Link>
          <ChevronRight size={11} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-lux-gold truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* ── Product section ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── LEFT — Image gallery ─────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 self-start">
            {/* Main image */}
            <div className={`relative aspect-square ${mainBg} overflow-hidden cursor-zoom-in group mb-3`}>
              {product.label && (
                <span className="absolute top-4 left-4 z-10 text-[0.6rem] tracking-[0.14em] uppercase px-3 py-1 bg-lux-gold text-white font-medium">
                  {product.label}
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Gem size={140} strokeWidth={0.55} className="text-lux-gold opacity-[0.18]" />
              </div>
              {/* Zoom hint */}
              <span className="absolute bottom-3 right-3 text-[0.58rem] tracking-[0.15em] uppercase text-lux-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Zoom
              </span>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {THUMB_BG.map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`aspect-square ${bg} relative overflow-hidden transition-all duration-200 ${
                    selectedThumb === i
                      ? 'ring-2 ring-lux-gold ring-offset-1'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gem size={28} strokeWidth={0.8} className="text-lux-gold opacity-30" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Product info ─────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Badge + Name + Rating */}
            <div>
              {product.label && (
                <span className="inline-block text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 bg-lux-gold/12 text-lux-gold font-semibold mb-3">
                  {product.label}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-lux-ink leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-lux-gold text-lux-gold'
                          : 'fill-lux-ink/10 text-lux-ink/10'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-lux-gold">{product.rating}</span>
                <span className="text-sm text-lux-ink/40 font-light">
                  ({product.reviews.toLocaleString('en-IN')} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-serif text-3xl font-semibold text-lux-gold">
                {inr(product.salePrice)}
              </span>
              <span className="text-lux-ink/30 text-lg line-through font-light">
                {inr(product.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-white bg-emerald-500 px-2 py-0.5">
                {discount}% OFF
              </span>
            </div>

            {/* Material + SKU */}
            <div className="flex items-center gap-5 text-xs text-lux-ink/45 font-light tracking-wide">
              <span>Material: <span className="text-lux-ink">{product.material}</span></span>
              <span className="h-3 w-px bg-lux-black/20" aria-hidden="true" />
              <span>SKU: <span className="text-lux-ink">{product.sku}</span></span>
            </div>

            <div className="h-px bg-lux-ink/8" />

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[0.68rem] tracking-[0.22em] uppercase text-lux-ink font-medium">
                  {product.category === 'Necklaces' ? 'Length' : 'Size'}
                </p>
                {sizeGuideVariant !== 'earrings' && (
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[0.65rem] text-lux-gold underline underline-offset-2 hover:no-underline transition-all duration-150"
                  >
                    Size Guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sortedSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false) }}
                    className={`px-4 py-2 text-xs font-medium tracking-wide border transition-all duration-150 ${
                      selectedSize === size
                        ? 'border-lux-gold bg-lux-gold text-white'
                        : 'border-lux-ink/20 text-lux-ink/60 hover:border-lux-gold hover:text-lux-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && !selectedSize && (
                <p className="text-[0.62rem] text-red-500 mt-2 font-medium">
                  Please select a size to continue
                </p>
              )}
              {!selectedSize && !sizeError && (
                <p className="text-[0.62rem] text-lux-gold/70 mt-2">Please select a size</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <p className="text-[0.68rem] tracking-[0.22em] uppercase text-lux-ink font-medium mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-0">
                <RippleButton
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center border border-lux-ink/20 text-lux-ink/50 hover:border-lux-gold hover:text-lux-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </RippleButton>
                <span className="w-14 h-10 flex items-center justify-center border-y border-lux-ink/20 text-sm font-medium text-lux-ink select-none">
                  {quantity}
                </span>
                <RippleButton
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="w-10 h-10 flex items-center justify-center border border-lux-ink/20 text-lux-ink/50 hover:border-lux-gold hover:text-lux-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </RippleButton>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <RippleButton
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-lux-gold text-white text-[0.72rem] tracking-[0.2em] uppercase font-medium hover:bg-lux-gold-hover active:bg-lux-gold-hover transition-all duration-200"
              >
                {addedToCart ? (
                  <>
                    <Check size={15} strokeWidth={2} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} strokeWidth={1.5} />
                    Add to Cart
                  </>
                )}
              </RippleButton>
              <RippleButton
                onClick={() => {
                  void (async () => {
                    const ok = await toggleWishlist(wishlistItemFromProduct(product))
                    if (!ok && !(await hasAuthSession())) {
                      router.push(loginPath(pathname || '/shop'))
                    }
                  })()
                }}
                className={`flex-1 sm:flex-none sm:px-6 flex items-center justify-center gap-2 py-4 border text-[0.72rem] tracking-[0.2em] uppercase font-medium transition-all duration-200 ${
                  isWishlisted
                    ? 'bg-lux-gold/10 border-lux-gold text-lux-gold'
                    : 'border-lux-gold text-lux-gold hover:bg-lux-gold/8'
                }`}
              >
                <Heart
                  size={15}
                  strokeWidth={1.5}
                  className={isWishlisted ? 'fill-lux-gold' : ''}
                />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </RippleButton>
            </div>

            {/* Delivery info */}
            <div className="border border-lux-ink/8 divide-y divide-lux-ink/8">
              {[
                { Icon: Truck,          text: 'Free delivery on orders above ₹999'   },
                { Icon: PackageCheck,   text: 'Delivery in 3–5 business days'        },
                { Icon: RotateCcw,      text: 'Easy 7-day returns & exchange'        },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 px-4 py-3">
                  <Icon size={15} strokeWidth={1.5} className="text-lux-gold flex-shrink-0" />
                  <span className="text-xs text-lux-ink/55 font-light tracking-wide">{text}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[0.62rem] tracking-[0.25em] uppercase text-lux-ink/40 font-medium">
                Share
              </span>
              <a
                href={whatsappShareHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (!pageUrl) e.preventDefault() }}
                className="w-8 h-8 flex items-center justify-center border border-lux-ink/15 text-emerald-600 hover:border-emerald-600 transition-colors duration-150"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <button
                onClick={copyLink}
                className="w-8 h-8 flex items-center justify-center border border-lux-ink/15 text-lux-ink/40 hover:border-lux-gold hover:text-lux-gold transition-colors duration-150"
                aria-label="Copy link"
              >
                {copied
                  ? <Check size={14} strokeWidth={2} className="text-emerald-500" />
                  : <Copy size={14} strokeWidth={1.5} />
                }
              </button>
              {copied && (
                <span className="text-[0.62rem] text-emerald-500 font-medium">Link copied!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Product tabs ──────────────────────────────────────────────────── */}
      <div className="border-t border-lux-ink/8 bg-white">
        <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 sm:px-6 lg:px-8">

          {/* Tab headers */}
          <div className="flex border-b border-lux-ink/8 overflow-x-auto">
            {['Description', 'Details', 'Care Instructions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-6 py-4 text-[0.72rem] tracking-[0.15em] uppercase font-medium border-b-2 -mb-px transition-colors duration-150 ${
                  activeTab === tab
                    ? 'border-lux-gold text-lux-gold'
                    : 'border-transparent text-lux-ink/45 hover:text-lux-ink'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="max-w-3xl py-8 md:py-10">

            {/* Description */}
            {activeTab === 'Description' && (
              <div className="space-y-5">
                {product.description?.trim() ? (
                  <div className="text-lux-ink/65 text-sm leading-[1.9] font-light whitespace-pre-wrap">
                    {product.description.trim()}
                  </div>
                ) : (
                  <>
                    <p className="text-lux-ink/65 text-sm leading-[1.9] font-light">
                      The <strong className="text-lux-ink font-medium">{product.name}</strong> is a timeless
                      piece inspired by the royal jewellery traditions of Rajasthan. Each piece is carefully handcrafted
                      by skilled artisans using age-old Kundan setting techniques, ensuring no two pieces are exactly alike.
                      The intricate detailing and careful finishing make this an heirloom-quality jewellery piece,
                      perfect for adding a touch of regal elegance to any ensemble.
                    </p>
                    <p className="text-lux-ink/65 text-sm leading-[1.9] font-light">
                      Whether gifted to a loved one or cherished for yourself, this piece embodies the rich
                      heritage of Indian craftsmanship — a true invitation to elegance.
                    </p>
                    <ul className="space-y-2.5 pt-2">
                      {[
                        'Handcrafted by skilled artisans using traditional techniques',
                        `${product.material} finish for lasting lustre and durability`,
                        'Lightweight and comfortable for all-day wear',
                        'Suitable for weddings, festivals, and special occasions',
                        'Comes in a premium Aahvani gift box',
                        'Certificate of authenticity included',
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-lux-gold flex-shrink-0" />
                          <span className="text-sm text-lux-ink/65 font-light leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {/* Details */}
            {activeTab === 'Details' && (
              <div className="overflow-hidden border border-lux-ink/8">
                <table className="w-full text-sm">
                  <tbody>
                    {details.map(({ label, value }, i) => (
                      <tr
                        key={label}
                        className={i % 2 === 0 ? 'bg-lux-ivory/50' : 'bg-white'}
                      >
                        <td className="px-5 py-3.5 text-[0.68rem] tracking-[0.18em] uppercase text-lux-ink/50 font-medium w-36 align-top">
                          {label}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-lux-ink/80 font-light">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Care Instructions */}
            {activeTab === 'Care Instructions' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    Icon: Droplet,
                    title: 'Keep Away from Water',
                    desc: 'Remove before bathing, swimming, or washing hands to prevent tarnishing.',
                  },
                  {
                    Icon: Sun,
                    title: 'Avoid Direct Sunlight',
                    desc: 'Store away from direct sunlight and heat to maintain colour and finish.',
                  },
                  {
                    Icon: ZapOff,
                    title: 'No Chemicals',
                    desc: 'Keep away from perfumes, lotions, and cleaning chemicals.',
                  },
                  {
                    Icon: Sparkles,
                    title: 'Clean Gently',
                    desc: 'Wipe with a soft, dry cloth after each use to remove oils and dust.',
                  },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 p-5 bg-lux-ivory">
                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-lux-gold/12">
                      <Icon size={17} strokeWidth={1.5} className="text-lux-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-lux-ink mb-1">{title}</p>
                      <p className="text-xs text-lux-ink/50 font-light leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2 flex gap-3 p-4 bg-lux-gold/8 border border-lux-gold/20 mt-2">
                  <span className="text-lux-gold flex-shrink-0 mt-0.5">
                    <Sparkles size={14} strokeWidth={1.5} />
                  </span>
                  <p className="text-xs text-lux-ink/60 font-light leading-relaxed">
                    <strong className="text-lux-ink/80 font-medium">Storage tip:</strong> Store each piece
                    separately in the provided pouch or an airtight zip-lock bag to prevent scratching and
                    slow down tarnishing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
      <div className="border-t border-lux-gold/12 bg-lux-ivory py-12 md:py-14">
        <div className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-lux-gold mb-3">Discover More</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-lux-ink">
              You May Also Like
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4" aria-hidden="true">
              <span className="h-px w-8 bg-lux-gold" />
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" />
              </svg>
              <span className="h-px w-8 bg-lux-gold" />
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
            {relatedProducts.map((p) => (
              <RelatedCard key={productRouteId(p)} product={p} />
            ))}
          </div>
        </div>
      </div>
      )}

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        variant={sizeGuideVariant}
      />
    </div>
  )
}
