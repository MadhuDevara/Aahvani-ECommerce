'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Google icon SVG ─────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        className="fill-blue-500"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        className="fill-emerald-600"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        className="fill-amber-400"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        className="fill-red-500"
      />
    </svg>
  )
}

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextAfterLogin = safeNextPath(searchParams.get('next'))

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [remember, setRemember]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  // Detect password recovery token in URL hash and redirect to reset page
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      router.replace('/auth/reset-password' + hash)
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) throw authError
      router.push(nextAfterLogin)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${nextAfterLogin}` },
    })
  }

  return (
    <div className="min-h-screen bg-lux-ivory flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold tracking-[0.08em] text-lux-gold">
              Aahvani
            </span>
          </Link>
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-lux-ink/40 mt-1">
            An Invitation to Elegance
          </p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-10 shadow-[0_4px_40px_rgba(0,0,0,0.06)]">

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mb-7" aria-hidden="true">
            <span className="h-px w-8 bg-lux-gold/30" />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--lux-gold)" fillOpacity="0.5" />
            </svg>
            <span className="h-px w-8 bg-lux-gold/30" />
          </div>

          <h1 className="font-serif text-2xl font-semibold text-lux-ink text-center mb-7">
            Welcome Back
          </h1>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600">
              <AlertCircle size={15} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[0.68rem] tracking-[0.18em] uppercase text-lux-ink/55 font-medium mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-ink/30" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-lux-ink/15 bg-lux-ivory text-sm text-lux-ink placeholder:text-lux-ink/25 focus:outline-none focus:border-lux-gold transition-colors duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[0.68rem] tracking-[0.18em] uppercase text-lux-ink/55 font-medium">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[0.65rem] text-lux-gold hover:underline underline-offset-2 transition-all duration-150">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lux-ink/30" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 border border-lux-ink/15 bg-lux-ivory text-sm text-lux-ink placeholder:text-lux-ink/25 focus:outline-none focus:border-lux-gold transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lux-ink/30 hover:text-lux-gold transition-colors duration-150"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <span
                className={`w-4 h-4 flex-shrink-0 border transition-colors duration-150 flex items-center justify-center ${
                  remember ? 'border-lux-gold bg-lux-gold' : 'border-lux-ink/25 group-hover:border-lux-gold'
                }`}
              >
                {remember && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input type="checkbox" className="sr-only" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span className="text-xs text-lux-ink/55 font-light">Remember me</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-lux-gold text-white text-[0.72rem] tracking-[0.22em] uppercase font-medium hover:bg-lux-gold-hover disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-lux-ink/10" />
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-lux-ink/30">or continue with</span>
            <span className="h-px flex-1 bg-lux-ink/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 border border-lux-ink/15 text-[0.72rem] tracking-[0.12em] text-lux-ink/65 font-medium hover:border-lux-gold hover:text-lux-ink transition-all duration-200"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="text-center text-xs text-lux-ink/40 font-light mt-7">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-lux-gold font-medium hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-lux-ivory flex items-center justify-center">
          <div className="w-9 h-9 border-[3px] border-lux-gold/25 border-t-lux-gold rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
