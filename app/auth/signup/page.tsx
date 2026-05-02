'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Google icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string) {
  let score = 0
  if (pw.length >= 8)            score++
  if (/[A-Z]/.test(pw))          score++
  if (/[0-9]/.test(pw))          score++
  if (/[^A-Za-z0-9]/.test(pw))   score++
  if (score <= 1) return { score, label: 'Weak',   bar: 'bg-red-500',     width: 'w-1/4'  }
  if (score === 2) return { score, label: 'Fair',   bar: 'bg-yellow-500',  width: 'w-2/4'  }
  if (score === 3) return { score, label: 'Good',   bar: 'bg-blue-400',    width: 'w-3/4'  }
  return                { score, label: 'Strong', bar: 'bg-emerald-500', width: 'w-full' }
}

export default function SignupPage() {
  const [fullName, setFullName]       = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed]           = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)

  const strength   = password.length > 0 ? getStrength(password) : null
  const mismatch   = confirm.length > 0 && password !== confirm

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!agreed)               { setError('Please agree to the terms and conditions.'); return }
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      })
      if (authError) throw authError
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign-up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold tracking-[0.08em] text-[#C6973F]">
              Aahvani
            </span>
          </Link>
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#1A1A1A]/40 mt-1">
            An Invitation to Elegance
          </p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-10 shadow-[0_4px_40px_rgba(0,0,0,0.06)]">

          <div className="flex items-center justify-center gap-3 mb-7" aria-hidden="true">
            <span className="h-px w-8 bg-[#C6973F]/30" />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" fillOpacity="0.5" />
            </svg>
            <span className="h-px w-8 bg-[#C6973F]/30" />
          </div>

          {/* Success state */}
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-5 bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={28} strokeWidth={1.5} className="text-emerald-500" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">
                Account Created!
              </h2>
              <p className="text-sm text-[#1A1A1A]/50 font-light leading-relaxed mb-6">
                We&apos;ve sent a confirmation link to <strong className="text-[#1A1A1A]/70">{email}</strong>.
                Please check your inbox to verify your account.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-7 py-3 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.2em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl font-semibold text-[#1A1A1A] text-center mb-7">
                Create Account
              </h1>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600">
                  <AlertCircle size={15} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-[0.68rem] tracking-[0.18em] uppercase text-[#1A1A1A]/55 font-medium mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 border border-[#1A1A1A]/15 bg-[#FDF6EC] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F] transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[0.68rem] tracking-[0.18em] uppercase text-[#1A1A1A]/55 font-medium mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-[#1A1A1A]/15 bg-[#FDF6EC] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F] transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-[0.68rem] tracking-[0.18em] uppercase text-[#1A1A1A]/55 font-medium mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-11 py-3 border border-[#1A1A1A]/15 bg-[#FDF6EC] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:outline-none focus:border-[#C6973F] transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#C6973F] transition-colors duration-150"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1 w-full bg-[#1A1A1A]/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.bar} ${strength.width}`} />
                      </div>
                      <p className={`text-[0.6rem] mt-1 font-medium tracking-wide ${
                        strength.score <= 1 ? 'text-red-500'
                        : strength.score === 2 ? 'text-yellow-600'
                        : strength.score === 3 ? 'text-blue-500'
                        : 'text-emerald-600'
                      }`}>
                        {strength.label} password
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm" className="block text-[0.68rem] tracking-[0.18em] uppercase text-[#1A1A1A]/55 font-medium mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
                    <input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      className={`w-full pl-10 pr-11 py-3 border bg-[#FDF6EC] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:outline-none transition-colors duration-200 ${
                        mismatch ? 'border-red-400 focus:border-red-400' : 'border-[#1A1A1A]/15 focus:border-[#C6973F]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#C6973F] transition-colors duration-150"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {mismatch && (
                    <p className="text-[0.62rem] text-red-500 mt-1 font-medium">Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
                  <span
                    className={`w-4 h-4 flex-shrink-0 border transition-colors duration-150 flex items-center justify-center mt-0.5 ${
                      agreed ? 'border-[#C6973F] bg-[#C6973F]' : 'border-[#1A1A1A]/25 group-hover:border-[#C6973F]'
                    }`}
                  >
                    {agreed && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <input type="checkbox" className="sr-only" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <span className="text-xs text-[#1A1A1A]/50 font-light leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#C6973F] hover:underline underline-offset-2">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[#C6973F] hover:underline underline-offset-2">Privacy Policy</Link>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || mismatch}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#C6973F] text-white text-[0.72rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 mt-1"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </>
                  ) : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <span className="h-px flex-1 bg-[#1A1A1A]/10" />
                <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1A1A1A]/30">or continue with</span>
                <span className="h-px flex-1 bg-[#1A1A1A]/10" />
              </div>

              {/* Google */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 border border-[#1A1A1A]/15 text-[0.72rem] tracking-[0.12em] text-[#1A1A1A]/65 font-medium hover:border-[#C6973F] hover:text-[#1A1A1A] transition-all duration-200"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Login link */}
              <p className="text-center text-xs text-[#1A1A1A]/40 font-light mt-7">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#C6973F] font-medium hover:underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
