'use client'

import { useState } from 'react'
import {
  Store,
  Lock,
  Bell,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeader({ Icon, title, subtitle }: {
  Icon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>
  title:    string
  subtitle: string
}) {
  return (
    <div className="flex items-start gap-3 pb-5 border-b border-[#1A1A1A]/6 mb-6">
      <div className="w-9 h-9 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={16} strokeWidth={1.5} className="text-[#C6973F]" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-[#1A1A1A]">{title}</h2>
        <p className="text-[0.65rem] text-[#1A1A1A]/40 font-light mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[0.63rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 bg-[#FAFAF8] border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${props.className ?? ''}`}
    />
  )
}

function Toggle({ on, onChange, id }: { on: boolean; onChange: () => void; id: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={on ? 'true' : 'false'}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#C6973F]/30 ${on ? 'bg-[#C6973F]' : 'bg-[#1A1A1A]/15'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${on ? 'left-[1.35rem]' : 'left-0.5'}`}
      />
    </button>
  )
}

function SaveBanner({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 bg-[#1A1A1A] text-white text-xs font-medium shadow-2xl">
      <Check size={13} strokeWidth={2.5} className="text-emerald-400" />
      Changes saved successfully
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  // Store settings
  const [store, setStore] = useState({
    name:    'Aahvani Jewels',
    email:   'hello@aahvani.com',
    phone:   '+91 98765 43210',
    address: '42, Jewellers Lane, Mumbai, Maharashtra – 400001',
  })
  const [storeSaved,  setStoreSaved]  = useState(false)
  const [storeSaving, setStoreSaving] = useState(false)

  // Password
  const [pw, setPw] = useState({ old: '', newPw: '', confirm: '' })
  const [pwShow, setPwShow] = useState({ old: false, newPw: false, confirm: false })
  const [pwError,   setPwError]   = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwSaving,  setPwSaving]  = useState(false)

  // Notifications
  const [notifs, setNotifs] = useState({
    newOrder:      true,
    lowStock:      true,
    customerSignup:false,
  })
  const [notifSaved,  setNotifSaved]  = useState(false)
  const [notifSaving, setNotifSaving] = useState(false)

  const flash = (setFn: (v: boolean) => void) => {
    setFn(true); setTimeout(() => setFn(false), 2500)
  }

  // Handlers
  const saveStore = () => {
    setStoreSaving(true)
    setTimeout(() => { setStoreSaving(false); flash(setStoreSaved) }, 900)
  }

  const saveNotifs = () => {
    setNotifSaving(true)
    setTimeout(() => { setNotifSaving(false); flash(setNotifSaved) }, 700)
  }

  const updatePassword = async () => {
    setPwError('')
    if (!pw.old || !pw.newPw || !pw.confirm) { setPwError('All fields are required.'); return }
    if (pw.newPw.length < 6)  { setPwError('New password must be at least 6 characters.'); return }
    if (pw.newPw !== pw.confirm) { setPwError('Passwords do not match.'); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pw.newPw })
    setPwSaving(false)
    if (error) { setPwError(error.message); return }
    setPw({ old: '', newPw: '', confirm: '' })
    setPwSuccess(true)
    setTimeout(() => setPwSuccess(false), 3000)
  }

  const dangerAction = (label: string) => {
    if (window.confirm(`Are you sure you want to ${label}? This cannot be undone.`)) {
      alert(`"${label}" action would be performed here (connected to DB in production).`)
    }
  }

  const adminEmail = 'maddy@dkmstack.com'

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F7F7F5] min-h-screen">

      <SaveBanner show={storeSaved || notifSaved} />

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Settings</h1>
        <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light">
          Manage your store preferences and admin configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* ── Store Settings ── */}
          <div className="bg-white border border-[#1A1A1A]/8 p-6">
            <SectionHeader Icon={Store as never} title="Store Settings" subtitle="Basic information about your store" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Store Name</Label>
                  <Input
                    value={store.name}
                    onChange={(e) => setStore((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Aahvani Jewels"
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input value="₹ INR — Indian Rupee" disabled readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Store Email</Label>
                  <Input
                    type="email"
                    value={store.email}
                    onChange={(e) => setStore((s) => ({ ...s, email: e.target.value }))}
                    placeholder="hello@aahvani.com"
                  />
                </div>
                <div>
                  <Label>Store Phone</Label>
                  <Input
                    value={store.phone}
                    onChange={(e) => setStore((s) => ({ ...s, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <Label>Store Address</Label>
                <textarea
                  rows={3}
                  value={store.address}
                  onChange={(e) => setStore((s) => ({ ...s, address: e.target.value }))}
                  placeholder="Full store address…"
                  className="w-full px-4 py-2.5 bg-[#FAFAF8] border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors resize-none"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                {storeSaved && (
                  <span className="flex items-center gap-1.5 text-[0.65rem] text-emerald-600 font-medium">
                    <Check size={12} strokeWidth={2.5} /> Saved
                  </span>
                )}
                <div className="ml-auto">
                  <button
                    onClick={saveStore}
                    disabled={storeSaving}
                    className="px-6 py-2.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-150 disabled:opacity-60 flex items-center gap-2"
                  >
                    {storeSaving ? (
                      <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Admin / Password ── */}
          <div className="bg-white border border-[#1A1A1A]/8 p-6">
            <SectionHeader Icon={Lock as never} title="Admin Settings" subtitle="Manage your admin account credentials" />
            <div className="space-y-4">
              {/* Readonly email */}
              <div>
                <Label>Admin Email</Label>
                <Input value={adminEmail} disabled readOnly />
                <p className="text-[0.6rem] text-[#1A1A1A]/30 mt-1.5 font-light">
                  Admin email cannot be changed here. Contact support to update it.
                </p>
              </div>

              <div className="border-t border-[#1A1A1A]/6 pt-5 mt-2">
                <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/35 font-semibold mb-4">
                  Change Password
                </p>
                <div className="space-y-3">
                  {(['old', 'newPw', 'confirm'] as const).map((key) => {
                    const labels = { old: 'Current Password', newPw: 'New Password', confirm: 'Confirm New Password' }
                    return (
                      <div key={key}>
                        <Label>{labels[key]}</Label>
                        <div className="relative">
                          <Input
                            type={pwShow[key] ? 'text' : 'password'}
                            value={pw[key]}
                            onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                            placeholder="••••••••"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setPwShow((s) => ({ ...s, [key]: !s[key] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/25 hover:text-[#1A1A1A]/50 transition-colors"
                            aria-label={pwShow[key] ? 'Hide password' : 'Show password'}
                          >
                            {pwShow[key] ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {pwError && (
                  <p className="flex items-center gap-1.5 text-[0.65rem] text-red-500 mt-3 font-light">
                    <AlertCircle size={11} strokeWidth={2} />{pwError}
                  </p>
                )}
                {pwSuccess && (
                  <p className="flex items-center gap-1.5 text-[0.65rem] text-emerald-600 mt-3 font-medium">
                    <Check size={11} strokeWidth={2.5} />Password updated successfully
                  </p>
                )}

                <div className="mt-4">
                  <button
                    onClick={updatePassword}
                    disabled={pwSaving}
                    className="px-6 py-2.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-150 disabled:opacity-60 flex items-center gap-2"
                  >
                    {pwSaving ? (
                      <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating…</>
                    ) : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Notifications ── */}
          <div className="bg-white border border-[#1A1A1A]/8 p-6">
            <SectionHeader Icon={Bell as never} title="Notification Settings" subtitle="Choose which events send you an email alert" />
            <div className="space-y-1">
              {[
                { key: 'newOrder'       as const, label: 'New Order',        sub: 'Alert when a customer places an order'           },
                { key: 'lowStock'       as const, label: 'Low Stock Alert',   sub: 'Alert when any product stock falls below 10'     },
                { key: 'customerSignup' as const, label: 'Customer Signup',   sub: 'Alert when a new customer creates an account'    },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between py-4 border-b border-[#1A1A1A]/5 last:border-0">
                  <div className="pr-4">
                    <label htmlFor={`notif-${key}`} className="text-sm font-medium text-[#1A1A1A] cursor-pointer">{label}</label>
                    <p className="text-[0.65rem] text-[#1A1A1A]/40 font-light mt-0.5">{sub}</p>
                  </div>
                  <Toggle
                    id={`notif-${key}`}
                    on={notifs[key]}
                    onChange={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#1A1A1A]/6">
              {notifSaved && (
                <span className="flex items-center gap-1.5 text-[0.65rem] text-emerald-600 font-medium">
                  <Check size={12} strokeWidth={2.5} /> Preferences saved
                </span>
              )}
              <div className="ml-auto">
                <button
                  onClick={saveNotifs}
                  disabled={notifSaving}
                  className="px-6 py-2.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-150 disabled:opacity-60 flex items-center gap-2"
                >
                  {notifSaving ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                  ) : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">

          {/* Quick info */}
          <div className="bg-white border border-[#1A1A1A]/8 p-5">
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1A1A1A]/30 font-semibold mb-4">Store Info</p>
            <div className="space-y-3 text-xs text-[#1A1A1A]/55 font-light">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="text-[#1A1A1A]/70 font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Environment</span>
                <span className="text-emerald-600 font-medium">Development</span>
              </div>
              <div className="flex justify-between">
                <span>Currency</span>
                <span className="text-[#1A1A1A]/70 font-medium">₹ INR</span>
              </div>
              <div className="flex justify-between">
                <span>Free Delivery</span>
                <span className="text-[#1A1A1A]/70 font-medium">Above ₹999</span>
              </div>
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span className="text-[#1A1A1A]/70 font-medium">₹99</span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-red-100 p-5">
            <div className="flex items-start gap-3 pb-4 border-b border-red-50 mb-5">
              <div className="w-8 h-8 bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={14} strokeWidth={1.5} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
                <p className="text-[0.62rem] text-red-400/70 font-light mt-0.5">
                  These actions are irreversible
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => dangerAction('clear all orders')}
                className="w-full py-2.5 border border-red-200 text-red-500 text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-150"
              >
                Clear All Orders
              </button>
              <button
                onClick={() => dangerAction('reset all store data')}
                className="w-full py-2.5 border border-red-200 text-red-500 text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-150"
              >
                Reset Store Data
              </button>
            </div>
            <p className="text-[0.58rem] text-red-400/60 font-light mt-4 leading-relaxed">
              These actions cannot be undone. Make sure you have a backup before proceeding.
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
