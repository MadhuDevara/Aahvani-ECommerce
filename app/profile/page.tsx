'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  Save,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Bell,
  Lock,
  AlertTriangle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Address {
  id:        number
  label:     string
  line1:     string
  line2:     string
  city:      string
  state:     string
  pincode:   string
  isDefault: boolean
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-1" aria-hidden="true">
      <span className="h-px w-8 bg-[#C6973F]/40" />
      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#C6973F" /></svg>
      <span className="h-px w-8 bg-[#C6973F]/40" />
    </div>
  )
}

function SectionCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#1A1A1A]/8 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#1A1A1A]/6 bg-[#FAFAF8]">
        <h2 className="font-serif text-lg font-semibold text-[#1A1A1A]">{title}</h2>
        <p className="text-[0.65rem] text-[#1A1A1A]/40 font-light mt-0.5">{sub}</p>
      </div>
      <div className="px-6 py-6">{children}</div>
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

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
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
      aria-checked={on}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none ${on ? 'bg-[#C6973F]' : 'bg-[#1A1A1A]/15'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${on ? 'left-[1.35rem]' : 'left-0.5'}`} />
    </button>
  )
}

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh']

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter()
  const [mounted,   setMounted]   = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [user,      setUser]      = useState<User | null>(null)

  // Personal info
  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [dob,   setDob]   = useState('')
  const [infoSaving,  setInfoSaving]  = useState(false)
  const [infoSaved,   setInfoSaved]   = useState(false)

  // Addresses
  const [addresses,      setAddresses]      = useState<Address[]>([])
  const [showAddForm,    setShowAddForm]     = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [newAddr, setNewAddr] = useState({ label: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })

  // Password
  const [pw,       setPw]       = useState({ old: '', newPw: '', confirm: '' })
  const [pwShow,   setPwShow]   = useState({ old: false, newPw: false, confirm: false })
  const [pwError,  setPwError]  = useState('')
  const [pwSaved,  setPwSaved]  = useState(false)
  const [pwSaving, setPwSaving] = useState(false)

  // Notifications
  const [notifs, setNotifs] = useState({ orderUpdates: true, promotions: false, newArrivals: true })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/auth/login'); return }
      const u = data.session.user
      setUser(u)

      // ── 1. Load from auth metadata (saved previously) ─────────────────────
      const meta = u.user_metadata ?? {}
      if (meta.full_name) setName(meta.full_name)
      if (meta.phone)     setPhone(String(meta.phone).replace(/^\+91/, ''))
      if (meta.dob)       setDob(meta.dob)

      // ── 2. Fetch orders to fill in any missing profile fields + addresses ──
      const { data: orders } = await supabase
        .from('orders')
        .select('contact, address')
        .eq('user_email', u.email ?? '')
        .order('created_at', { ascending: false })

      if (orders && orders.length > 0) {
        // Pre-fill name/phone from latest order if still empty
        const latestContact = orders[0].contact as Record<string, string> | null
        if (!meta.full_name && latestContact?.fullName) setName(latestContact.fullName)
        if (!meta.phone     && latestContact?.phone)    setPhone(latestContact.phone.replace(/^\+91/, ''))

        // Build unique address list from order history
        const seen = new Set<string>()
        const derived: Address[] = []
        let idx = 1

        for (const order of orders) {
          const addr = order.address as Record<string, string> | null
          if (!addr?.line1) continue
          const key = `${addr.line1}|${addr.city}|${addr.pincode}`.toLowerCase()
          if (seen.has(key)) continue
          seen.add(key)
          derived.push({
            id:        idx++,
            label:     derived.length === 0 ? 'Default' : `Address ${idx - 1}`,
            line1:     addr.line1   ?? '',
            line2:     addr.line2   ?? '',
            city:      addr.city    ?? '',
            state:     addr.state   ?? '',
            pincode:   addr.pincode ?? '',
            isDefault: derived.length === 0,
          })
        }
        if (derived.length > 0) setAddresses(derived)
      }

      setAuthReady(true)
    })
  }, [router])

  const saveInfo = async () => {
    setInfoSaving(true)
    await supabase.auth.updateUser({
      data: { full_name: name.trim(), phone: phone.trim(), dob: dob },
    })
    setInfoSaving(false)
    setInfoSaved(true)
    setTimeout(() => setInfoSaved(false), 2500)
  }

  const updatePassword = async () => {
    setPwError('')
    if (!pw.newPw || !pw.confirm) { setPwError('All fields are required.'); return }
    if (pw.newPw.length < 6)      { setPwError('New password must be at least 6 characters.'); return }
    if (pw.newPw !== pw.confirm)  { setPwError('Passwords do not match.'); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pw.newPw })
    setPwSaving(false)
    if (error) { setPwError(error.message); return }
    setPw({ old: '', newPw: '', confirm: '' })
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 3000)
  }

  const deleteAddress = (id: number) => {
    if (!window.confirm('Remove this address?')) return
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const setDefault = (id: number) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))

  const saveAddress = () => {
    if (!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.pincode) return
    if (editingAddress) {
      setAddresses((prev) => prev.map((a) => a.id === editingAddress.id ? { ...editingAddress, ...newAddr } : a))
    } else {
      const id = Date.now()
      setAddresses((prev) => [
        ...prev.map((a) => newAddr.isDefault ? { ...a, isDefault: false } : a),
        { id, ...newAddr, label: newAddr.label || 'New Address' },
      ])
    }
    setShowAddForm(false)
    setEditingAddress(null)
    setNewAddr({ label: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
  }

  const startEdit = (a: Address) => {
    setEditingAddress(a)
    setNewAddr({ label: a.label, line1: a.line1, line2: a.line2, city: a.city, state: a.state, pincode: a.pincode, isDefault: a.isDefault })
    setShowAddForm(true)
  }

  if (!mounted || !authReady) {
    return (
      <div className="min-h-[60vh] bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    )
  }

  const initial = (name || user?.email || '?')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-[#FDF6EC]">

      {/* Header */}
      <div className="bg-[#FDF6EC] border-b border-[#C6973F]/12 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/40 mb-5">
            <Link href="/" className="hover:text-[#C6973F] transition-colors">Home</Link>
            <ChevronRight size={11} strokeWidth={1.5} />
            <span className="text-[#C6973F]">My Profile</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#C6973F] flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="font-serif text-2xl font-bold text-white">{initial}</span>
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-[#1A1A1A]">My Profile</h1>
              <p className="text-sm text-[#1A1A1A]/40 font-light mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">

        {/* ── Personal Info ── */}
        <SectionCard title="Personal Information" sub="Update your name and contact details">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <FieldInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <Label>Email Address</Label>
                <FieldInput value={user?.email ?? ''} disabled readOnly />
                <p className="text-[0.58rem] text-[#1A1A1A]/30 mt-1 font-light">Email cannot be changed here</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#1A1A1A]/40 font-medium">+91</span>
                  <FieldInput
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="pl-11"
                  />
                </div>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <FieldInput type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              {infoSaved && (
                <span className="flex items-center gap-1.5 text-[0.65rem] text-emerald-600 font-medium">
                  <Check size={12} strokeWidth={2.5} />Changes saved
                </span>
              )}
              <button
                onClick={saveInfo}
                disabled={infoSaving}
                className="ml-auto flex items-center gap-2 px-7 py-2.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors disabled:opacity-60"
              >
                {infoSaving
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                  : <><Save size={13} strokeWidth={1.5} />Save Changes</>
                }
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ── Saved Addresses ── */}
        <SectionCard title="My Addresses" sub="Manage your delivery addresses">
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-[#1A1A1A]/8 p-4 relative hover:border-[#C6973F]/20 transition-colors">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#C6973F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={14} strokeWidth={1.5} className="text-[#C6973F]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-[#1A1A1A]">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="text-[0.55rem] font-bold tracking-wide px-2 py-0.5 bg-[#C6973F]/12 text-[#C6973F] rounded-full border border-[#C6973F]/20">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#1A1A1A]/55 font-light leading-relaxed">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                        {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                      {!addr.isDefault && (
                        <button onClick={() => setDefault(addr.id)} className="text-[0.6rem] text-[#C6973F] hover:text-[#b5872e] font-medium mt-1.5 tracking-wide transition-colors">
                          Set as default
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => startEdit(addr)} className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/30 hover:text-[#C6973F] border border-transparent hover:border-[#C6973F]/20 transition-all" aria-label="Edit address">
                      <Pencil size={13} strokeWidth={1.5} />
                    </button>
                    <button onClick={() => deleteAddress(addr.id)} className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/30 hover:text-red-500 border border-transparent hover:border-red-100 transition-all" aria-label="Delete address">
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add/edit form */}
            {showAddForm ? (
              <div className="border border-[#C6973F]/20 bg-[#FDF6EC]/60 p-5 space-y-4">
                <p className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold text-[#C6973F]">
                  {editingAddress ? 'Edit Address' : 'New Address'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Label (Home / Office)</Label>
                    <FieldInput value={newAddr.label} onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))} placeholder="Home" />
                  </div>
                  <div>
                    <Label required>Address Line 1</Label>
                    <FieldInput value={newAddr.line1} onChange={(e) => setNewAddr((a) => ({ ...a, line1: e.target.value }))} placeholder="Street, Building" />
                  </div>
                  <div>
                    <Label>Address Line 2</Label>
                    <FieldInput value={newAddr.line2} onChange={(e) => setNewAddr((a) => ({ ...a, line2: e.target.value }))} placeholder="Area, Landmark (optional)" />
                  </div>
                  <div>
                    <Label required>City</Label>
                    <FieldInput value={newAddr.city} onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))} placeholder="Mumbai" />
                  </div>
                  <div>
                    <Label required>State</Label>
                    <select value={newAddr.state} onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))} aria-label="State" className="w-full px-4 py-2.5 bg-[#FAFAF8] border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C6973F]/50 transition-colors">
                      <option value="">Select state…</option>
                      {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label required>Pincode</Label>
                    <FieldInput value={newAddr.pincode} onChange={(e) => setNewAddr((a) => ({ ...a, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} placeholder="400001" maxLength={6} />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={newAddr.isDefault} onChange={(e) => setNewAddr((a) => ({ ...a, isDefault: e.target.checked }))} className="w-4 h-4 border border-[#C6973F] accent-[#C6973F]" />
                  <span className="text-sm text-[#1A1A1A]/65 font-light">Set as default address</span>
                </label>
                <div className="flex gap-3">
                  <button onClick={saveAddress} className="px-6 py-2.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors">
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                  <button onClick={() => { setShowAddForm(false); setEditingAddress(null); setNewAddr({ label: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false }) }} className="px-6 py-2.5 border border-[#1A1A1A]/15 text-[#1A1A1A]/50 text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:border-[#1A1A1A]/25 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 text-[0.68rem] tracking-[0.15em] uppercase font-medium text-[#C6973F] hover:text-[#b5872e] transition-colors border border-dashed border-[#C6973F]/30 hover:border-[#C6973F]/50 w-full py-3 justify-center"
              >
                <Plus size={14} strokeWidth={1.5} />
                Add New Address
              </button>
            )}
          </div>
        </SectionCard>

        {/* ── Account Settings ── */}
        <SectionCard title="Account Settings" sub="Security and notification preferences">
          <div className="space-y-7">

            {/* Password */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={14} strokeWidth={1.5} className="text-[#C6973F]" />
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Change Password</h3>
              </div>
              <div className="space-y-3 max-w-sm">
                {(['old', 'newPw', 'confirm'] as const).map((key) => {
                  const labels = { old: 'Current Password', newPw: 'New Password', confirm: 'Confirm New Password' }
                  return (
                    <div key={key}>
                      <Label>{labels[key]}</Label>
                      <div className="relative">
                        <FieldInput
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
                          aria-label="Toggle password"
                        >
                          {pwShow[key] ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
                {pwError  && <p className="flex items-center gap-1.5 text-[0.65rem] text-red-500 font-light"><AlertCircle size={11} strokeWidth={2} />{pwError}</p>}
                {pwSaved  && <p className="flex items-center gap-1.5 text-[0.65rem] text-emerald-600 font-medium"><Check size={11} strokeWidth={2.5} />Password updated</p>}
                <button
                  onClick={updatePassword}
                  disabled={pwSaving}
                  className="px-6 py-2.5 bg-[#C6973F] text-white text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {pwSaving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating…</> : 'Update Password'}
                </button>
              </div>
            </div>

            <div className="h-px bg-[#1A1A1A]/6" />

            {/* Email preferences */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell size={14} strokeWidth={1.5} className="text-[#C6973F]" />
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Email Preferences</h3>
              </div>
              <div className="space-y-1">
                {[
                  { key: 'orderUpdates' as const, label: 'Order Updates',   sub: 'Shipping and delivery notifications' },
                  { key: 'promotions'   as const, label: 'Promotions',      sub: 'Discounts, offers and sale alerts'   },
                  { key: 'newArrivals'  as const, label: 'New Arrivals',    sub: 'Latest collections and restocks'      },
                ].map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-[#1A1A1A]/5 last:border-0">
                    <div>
                      <label htmlFor={`notif-${key}`} className="text-sm font-medium text-[#1A1A1A] cursor-pointer">{label}</label>
                      <p className="text-[0.62rem] text-[#1A1A1A]/40 font-light mt-0.5">{sub}</p>
                    </div>
                    <Toggle id={`notif-${key}`} on={notifs[key]} onChange={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))} />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#1A1A1A]/6" />

            {/* Danger zone */}
            <div className="border border-red-100 bg-red-50/50 p-5">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle size={16} strokeWidth={1.5} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-700">Delete Account</h3>
                  <p className="text-xs text-red-600/70 font-light mt-0.5 leading-relaxed">
                    Permanently delete your account, order history, and all saved data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.confirm('Are you absolutely sure? This will permanently delete your account.') && alert('Account deletion would be processed here.')}
                className="px-6 py-2.5 border border-red-300 text-red-600 text-[0.68rem] tracking-[0.18em] uppercase font-medium hover:bg-red-100 transition-colors"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  )
}
