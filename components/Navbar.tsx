'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Package, LogOut, User, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useWishlistStore } from '@/lib/wishlistStore'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { PRODUCTS, inr } from '@/lib/products'

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
  const [mounted, setMounted]         = useState(false)
  const [user, setUser]               = useState<SupabaseUser | null>(null)
  const [dropdownOpen, setDropdown]   = useState(false)

  // Search
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchResults = searchQuery.trim().length > 0
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

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

  const cartCount      = useCartStore((s) => s.getItemCount())
  const wishlistItems  = useWishlistStore((s) => s.items)
  const switchUser     = useWishlistStore((s) => s.switchUser)
  const wishlistCount  = wishlistItems.length
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ── Mount + hydration guard ─────────────────────────────────────────────────
  useEffect(() => { setMounted(true) }, [])

  // ── Scroll shadow ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Auth session ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      switchUser(u?.email ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      switchUser(u?.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [switchUser])

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
    void switchUser(null)
    // Local scope clears session immediately — never wait on a hung network request
    void supabase.auth.signOut({ scope: 'local' })
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'

  // Don't render Navbar on admin pages — admin has its own sidebar
  if (isAdmin) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
          : 'bg-[#FDF6EC]'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-serif text-2xl md:text-[1.75rem] font-semibold tracking-[0.08em] text-[#C6973F] transition-opacity duration-200 group-hover:opacity-80">
              Aahvani
            </span>
            <span className="hidden md:block text-[0.55rem] tracking-[0.22em] uppercase text-[#1A1A1A]/50 font-sans mt-0.5 ml-0.5">
              An Invitation to Elegance
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.7rem] font-medium tracking-[0.16em] uppercase text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[#C6973F] after:transition-all after:duration-200 hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right-side actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 p-1"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist${mounted && wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
              className="relative text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 p-1"
            >
              <Heart size={18} strokeWidth={1.5} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6973F] text-white text-[0.6rem] font-semibold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-0.5 leading-none">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart${mounted && cartCount > 0 ? `, ${cartCount} items` : ''}`}
              className="relative text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 p-1"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6973F] text-white text-[0.6rem] font-semibold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-0.5 leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

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
                    <span className="w-8 h-8 rounded-full bg-[#C6973F] flex items-center justify-center text-white text-xs font-semibold tracking-wide shadow-sm group-hover:bg-[#b5872e] transition-colors duration-200">
                      {userInitial}
                    </span>
                    <ChevronDown
                      size={13}
                      strokeWidth={1.5}
                      className={`text-[#1A1A1A]/40 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2.5 w-48 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-[#1A1A1A]/6 z-[110]">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-[#1A1A1A]/6">
                        <p className="text-[0.6rem] tracking-[0.18em] uppercase text-[#1A1A1A]/35 font-medium">Signed in as</p>
                        <p className="text-xs text-[#1A1A1A] font-medium mt-0.5 truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <ul className="py-1.5">
                        {DROPDOWN_ITEMS.map(({ href, Icon, label }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              onClick={() => setDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#1A1A1A]/65 hover:text-[#C6973F] hover:bg-[#FDF6EC] transition-colors duration-150"
                            >
                              <Icon size={14} strokeWidth={1.5} />
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Logout */}
                      <div className="border-t border-[#1A1A1A]/6 py-1.5">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors duration-150"
                        >
                          <LogOut size={14} strokeWidth={1.5} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Guest: Login button ── */
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex items-center px-4 py-1.5 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#C6973F] border border-[#C6973F] hover:bg-[#C6973F] hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
              )
            )}

            {/* Hamburger — mobile only */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen ? 'true' : 'false'}
              className="md:hidden text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 p-1 -mr-1"
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
          mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#FDF6EC] border-t border-[#C6973F]/20 px-6 py-6">
          <ul className="flex flex-col gap-5 mb-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.75rem] font-medium tracking-[0.18em] uppercase text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile auth section */}
          {mounted && (
            user ? (
              <div className="space-y-3 pt-4 border-t border-[#C6973F]/15">
                <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-medium">
                  {user.email}
                </p>
                {DROPDOWN_ITEMS.map(({ href, Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-[0.75rem] font-medium tracking-wide text-[#1A1A1A]/65 hover:text-[#C6973F] transition-colors duration-150"
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    {label}
                  </Link>
                ))}
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false) }}
                  className="flex items-center gap-2 text-[0.75rem] font-medium tracking-wide text-red-500 hover:text-red-600 transition-colors duration-150"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-5 py-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#C6973F] border border-[#C6973F] hover:bg-[#C6973F] hover:text-white transition-all duration-200"
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

          {/* Modal panel */}
          <div className="relative z-10 bg-white shadow-2xl mx-4 mt-20 md:mx-auto md:w-full md:max-w-2xl">
            {/* Input row */}
            <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[#1A1A1A]/10">
              <Search size={18} strokeWidth={1.5} className="ml-5 text-[#C6973F] flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery…"
                className="flex-1 px-4 py-4 text-base text-[#1A1A1A] placeholder-[#1A1A1A]/30 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-2 w-7 h-7 flex items-center justify-center text-[#1A1A1A]/25 hover:text-[#1A1A1A]/60 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={closeSearch}
                className="mr-4 w-8 h-8 flex items-center justify-center text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20"
                aria-label="Close"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </form>

            {/* Live results */}
            {searchQuery.trim() && (
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    <div className="divide-y divide-[#1A1A1A]/5">
                      {searchResults.map((p) => (
                        <Link
                          key={p.id}
                          href={`/shop/${p.id}`}
                          onClick={closeSearch}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FDF6EC] transition-colors group"
                        >
                          {/* Colour swatch */}
                          <div className={`w-10 h-10 flex-shrink-0 ${p.bg} flex items-center justify-center`}>
                            <span className="text-[#C6973F]/30 text-lg">◈</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C6973F] transition-colors truncate">
                              {p.name}
                            </p>
                            <p className="text-[0.65rem] text-[#1A1A1A]/40 font-light mt-0.5">
                              {p.category} · {p.material}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-[#C6973F]">{inr(p.salePrice)}</p>
                            {p.label && (
                              <span className="text-[0.55rem] font-bold tracking-wide bg-[#C6973F]/12 text-[#C6973F] px-1.5 py-0.5 rounded">
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
                      className="flex items-center justify-center gap-2 py-3.5 bg-[#FAFAF8] border-t border-[#1A1A1A]/6 text-[0.68rem] tracking-[0.18em] uppercase font-medium text-[#C6973F] hover:bg-[#FDF6EC] transition-colors"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                      <ArrowRight size={12} strokeWidth={1.5} />
                    </Link>
                  </>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-[#1A1A1A]/35 font-light">
                      No results for &ldquo;<span className="text-[#1A1A1A]/60 font-medium">{searchQuery}</span>&rdquo;
                    </p>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={closeSearch}
                      className="inline-flex items-center gap-1.5 mt-3 text-[0.68rem] text-[#C6973F] hover:text-[#b5872e] font-medium transition-colors"
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
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#1A1A1A]/30 font-semibold mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Kundan', 'Rings', 'Pearl', 'Silver', 'Earrings', 'Bridal Set'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 border border-[#1A1A1A]/10 text-xs text-[#1A1A1A]/50 hover:border-[#C6973F]/40 hover:text-[#C6973F] transition-all duration-150"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="text-[0.6rem] text-[#1A1A1A]/25 font-light mt-5">
                  Press <kbd className="px-1.5 py-0.5 bg-[#1A1A1A]/6 rounded text-[0.6rem]">Enter</kbd> to see all results · <kbd className="px-1.5 py-0.5 bg-[#1A1A1A]/6 rounded text-[0.6rem]">Esc</kbd> to close
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
