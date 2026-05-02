'use client'

import { usePathname } from 'next/navigation'

export default function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin') ?? false
  return (
    <main className={`flex-1 ${isAdmin ? '' : 'pt-16 md:pt-20'}`}>
      {children}
    </main>
  )
}
