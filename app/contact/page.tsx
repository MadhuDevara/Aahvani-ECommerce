'use client'

import { useState } from 'react'
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Check,
  AlertCircle,
  Send,
} from 'lucide-react'

// ─── Social icon SVGs ──────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2" aria-hidden="true">
      <span className="h-px w-10 bg-[#C6973F]/40" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" />
      </svg>
    </div>
  )
}

interface FormState {
  name:    string
  email:   string
  subject: string
  message: string
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (!f.name.trim())                                    e.name    = 'Your name is required.'
  if (!f.email.trim() || !/\S+@\S+\.\S+/.test(f.email)) e.email   = 'Enter a valid email address.'
  if (!f.subject.trim())                                  e.subject = 'Please enter a subject.'
  if (!f.message.trim() || f.message.length < 20)        e.message = 'Message must be at least 20 characters.'
  return e
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 text-[0.65rem] text-red-500 mt-1.5 font-light">
      <AlertCircle size={11} strokeWidth={2} />{msg}
    </p>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form,    setForm]    = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [errors,  setErrors]  = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* ── Page header ── */}
      <section className="py-20 md:py-24 text-center px-4 border-b border-[#C6973F]/10">
        <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C6973F] font-medium mb-4">We&apos;d love to hear from you</p>
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#1A1A1A] leading-none mb-4">
          Get In Touch
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2" aria-hidden="true">
          <span className="h-px w-10 bg-[#C6973F]/40" />
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" />
          </svg>
          <span className="h-px w-10 bg-[#C6973F]/40" />
        </div>
        <p className="mt-5 text-sm text-[#1A1A1A]/45 font-light max-w-md mx-auto leading-relaxed">
          Questions about an order, custom jewellery, or just want to say hello? We reply within 24 hours.
        </p>
      </section>

      {/* ── Two-column layout ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">

        {/* ── Contact Form ── */}
        <div className="lg:col-span-3">
          <p className="text-[0.62rem] tracking-[0.3em] uppercase text-[#C6973F] font-medium mb-1">Write to us</p>
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-1">Send a Message</h2>
          <GoldDivider />

          {sent ? (
            <div className="mt-8 flex flex-col items-start gap-4 p-8 bg-emerald-50 border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center">
                <Check size={22} strokeWidth={2} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-1">Message sent!</h3>
                <p className="text-sm text-[#1A1A1A]/55 font-light leading-relaxed">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours at your email address.
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[#C6973F] hover:text-[#b5872e] transition-colors mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.63rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Priya Sharma"
                    className={`w-full px-4 py-3 bg-white border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.name ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                  />
                  <FieldError msg={errors.name} />
                </div>
                <div>
                  <label className="text-[0.63rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="priya@email.com"
                    className={`w-full px-4 py-3 bg-white border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.email ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                  />
                  <FieldError msg={errors.email} />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[0.63rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => set('subject', e.target.value)}
                  placeholder="Question about my order…"
                  className={`w-full px-4 py-3 bg-white border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.subject ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                />
                <FieldError msg={errors.subject} />
              </div>

              {/* Message */}
              <div>
                <label className="text-[0.63rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  placeholder="Tell us how we can help you…"
                  className={`w-full px-4 py-3 bg-white border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors resize-none ${errors.message ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                />
                <div className="flex items-start justify-between mt-1">
                  <FieldError msg={errors.message} />
                  <span className={`text-[0.6rem] font-light ml-auto ${form.message.length < 20 ? 'text-[#1A1A1A]/25' : 'text-emerald-500'}`}>
                    {form.message.length} / 20 min
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-3 px-8 py-3.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={13} strokeWidth={1.5} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── Contact Info ── */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <p className="text-[0.62rem] tracking-[0.3em] uppercase text-[#C6973F] font-medium mb-1">Find us</p>
            <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-1">Contact Info</h2>
            <GoldDivider />
          </div>

          {/* Info items */}
          <div className="space-y-6 mt-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} strokeWidth={1.5} className="text-[#C6973F]" />
              </div>
              <div>
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold mb-1">Address</p>
                <p className="text-sm text-[#1A1A1A]/65 font-light leading-relaxed">
                  42, Jewellers Lane, Zaveri Bazaar<br />
                  Mumbai, Maharashtra – 400002
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={16} strokeWidth={1.5} className="text-[#C6973F]" />
              </div>
              <div>
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold mb-1">Email</p>
                <a href="mailto:hello@aahvani.com" className="text-sm text-[#1A1A1A]/65 font-light hover:text-[#C6973F] transition-colors">
                  hello@aahvani.com
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0">
                <Phone size={16} strokeWidth={1.5} className="text-[#C6973F]" />
              </div>
              <div>
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold mb-1">Phone</p>
                <a href="tel:+919876543210" className="text-sm text-[#1A1A1A]/65 font-light hover:text-[#C6973F] transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0">
                <Clock size={16} strokeWidth={1.5} className="text-[#C6973F]" />
              </div>
              <div>
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold mb-1">Working Hours</p>
                <p className="text-sm text-[#1A1A1A]/65 font-light leading-relaxed">
                  Mon – Sat: 10:00 AM – 7:00 PM<br />
                  Sunday: 11:00 AM – 5:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="pt-4 border-t border-[#C6973F]/10">
            <p className="text-[0.62rem] tracking-[0.25em] uppercase text-[#1A1A1A]/35 font-semibold mb-4">
              Follow Us
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Instagram', Icon: InstagramIcon, href: 'https://instagram.com' },
                { label: 'Facebook',  Icon: FacebookIcon,  href: 'https://facebook.com'  },
                { label: 'WhatsApp',  Icon: WhatsAppIcon,  href: 'https://wa.me/919876543210' },
              ].map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-[#1A1A1A]/12 flex items-center justify-center text-[#1A1A1A]/35 hover:border-[#C6973F] hover:text-[#C6973F] transition-all duration-150"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick note */}
          <div className="p-5 bg-[#C6973F]/6 border border-[#C6973F]/12">
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#C6973F] font-semibold mb-2">Quick Note</p>
            <p className="text-xs text-[#1A1A1A]/50 font-light leading-relaxed">
              For order-related queries, please have your Order ID ready. We typically respond within
              <span className="text-[#1A1A1A]/70 font-medium"> 24 business hours</span>.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
