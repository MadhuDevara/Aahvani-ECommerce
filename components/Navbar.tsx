'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [mounted, setMounted]         = useState(false)
  const cartCount = useCartStore((s) => s.getItemCount())

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

            <button
              aria-label="Wishlist"
              className="text-[#1A1A1A] hover:text-[#C6973F] transition-colors duration-200 p-1"
            >
              <Heart size={18} strokeWidth={1.5} />
            </button>

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

            <Link
              href="/login"
              className="hidden md:inline-flex items-center px-4 py-1.5 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#C6973F] border border-[#C6973F] hover:bg-[#C6973F] hover:text-white transition-all duration-200"
            >
              Login
            </Link>

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
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
          <Link
            href="/login"
            className="inline-flex items-center px-5 py-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#C6973F] border border-[#C6973F] hover:bg-[#C6973F] hover:text-white transition-all duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
