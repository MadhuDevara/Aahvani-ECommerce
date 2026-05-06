'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase } from '@/lib/supabase'
import { ADMIN_EMAIL, isAdminEmail } from '@/lib/admin-config'
import { Gem, Eye, EyeOff } from 'lucide-react'

function AdminLogin() {
  const [email,    setEmail]    = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-lux-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-lux-black border border-white/8 p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center">
            <Gem size={15} className="text-lux-gold" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-white/30 font-light">Aahvani Jewels</p>
            <p className="text-[0.7rem] tracking-[0.15em] uppercase text-white/60 font-medium">Admin Access</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-light">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-login-email" className="block text-[0.62rem] tracking-[0.12em] uppercase text-white/30 mb-1.5 font-light">
              Email
            </label>
            <input
              id="admin-login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-lux-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[0.62rem] tracking-[0.12em] uppercase text-white/30 mb-1.5 font-light">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-11 bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-lux-gold/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                title={show ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-lux-gold text-white text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:bg-lux-gold-hover transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
            ) : 'Sign In to Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading')
  const [email,  setEmail]  = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (user && isAdminEmail(user.email)) {
        setEmail(user.email ?? '')
        setStatus('auth')
      } else {
        setStatus('unauth')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user
      if (user && isAdminEmail(user.email)) {
        setEmail(user.email ?? '')
        setStatus('auth')
      } else {
        setStatus('unauth')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-lux-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-lux-gold/20 border-t-lux-gold rounded-full animate-spin" />
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-white/20 font-light">Verifying access…</p>
        </div>
      </div>
    )
  }

  if (status === 'unauth') return <AdminLogin />

  return (
    <div className="flex min-h-screen bg-lux-ivory-muted">
      <AdminSidebar email={email} />
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
