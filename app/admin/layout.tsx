'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'maddy@dkmstack.com'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const [ready,  setReady]  = useState(false)
  const [email,  setEmail]  = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace('/')
        return
      }
      setEmail(user.email)
      setReady(true)
    })
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#C6973F]/20 border-t-[#C6973F] rounded-full animate-spin" />
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-white/20 font-light">Verifying access…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <AdminSidebar email={email} />
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
