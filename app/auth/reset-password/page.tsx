'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [done,      setDone]      = useState(false)
  const [ready,     setReady]     = useState(false)

  // Exchange the recovery token from the URL hash for a session
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.includes('access_token')) {
      setError('Invalid or expired reset link. Please request a new one.')
      setReady(true)
      return
    }

    // Supabase automatically processes the hash and sets the session
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    // Also trigger session detection manually
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError(err.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center p-4">
        <div className="bg-white border border-emerald-100 px-10 py-12 text-center max-w-sm w-full shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={26} className="text-emerald-600" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">Password Updated!</h2>
          <p className="text-sm text-[#1A1A1A]/45 font-light">Redirecting to login…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#C6973F]/15 px-8 py-10 shadow-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#C6973F] font-medium mb-3">Aahvani Jewels</p>
          <h1 className="font-serif text-2xl font-semibold text-[#1A1A1A]">Set New Password</h1>
          <p className="text-sm text-[#1A1A1A]/40 font-light mt-2">Choose a strong password for your account</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs font-light">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {!ready && !error ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-7 h-7 border-[3px] border-[#C6973F]/20 border-t-[#C6973F] rounded-full animate-spin" />
            <p className="text-xs text-[#1A1A1A]/35 font-light">Verifying reset link…</p>
          </div>
        ) : ready && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[0.65rem] tracking-[0.1em] uppercase text-[#1A1A1A]/50 mb-2 font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 pr-11 border border-[#1A1A1A]/15 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F]/50 transition-colors bg-[#FDFAF5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  title={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[0.65rem] tracking-[0.1em] uppercase text-[#1A1A1A]/50 mb-2 font-medium">
                Confirm Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 border border-[#1A1A1A]/15 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F]/50 transition-colors bg-[#FDFAF5]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
              ) : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
