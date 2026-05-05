'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import PulseLoader from '@/components/PulseLoader'

export default function RouteLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!pathname) return
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <PulseLoader />
    </div>
  )
}
