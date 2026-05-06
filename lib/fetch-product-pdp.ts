import { mapSupabaseRowToProduct, type Product } from '@/lib/products'
import { supabase } from '@/lib/supabase'

/**
 * Resolve `/products/[slug]`: primary key first, then optional `slug` column (when present in Supabase).
 */
export async function fetchProductByPdpSegment(segment: string): Promise<Product | null> {
  const decoded = decodeURIComponent(segment.trim())
  if (!decoded) return null

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', decoded)
      .maybeSingle()
    if (!error && data) return mapSupabaseRowToProduct(data as Record<string, unknown>)
  } catch {
    /* */
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', decoded)
      .maybeSingle()
    if (!error && data) return mapSupabaseRowToProduct(data as Record<string, unknown>)
  } catch {
    /* e.g. slug column not migrated yet */
  }

  return null
}

export async function fetchRelatedForPdp(
  category: string,
  excludeDbId: string,
  take: number
): Promise<Product[]> {
  if (!category.trim() || !excludeDbId.trim()) return []
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', excludeDbId)
      .limit(take)

    if (error || !data?.length) return []
    return data.map((row) => mapSupabaseRowToProduct(row as Record<string, unknown>))
  } catch {
    return []
  }
}
