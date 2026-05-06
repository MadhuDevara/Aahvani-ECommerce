'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Package, LogOut, User, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore } from '@/lib/wishlistStore'
import { loginPath } from '@/lib/login-path'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { inr, productRouteId, type Product } from '@/lib/products'
import { supabaseSearchProducts } from '@/lib/product-search'
import { useIsClient } from '@/lib/use-is-client'
import { useCartDrawer } from '@/components/cart/cart-drawer-context'
import { SHOP_NAV_CATEGORIES } from '@/lib/shop-nav'
import ShopDropdown from '@/components/navigation/ShopDropdown'

const NAV_LINKS = [
  { href: '/',            label: 'Home'        },
  { href: '/shop',        label: 'Shop'        },
  { href: '/collections', label: 'Collections' },
  { href: '/about',       label: 'About'       },
  { href: '/contact',     label: 'Contact'     },
]

const DROPDOWN_ITEMS = [
  { href: '/profile',  Icon: User,    label: 'My Profile' },
  { href: '/orders',   Icon: Package, label: 'My Orders'  },
  { href: '/wishlist', Icon: Heart,   label: 'Wishlist'   },
]

export default function Navbar() {
  const router   = useRouter()
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin') ?? false

  const [isScrolled, setIsScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const mounted = useIsClient()
  const [user, setUser]               = useState<SupabaseUser | null>(null)
  const [dropdownOpen, setDropdown]   = useState(false)

  /** Desktop Shop dropdown: JS + delay for crossing from label to panel */
  const [shopMegaOpen, setShopMegaOpen]   = useState(false)
  const shopMegaCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openShopMega = useCallback(() => {
    if (shopMegaCloseTimerRef.current) {
      clearTimeout(shopMegaCloseTimerRef.current)
      shopMegaCloseTimerRef.current = null
    }
    setShopMegaOpen(true)
  }, [])

  const scheduleCloseShopMega = useCallback(() => {
    shopMegaCloseTimerRef.current = setTimeout(() => {
      setShopMegaOpen(false)
      shopMegaCloseTimerRef.current = null
    }, 240)
  }, [])

  useEffect(() => {
    if (!shopMegaOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (shopMegaCloseTimerRef.current) {
          clearTimeout(shopMegaCloseTimerRef.current)
          shopMegaCloseTimerRef.current = null
        }
        setShopMegaOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [shopMegaOpen])

  useEffect(
    () => () => {
      if (shopMegaCloseTimerRef.current) clearTimeout(shopMegaCloseTimerRef.current)
    },
    [],
  )

  // Search
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchNavResults, setSearchNavResults] = useState<Product[]>([])
  const [searchNavLoading, setSearchNavLoading] = useState(false)
  const [popularTerms, setPopularTerms] = useState<string[]>([])

  useEffect(() => {
    if (!searchOpen) return
    void supabase.from('products').select('category').then(({ data }) => {
      const cats = [...new Set(data?.map((r) => r.category).filter(Boolean) as string[])]
      setPopularTerms(cats)
    })
  }, [searchOpen])

  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) return
    let cancelled = false
    const t = setTimeout(() => {
      if (cancelled) return
      setSearchNavLoading(true)
      supabaseSearchProducts(q, 6)
        .then((rows) => {
          if (!cancelled) setSearchNavResults(rows)
        })
        .finally(() => {
          if (!cancelled) setSearchNavLoading(false)
        })
    }, 280)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [searchQuery])

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 60)
  }, [])

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setSearchQuery('')
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    closeSearch()
  }

  // Close search on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch() }
    if (searchOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen, closeSearch])

  // Lock body scroll when search open
  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [searchOpen])

  const { openDrawer }  = useCartDrawer()
  const cartCount       = useCartStore((s) => s.getItemCount())
  const wishlistItems   = useWishlistStore((s) => s.items)
  const wishlistCount  = wishlistItems.length
  const showCartBadges = mounted && user && cartCount > 0
  const showWlBadges   = mounted && user && wishlistCount > 0
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ── Scroll shadow ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Auth session (cart/wishlist sync via store listeners) ────────────────────
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(data.session?.user ?? null)
      })
      .catch(() => {
        setUser(null)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = () => {
    setDropdown(false)
    setUser(null)
    void useWishlistStore.getState().switchUser(null)
    void useCartStore.getState().switchCartUser(null)
    // Local scope clears session immediately — never wait on a hung network request
    void supabase.auth.signOut({ scope: 'local' })
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'

  // Don't render Navbar on admin pages — admin has its own sidebar
  if (isAdmin) return null

  const navLinkClass =
    'text-[0.65rem] font-medium tracking-[0.2em] uppercase text-lux-ink/78 transition-colors duration-300 hover:text-lux-gold relative inline-block pb-0.5 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-lux-gold after:transition-transform after:duration-300 hover:after:scale-x-100'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-[background,box-shadow,border-color,backdrop-filter] duration-500 ease-out ${
        isScrolled
          ? 'border-b border-lux-black/8 bg-lux-elevated/88 shadow-[var(--lux-shadow-nav)] backdrop-blur-xl supports-[backdrop-filter]:bg-lux-ivory/82'
          : 'border-b border-transparent bg-lux-ivory/40 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto max-w-[min(100%,var(--lux-max))] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[var(--lux-nav-h)] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-serif text-2xl md:text-[1.75rem] font-semibold tracking-[0.08em] text-lux-gold transition-opacity duration-200 group-hover:opacity-80">
              Aahvani
            </span>
            <span className="hidden md:block text-[0.55rem] tracking-[0.22em] uppercase text-lux-ink-muted font-sans mt-0.5 ml-0.5">
              An Invitation to Elegance
            </span>
          </Link>

          {/* Desktop nav — Shop compact dropdown */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-10">
            {NAV_LINKS.map((link) =>
              link.href === '/shop' ? (
                <li key={link.href}>
                  <div
                    className="relative"
                    onMouseEnter={openShopMega}
                    onMouseLeave={scheduleCloseShopMega}
                  >
                    <Link href="/shop" className={navLinkClass}>
                      {link.label}
                    </Link>
                    <ShopDropdown
                      open={shopMegaOpen}
                      onMouseEnter={openShopMega}
                      onMouseLeave={scheduleCloseShopMega}
                    />
                  </div>
                </li>
              ) : (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* Right-side actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="text-lux-ink hover:text-lux-gold transition-colors duration-200 p-1"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist${showWlBadges ? `, ${wishlistCount} items` : ''}`}
              className="relative text-lux-ink hover:text-lux-gold transition-colors duration-200 p-1"
            >
              <Heart size={18} strokeWidth={1.5} />
              {showWlBadges && (
                <span className="absolute -top-1 -right-1 bg-lux-gold text-white text-[0.6rem] font-semibold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-0.5 leading-none">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => openDrawer()}
              aria-label={`Open shopping bag${showCartBadges ? `, ${cartCount} items` : ''}`}
              aria-haspopup="dialog"
              className="relative text-lux-ink hover:text-lux-gold transition-colors duration-200 p-1"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {showCartBadges && (
                <span className="absolute -top-1 -right-1 bg-lux-gold text-white text-[0.6rem] font-semibold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-0.5 leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Auth area — desktop */}
            {mounted && (
              user ? (
                /* ── Logged-in: avatar + dropdown ── */
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdown((v) => !v)}
                    className="flex items-center gap-1.5 group"
                    aria-label="Account menu"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lux-gold text-[0.7rem] font-semibold tracking-[0.06em] text-white shadow-[0_2px_8px_color-mix(in_srgb,var(--lux-gold)_35%,transparent)] ring-1 ring-white/25 transition-[background-color,box-shadow] duration-300 group-hover:bg-lux-gold-hover">
                      {userInitial}
                    </span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.25}
                      className={`shrink-0 text-lux-ink/32 transition-[color,transform] duration-300 ease-out group-hover:text-lux-gold/55 ${dropdownOpen ? 'rotate-180 text-lux-gold/70' : ''}`}
                      aria-hidden
                    />
                  </button>

                  {/* Dropdown — boutique glass panel */}
                  {dropdownOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-[110] mt-3 min-w-[15rem] overflow-hidden rounded-2xl border border-lux-black/[0.06] bg-lux-elevated/95 shadow-[0_12px_48px_color-mix(in_srgb,var(--lux-black)_10%,transparent),0_2px_12px_color-mix(in_srgb,var(--lux-black)_4%,transparent)] ring-1 ring-white/50 backdrop-blur-xl supports-[backdrop-filter]:bg-lux-ivory/75"
                    >
                      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-lux-gold/25 to-transparent" aria-hidden />

                      {/* User info */}
                      <div className="relative border-b border-lux-gold/[0.12] px-5 py-4">
                        <p className="font-sans text-[0.55rem] font-medium uppercase tracking-[0.32em] text-lux-ink/40">
                          Signed in as
                        </p>
                        <p className="mt-2 truncate font-serif text-[0.9375rem] font-medium leading-snug tracking-[0.02em] text-lux-ink">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      <ul className="space-y-0.5 p-2">
                        {DROPDOWN_ITEMS.map(({ href, Icon, label }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              role="menuitem"
                              onClick={() => setDropdown(false)}
                              className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.6875rem] font-medium tracking-[0.08em] text-lux-ink/72 transition-colors duration-200 hover:bg-lux-ivory-muted/90 hover:text-lux-ink"
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-lux-black/[0.05] bg-white/40 text-lux-ink/45 transition-[border-color,color,background-color] duration-200 group-hover/item:border-lux-gold/25 group-hover/item:bg-lux-gold/[0.06] group-hover/item:text-lux-gold">
                                <Icon size={15} strokeWidth={1.35} aria-hidden />
                              </span>
                              <span className="min-w-0">{label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Sign out — palette-aligned, not alert red */}
                      <div className="border-t border-lux-gold/[0.12] p-2 pt-1.5">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleSignOut}
                          className="group/out flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.6875rem] font-medium tracking-[0.08em] text-lux-stone transition-colors duration-200 hover:bg-lux-ivory-muted/80 hover:text-lux-ink"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-lux-black/[0.05] bg-white/30 text-lux-stone transition-[border-color,color,background-color] duration-200 group-hover/out:border-lux-ink/12 group-hover/out:text-lux-ink">
                            <LogOut size={15} strokeWidth={1.35} aria-hidden />
                          </span>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Guest: Login button ── */
                <Link
                  href={loginPath(pathname || '/')}
                  className="hidden md:inline-flex items-center px-4 py-1.5 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-lux-gold border border-lux-gold hover:bg-lux-gold hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
              )
            )}

            {/* Hamburger — mobile only */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="md:hidden text-lux-ink hover:text-lux-gold transition-colors duration-200 p-1 -mr-1"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[40rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-lux-gold/20 bg-lux-ivory/95 px-6 py-6 backdrop-blur-sm">
          <ul className="mb-6 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.72rem] font-medium tracking-[0.2em] uppercase text-lux-ink/85 transition-colors duration-200 hover:text-lux-gold"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mb-6 border-t border-lux-gold/15 pt-6">
            <p className="mb-3 text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-lux-ink/35">
              Shop by category
            </p>
            <ul className="flex flex-col gap-2">
              {SHOP_NAV_CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm text-lux-ink/70 transition hover:text-lux-gold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile auth section */}
          {mounted && (
            user ? (
              <div className="space-y-3 pt-4 border-t border-lux-gold/15">
                <p className="text-[0.6rem] tracking-[0.2em] uppercase text-lux-ink/35 font-medium">
                  {user.email}
                </p>
                {DROPDOWN_ITEMS.map(({ href, Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-[0.75rem] font-medium tracking-wide text-lux-ink/65 hover:text-lux-gold transition-colors duration-150"
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => { handleSignOut(); setMobileOpen(false) }}
                  className="flex items-center gap-2 border-t border-lux-gold/10 pt-4 text-[0.75rem] font-medium tracking-[0.06em] text-lux-stone transition-colors duration-200 hover:text-lux-ink"
                >
                  <LogOut size={14} strokeWidth={1.35} />
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href={loginPath(pathname || '/')}
                className="inline-flex items-center gap-2 px-5 py-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-lux-gold border border-lux-gold hover:bg-lux-gold hover:text-white transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                <User size={13} strokeWidth={1.5} />
                Login
              </Link>
            )
          )}
        </div>
      </div>
      {/* ── Search modal ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[999] flex flex-col">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeSearch}
            aria-label="Close search"
          />

          {/* Modal panel — premium glass */}
          <div className="relative z-10 mx-4 mt-16 max-h-[min(78vh,720px)] overflow-hidden rounded-3xl border border-white/40 bg-white/92 shadow-[0_32px_100px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:mx-auto md:mt-24 md:w-full md:max-w-2xl">
            {/* Input row */}
            <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-lux-black/10">
              <Search size={18} strokeWidth={1.5} className="ml-5 text-lux-gold flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery…"
                className="flex-1 px-4 py-4 text-base text-lux-ink placeholder-lux-ink/30 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-2 w-7 h-7 flex items-center justify-center text-lux-ink/25 hover:text-lux-ink/60 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={closeSearch}
                className="mr-4 w-8 h-8 flex items-center justify-center text-lux-ink/30 hover:text-lux-ink/60 transition-colors border border-lux-black/10 hover:border-lux-black/20"
                aria-label="Close"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </form>

            {/* Live results */}
            {searchQuery.trim() && (
              <div className="max-h-[60vh] overflow-y-auto">
                {searchNavLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-7 h-7 border-2 border-lux-gold/25 border-t-lux-gold rounded-full animate-spin" />
                  </div>
                ) : searchNavResults.length > 0 ? (
                  <>
                    <div className="divide-y divide-lux-black/5">
                      {searchNavResults.map((p) => (
                        <Link
                          key={productRouteId(p)}
                          href={`/shop/${encodeURIComponent(productRouteId(p))}`}
                          onClick={closeSearch}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-lux-ivory transition-colors group"
                        >
                          {/* Colour swatch */}
                          <div className={`w-10 h-10 flex-shrink-0 ${p.bg} flex items-center justify-center`}>
                            <span className="text-lux-gold/30 text-lg">◈</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-lux-ink group-hover:text-lux-gold transition-colors truncate">
                              {p.name}
                            </p>
                            <p className="text-[0.65rem] text-lux-ink/40 font-light mt-0.5">
                              {p.category} · {p.material}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-lux-gold">{inr(p.salePrice)}</p>
                            {p.label && (
                              <span className="text-[0.55rem] font-bold tracking-wide bg-lux-gold/12 text-lux-gold px-1.5 py-0.5 rounded">
                                {p.label}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    {/* View all results */}
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={closeSearch}
                      className="flex items-center justify-center gap-2 py-3.5 bg-lux-ivory-muted border-t border-lux-black/6 text-[0.68rem] tracking-[0.18em] uppercase font-medium text-lux-gold hover:bg-lux-ivory transition-colors"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                      <ArrowRight size={12} strokeWidth={1.5} />
                    </Link>
                  </>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-lux-ink/35 font-light">
                      No matches in catalogue for &ldquo;<span className="text-lux-ink/60 font-medium">{searchQuery}</span>&rdquo;
                    </p>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={closeSearch}
                      className="inline-flex items-center gap-1.5 mt-3 text-[0.68rem] text-lux-gold hover:text-lux-gold-hover font-medium transition-colors"
                    >
                      Search anyway
                      <ArrowRight size={11} strokeWidth={1.5} />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Empty state hint */}
            {!searchQuery.trim() && (
              <div className="px-5 py-6">
                {popularTerms.length > 0 && (
                  <>
                    <p className="text-[0.62rem] tracking-[0.2em] uppercase text-lux-ink/30 font-semibold mb-3">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularTerms.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 border border-lux-black/10 text-xs text-lux-ink/50 hover:border-lux-gold/40 hover:text-lux-gold transition-all duration-150"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <p className="text-[0.6rem] text-lux-ink/25 font-light mt-5">
                  Press <kbd className="px-1.5 py-0.5 bg-lux-black/6 rounded text-[0.6rem]">Enter</kbd> to see all results · <kbd className="px-1.5 py-0.5 bg-lux-black/6 rounded text-[0.6rem]">Esc</kbd> to close
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
