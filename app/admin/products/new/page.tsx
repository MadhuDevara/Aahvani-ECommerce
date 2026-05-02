'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  AlertCircle,
  Check,
  Plus,
  X,
} from 'lucide-react'

const CATEGORIES = ['Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Bangles', 'Pendants', 'Sets']
const MATERIALS  = ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'Kundan', 'Jadau', 'Meenakari', 'Diamond', 'Pearl', 'Mixed Metals']

interface FormData {
  name:          string
  description:   string
  category:      string
  material:      string
  price:         string
  salePrice:     string
  stock:         string
  featured:      boolean
  images:        string[]
}

const INIT: FormData = {
  name: '', description: '', category: '', material: '',
  price: '', salePrice: '', stock: '', featured: false,
  images: ['', '', '', ''],
}

type Errors = Partial<Record<keyof FormData, string>>

function validate(f: FormData): Errors {
  const e: Errors = {}
  if (!f.name.trim())              e.name        = 'Product name is required.'
  if (!f.description.trim())       e.description = 'Description is required.'
  if (!f.category)                 e.category    = 'Please select a category.'
  if (!f.material)                 e.material    = 'Please select a material.'
  if (!f.price || isNaN(+f.price) || +f.price <= 0)
                                   e.price       = 'Enter a valid price.'
  if (f.salePrice && (isNaN(+f.salePrice) || +f.salePrice <= 0))
                                   e.salePrice   = 'Enter a valid sale price.'
  if (f.salePrice && +f.salePrice >= +f.price)
                                   e.salePrice   = 'Sale price must be less than original price.'
  if (!f.stock || isNaN(+f.stock) || +f.stock < 0)
                                   e.stock       = 'Enter a valid stock quantity.'
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

export default function AddProductPage() {
  const router  = useRouter()
  const [form,    setForm]    = useState<FormData>(INIT)
  const [errors,  setErrors]  = useState<Errors>({})
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  const setImage = (i: number, val: string) =>
    setForm((f) => {
      const imgs = [...f.images]
      imgs[i] = val
      return { ...f, images: imgs }
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSuccess(true)
      setTimeout(() => router.push('/admin/products'), 1800)
    }, 1200)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="bg-white border border-emerald-100 px-10 py-12 text-center max-w-sm w-full mx-4 shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={26} strokeWidth={2} className="text-emerald-600" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">Product Saved!</h2>
          <p className="text-sm text-[#1A1A1A]/45 font-light">Redirecting to products…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F7F7F5] min-h-screen">

      {/* Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-[0.65rem] text-[#1A1A1A]/35 mb-3 flex-wrap">
          <Link href="/admin" className="hover:text-[#C6973F] transition-colors">Dashboard</Link>
          <ChevronRight size={10} strokeWidth={1.5} />
          <Link href="/admin/products" className="hover:text-[#C6973F] transition-colors">Products</Link>
          <ChevronRight size={10} strokeWidth={1.5} />
          <span className="text-[#C6973F]">Add New</span>
        </nav>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Add New Product</h1>
        <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light">Fill in the product details below</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic info */}
            <div className="bg-white border border-[#1A1A1A]/8 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-[#1A1A1A] pb-3 border-b border-[#1A1A1A]/6">
                Basic Information
              </h2>

              {/* Name */}
              <div>
                <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Kundan Polki Ring"
                  className={`w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.name ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                />
                <FieldError msg={errors.name} />
              </div>

              {/* Description */}
              <div>
                <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the product — craftsmanship, design details, occasion…"
                  className={`w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors resize-none ${errors.description ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                />
                <FieldError msg={errors.description} />
              </div>

              {/* Category + Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    aria-label="Product category"
                    className={`w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.category ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                  >
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <FieldError msg={errors.category} />
                </div>
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Material <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.material}
                    onChange={(e) => set('material', e.target.value)}
                    aria-label="Product material"
                    className={`w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.material ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                  >
                    <option value="">Select material…</option>
                    {MATERIALS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <FieldError msg={errors.material} />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-[#1A1A1A]/8 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-[#1A1A1A] pb-3 border-b border-[#1A1A1A]/6">
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Original price */}
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Original Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(e) => set('price', e.target.value)}
                      placeholder="2999"
                      className={`w-full pl-7 pr-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.price ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                    />
                  </div>
                  <FieldError msg={errors.price} />
                </div>
                {/* Sale price */}
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Sale Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={form.salePrice}
                      onChange={(e) => set('salePrice', e.target.value)}
                      placeholder="1999"
                      className={`w-full pl-7 pr-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.salePrice ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                    />
                  </div>
                  <FieldError msg={errors.salePrice} />
                </div>
                {/* Stock */}
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Stock Qty <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => set('stock', e.target.value)}
                    placeholder="50"
                    className={`w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.stock ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                  />
                  <FieldError msg={errors.stock} />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between py-3 px-4 bg-[#FAFAF8] border border-[#1A1A1A]/8">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Featured Product</p>
                  <p className="text-[0.65rem] text-[#1A1A1A]/40 font-light mt-0.5">
                    Show this product in the Featured Collection on the homepage
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.featured}
                  onClick={() => set('featured', !form.featured)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${form.featured ? 'bg-[#C6973F]' : 'bg-[#1A1A1A]/15'}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${form.featured ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`}
                    style={{ left: form.featured ? '1.4rem' : '0.125rem' }}
                  />
                </button>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white border border-[#1A1A1A]/8 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-[#1A1A1A] pb-3 border-b border-[#1A1A1A]/6">
                Product Images <span className="text-[#1A1A1A]/30 font-light text-xs">(up to 4)</span>
              </h2>
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <span className="text-[0.58rem] text-[#1A1A1A]/25 font-bold">{i + 1}</span>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setImage(i, e.target.value)}
                    placeholder={`Image ${i + 1} URL (https://…)`}
                    className="flex-1 px-4 py-2.5 bg-[#FAFAF8] border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => setImage(i, '')}
                      className="text-[#1A1A1A]/20 hover:text-red-400 transition-colors"
                      aria-label="Clear image URL"
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Sidebar column ── */}
          <div className="space-y-5">

            {/* Summary preview */}
            <div className="bg-white border border-[#1A1A1A]/8 p-5">
              <h2 className="text-[0.65rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold mb-4">
                Preview
              </h2>
              <div className="w-full aspect-square bg-[#FDF6EC] mb-4 flex items-center justify-center border border-[#C6973F]/10">
                {form.images[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={form.images[0]} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-30">
                    <Plus size={24} strokeWidth={0.8} className="text-[#C6973F] mx-auto" />
                    <p className="text-[0.6rem] text-[#1A1A1A]/40 mt-1 font-light">Add image URL</p>
                  </div>
                )}
              </div>
              <p className="font-serif text-base font-semibold text-[#1A1A1A] truncate">
                {form.name || 'Product Name'}
              </p>
              {form.category && (
                <p className="text-[0.65rem] text-[#1A1A1A]/35 font-light mt-0.5">{form.category}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {form.salePrice && (
                  <span className="text-[#C6973F] font-semibold text-sm">₹{Number(form.salePrice).toLocaleString('en-IN')}</span>
                )}
                {form.price && (
                  <span className={`text-sm ${form.salePrice ? 'text-[#1A1A1A]/30 line-through' : 'text-[#C6973F] font-semibold'}`}>
                    ₹{Number(form.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {form.featured && (
                <span className="inline-block mt-2 px-2 py-0.5 text-[0.55rem] font-semibold tracking-wide rounded-full bg-[#C6973F]/12 text-[#C6973F] border border-[#C6973F]/20">
                  Featured
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white border border-[#1A1A1A]/8 p-5 space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : 'Save Product'}
              </button>
              <Link
                href="/admin/products"
                className="w-full py-3 border border-[#1A1A1A]/15 text-[#1A1A1A]/50 text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:border-[#1A1A1A]/25 hover:text-[#1A1A1A]/70 transition-all duration-150 flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>

            {/* Tips */}
            <div className="bg-[#C6973F]/6 border border-[#C6973F]/15 p-5">
              <h3 className="text-[0.62rem] tracking-[0.2em] uppercase text-[#C6973F] font-semibold mb-3">Tips</h3>
              <ul className="space-y-2 text-[0.68rem] text-[#1A1A1A]/45 font-light leading-relaxed">
                <li>• Use high-quality square images for best results</li>
                <li>• Set a sale price lower than original to show a discount badge</li>
                <li>• Enable Featured to showcase on the homepage</li>
                <li>• Stock below 10 will show a low-stock warning</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
