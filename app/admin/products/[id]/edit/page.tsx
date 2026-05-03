'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  AlertCircle,
  Check,
  Plus,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Bangles', 'Pendants', 'Sets']
const MATERIALS  = ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'Kundan', 'Jadau', 'Meenakari', 'Diamond', 'Pearl', 'Mixed Metals']
const PREDEFINED_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size']

function sizesFromRow(raw: unknown): string[] {
  if (!raw || !Array.isArray(raw)) return []
  const predefined = PREDEFINED_SIZES as readonly string[]
  return raw.filter((s): s is string => typeof s === 'string' && predefined.includes(s))
}

interface FormData {
  name:        string
  description: string
  category:    string
  material:    string
  sizes:       string[]
  price:       string
  salePrice:   string
  stock:       string
  featured:    boolean
  images:      string[]
}

const EMPTY: FormData = {
  name: '', description: '', category: '', material: '',
  sizes: [],
  price: '', salePrice: '', stock: '', featured: false,
  images: ['', '', '', ''],
}

type Errors = Partial<Record<keyof FormData, string>>

function validate(f: FormData): Errors {
  const e: Errors = {}
  if (!f.name.trim())        e.name        = 'Product name is required.'
  if (!f.description.trim()) e.description = 'Description is required.'
  if (!f.category)           e.category    = 'Please select a category.'
  if (!f.material)           e.material    = 'Please select a material.'
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

function ComboBox({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder: string
  error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const q = value.trim().toLowerCase()
  const filtered = q
    ? options.filter((o) => o.toLowerCase().includes(q))
    : [...options]

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const inputClass =
    `w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${error ? 'border-red-300' : 'border-[#1A1A1A]/12'}`

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        aria-expanded={open}
        aria-autocomplete="list"
        className={inputClass}
      />
      {open && filtered.length > 0 && (
        <ul
          className="absolute z-20 left-0 right-0 top-full mt-0.5 max-h-48 overflow-y-auto border border-[#1A1A1A]/12 bg-white shadow-md py-1"
          role="listbox"
        >
          {filtered.map((opt) => (
            <li key={opt} role="presentation">
              <button
                type="button"
                role="option"
                className="w-full text-left px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#FAFAF8] transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(opt)
                  setOpen(false)
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function EditProductPage() {
  const router    = useRouter()
  const { id }    = useParams<{ id: string }>()

  const [form,      setForm]      = useState<FormData>(EMPTY)
  const [errors,    setErrors]    = useState<Errors>({})
  const [loading,   setLoading]   = useState(true)
  const [notFound,  setNotFound]  = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [saveError, setSaveError] = useState('')
  const [success,   setSuccess]   = useState(false)

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  const setImage = (i: number, val: string) =>
    setForm((f) => {
      const imgs = [...f.images]
      imgs[i] = val
      return { ...f, images: imgs }
    })

  const toggleSize = (size: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }))

  // ── Load existing product ───────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); setLoading(false); return }

        const images: string[] = Array.isArray(data.images)
          ? [...data.images, '', '', '', ''].slice(0, 4)
          : ['', '', '', '']

        setForm({
          name:        String(data.name        ?? ''),
          description: String(data.description ?? ''),
          category:    String(data.category    ?? ''),
          material:    String(data.material    ?? ''),
          sizes:       sizesFromRow(data.sizes),
          price:       String(data.price       ?? ''),
          salePrice:   String(data.discount_price ?? ''),
          stock:       String(data.stock       ?? ''),
          featured:    Boolean(data.is_featured),
          images,
        })
        setLoading(false)
      })
  }, [id])

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaveError('')
    setSaving(true)

    const { error } = await supabase
      .from('products')
      .update({
        name:           form.name.trim(),
        description:    form.description.trim(),
        category:       form.category,
        material:       form.material,
        price:          Number(form.price),
        discount_price: form.salePrice ? Number(form.salePrice) : null,
        stock:          Number(form.stock),
        is_featured:    form.featured,
        images:         form.images.filter((img) => img.trim() !== ''),
        sizes:          form.sizes,
      })
      .eq('id', id)

    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/admin/products'), 1800)
  }

  // ── States ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="w-9 h-9 border-[3px] border-[#C6973F]/25 border-t-[#C6973F] rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-serif text-[#1A1A1A] mb-3">Product not found.</p>
          <Link href="/admin/products" className="text-[0.7rem] tracking-[0.15em] uppercase text-[#C6973F] hover:text-[#b5872e]">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="bg-white border border-emerald-100 px-10 py-12 text-center max-w-sm w-full mx-4 shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={26} strokeWidth={2} className="text-emerald-600" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">Product Updated!</h2>
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
          <span className="text-[#C6973F]">Edit Product</span>
        </nav>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1A1A]">Edit Product</h1>
        <p className="text-[0.7rem] text-[#1A1A1A]/40 mt-1 font-light">Update the product details below</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic info */}
            <div className="bg-white border border-[#1A1A1A]/8 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-[#1A1A1A] pb-3 border-b border-[#1A1A1A]/6">Basic Information</h2>

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

              <div>
                <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the product…"
                  className={`w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors resize-none ${errors.description ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                />
                <FieldError msg={errors.description} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <ComboBox
                    value={form.category}
                    onChange={(val) => set('category', val)}
                    options={CATEGORIES}
                    placeholder="Select or type category…"
                    error={!!errors.category}
                  />
                  <FieldError msg={errors.category} />
                </div>
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Material <span className="text-red-400">*</span>
                  </label>
                  <ComboBox
                    value={form.material}
                    onChange={(val) => set('material', val)}
                    options={MATERIALS}
                    placeholder="Select or type material…"
                    error={!!errors.material}
                  />
                  <FieldError msg={errors.material} />
                </div>
              </div>

              <div>
                <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                  SIZES
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_SIZES.map((size) => {
                    const selected = form.sizes.includes(size)
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-2 text-xs font-medium border transition-all duration-150 ${
                          selected
                            ? 'border-[#C6973F] text-[#C6973F]'
                            : 'border-[#1A1A1A]/12 text-[#1A1A1A]/50'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-[#1A1A1A]/8 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-[#1A1A1A] pb-3 border-b border-[#1A1A1A]/6">Pricing & Inventory</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Original Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 text-sm">₹</span>
                    <input
                      type="number" min="1" value={form.price}
                      onChange={(e) => set('price', e.target.value)}
                      placeholder="2999"
                      className={`w-full pl-7 pr-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.price ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                    />
                  </div>
                  <FieldError msg={errors.price} />
                </div>
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">Sale Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 text-sm">₹</span>
                    <input
                      type="number" min="1" value={form.salePrice}
                      onChange={(e) => set('salePrice', e.target.value)}
                      placeholder="1999"
                      className={`w-full pl-7 pr-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.salePrice ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                    />
                  </div>
                  <FieldError msg={errors.salePrice} />
                </div>
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-[#1A1A1A]/45 font-semibold block mb-1.5">
                    Stock Qty <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" min="0" value={form.stock}
                    onChange={(e) => set('stock', e.target.value)}
                    placeholder="50"
                    className={`w-full px-4 py-2.5 bg-[#FAFAF8] border text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors ${errors.stock ? 'border-red-300' : 'border-[#1A1A1A]/12'}`}
                  />
                  <FieldError msg={errors.stock} />
                </div>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-[#FAFAF8] border border-[#1A1A1A]/8">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Featured Product</p>
                  <p className="text-[0.65rem] text-[#1A1A1A]/40 font-light mt-0.5">Show on the homepage Featured Collection</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.featured ? 'true' : 'false'}
                  title="Toggle featured"
                  onClick={() => set('featured', !form.featured)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${form.featured ? 'bg-[#C6973F]' : 'bg-[#1A1A1A]/15'}`}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
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
                  <span className="text-[0.58rem] text-[#1A1A1A]/25 font-bold w-5 text-center flex-shrink-0">{i + 1}</span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setImage(i, e.target.value)}
                    placeholder={`Image ${i + 1} URL (https://…)`}
                    className="flex-1 px-4 py-2.5 bg-[#FAFAF8] border border-[#1A1A1A]/12 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/20 focus:outline-none focus:border-[#C6973F]/50 transition-colors"
                  />
                  {url && (
                    <button type="button" onClick={() => setImage(i, '')} className="text-[#1A1A1A]/20 hover:text-red-400 transition-colors" aria-label="Clear image URL">
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Preview */}
            <div className="bg-white border border-[#1A1A1A]/8 p-5">
              <h2 className="text-[0.65rem] tracking-[0.2em] uppercase text-[#1A1A1A]/35 font-semibold mb-4">Preview</h2>
              <div className="w-full aspect-square bg-[#FDF6EC] mb-4 flex items-center justify-center border border-[#C6973F]/10 overflow-hidden">
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
              <p className="font-serif text-base font-semibold text-[#1A1A1A] truncate">{form.name || 'Product Name'}</p>
              {form.category && <p className="text-[0.65rem] text-[#1A1A1A]/35 font-light mt-0.5">{form.category}</p>}
              <div className="flex items-center gap-2 mt-2">
                {form.salePrice && <span className="text-[#C6973F] font-semibold text-sm">₹{Number(form.salePrice).toLocaleString('en-IN')}</span>}
                {form.price && (
                  <span className={`text-sm ${form.salePrice ? 'text-[#1A1A1A]/30 line-through' : 'text-[#C6973F] font-semibold'}`}>
                    ₹{Number(form.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {form.featured && (
                <span className="inline-block mt-2 px-2 py-0.5 text-[0.55rem] font-semibold tracking-wide rounded-full bg-[#C6973F]/12 text-[#C6973F] border border-[#C6973F]/20">Featured</span>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white border border-[#1A1A1A]/8 p-5 space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#C6973F] text-white text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:bg-[#b5872e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                  : 'Update Product'}
              </button>
              {saveError && (
                <p className="flex items-start gap-1.5 text-[0.65rem] text-red-500 font-light px-1">
                  <span className="mt-0.5 flex-shrink-0">⚠</span>{saveError}
                </p>
              )}
              <Link
                href="/admin/products"
                className="w-full py-3 border border-[#1A1A1A]/15 text-[#1A1A1A]/50 text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:border-[#1A1A1A]/25 hover:text-[#1A1A1A]/70 transition-all flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
