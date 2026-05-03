import { supabase } from '@/lib/supabase'
import { mapSupabaseRowToProduct, type Product } from '@/lib/products'

/** Escape `%` and `_` so user input is safe inside PostgREST `ilike` patterns. */
function escapeIlikeWildcards(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

/**
 * Search products in Supabase (name, category, material, sku). Returns [] on error or empty query.
 */
export async function supabaseSearchProducts(q: string, limit = 60): Promise<Product[]> {
  const raw = q.trim().replace(/,/g, ' ')
  if (!raw) return []

  const term = `%${escapeIlikeWildcards(raw)}%`
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.${term},category.ilike.${term},material.ilike.${term},sku.ilike.${term}`)
    .limit(limit)

  if (error || !data?.length) return []
  return data.map((row) => mapSupabaseRowToProduct(row as Record<string, unknown>))
}
