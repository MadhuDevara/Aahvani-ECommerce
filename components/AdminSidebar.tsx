'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Gem,
  Menu,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin',          label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products',  Icon: Package          },
  { href: '/admin/orders',   label: 'Orders',    Icon: ShoppingBag      },
  { href: '/admin/customers',label: 'Customers', Icon: Users            },
  { href: '/admin/settings', label: 'Settings',  Icon: Settings         },
]

export default function AdminSidebar({ email }: { email: string }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/8">
        <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 border border-[#C6973F]/60 flex items-center justify-center">
            <Gem size={14} strokeWidth={1} className="text-[#C6973F]" />
          </div>
          <div>
            <p className="font-serif text-[1.1rem] text-[#C6973F] leading-none tracking-wide">Aahvani</p>
            <p className="text-[0.52rem] text-white/25 tracking-[0.3em] uppercase mt-0.5 font-light">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-0.5" aria-label="Admin navigation">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-[#C6973F]/15 text-[#C6973F] border-l-2 border-[#C6973F]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer — always pinned to bottom */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1 mt-auto flex-shrink-0">
        <div className="px-3 py-2.5">
          <p className="text-[0.6rem] tracking-[0.2em] uppercase text-white/25 mb-0.5 font-medium">Signed in as</p>
          <p className="text-[0.7rem] text-white/55 font-light truncate">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/35 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 border-l-2 border-transparent hover:border-red-400/40"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-[#1A1A1A] min-h-screen sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile: top bar + drawer */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-4 bg-[#1A1A1A] border-b border-white/8">
          <Link href="/admin" className="flex items-center gap-2">
            <Gem size={14} strokeWidth={1} className="text-[#C6973F]" />
            <span className="font-serif text-base text-[#C6973F]">Aahvani Admin</span>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="text-white/50 hover:text-white transition-colors"
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-56 bg-[#1A1A1A] h-full overflow-y-auto shadow-2xl">
              <SidebarContent />
            </div>
            <button
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            />
          </div>
        )}
      </div>
    </>
  )
}
