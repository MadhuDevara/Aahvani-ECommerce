export interface Product {
  id: number
  /** From Supabase `row.id` (UUID or int). Used in `/shop/[routeId]`. */
  routeId?: string
  name: string
  category: string
  originalPrice: number
  salePrice: number
  material: string
  rating: number
  reviews: number
  popularity: number
  bg: string
  label?: string
  sku: string
  /** From Supabase when provided in admin */
  description?: string
  /** From Supabase `sizes` when set in admin */
  sizes?: string[]
}

/** URL segment for product detail: Supabase row `id` via `routeId`, else numeric `id`, else `sku`. */
export function productRouteId(p: Product): string {
  if (p.routeId) return p.routeId
  if (p.id !== 0) return String(p.id)
  return p.sku
}

export function numericProductIdFromRow(row: Record<string, unknown>): number {
  const v = row.id
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && /^\s*\d+\s*$/.test(v)) return Number(v.trim())
  return 0
}

function normalizeSizesFromRow(v: unknown): string[] | undefined {
  if (v == null) return undefined
  if (!Array.isArray(v)) return undefined
  const out = v.filter((x): x is string => typeof x === 'string' && x.trim() !== '')
  return out.length ? out : undefined
}

export function mapSupabaseRowToProduct(row: Record<string, unknown>): Product {
  return {
    id:            numericProductIdFromRow(row),
    routeId:       String(row.id),
    name:          String(row.name ?? ''),
    category:      String(row.category ?? ''),
    originalPrice: Number(row.price ?? 0),
    salePrice:     Number(row.discount_price ?? row.price ?? 0),
    material:      String(row.material ?? ''),
    rating:        Number(row.rating ?? 4.0),
    reviews:       Number(row.reviews ?? 0),
    popularity:    Number(row.popularity ?? 50),
    bg:            String(row.bg ?? 'bg-[#F5EBD8]'),
    label:         row.badge as string | undefined,
    sku:           String(row.sku || row.id || ''),
    description:   row.description != null && String(row.description).trim() !== ''
      ? String(row.description)
      : undefined,
    sizes:         normalizeSizesFromRow(row.sizes),
  }
}

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
