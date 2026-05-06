'use client'

import { usePathname } from 'next/navigation'

export default function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin') ?? false
  return (
    <main className={isAdmin ? 'flex-1' : 'flex-1 pt-[var(--lux-nav-h)]'}>
      {children}
    </main>
  )
}
