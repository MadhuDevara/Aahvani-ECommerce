'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Package, LogOut, User } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

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
  const router = useRouter()

  const [isScrolled, setIsScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [mounted, setMounted]         = useState(false)
  const [user, setUser]               = useState<SupabaseUser | null>(null)
  const [dropdownOpen, setDropdown]   = useState(false)

  const cartCount   = useCartStore((s) => s.getItemCount())
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
      setUser(data.session?.user ?? null)
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setDropdown(false)
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
              aria-label="Search"
              className="text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 p-1"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 p-1"
            >
              <Heart size={18} strokeWidth={1.5} />
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
                    <div className="absolute right-0 top-full mt-2.5 w-48 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-[#1A1A1A]/6 z-50">
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
    </header>
  )
}
