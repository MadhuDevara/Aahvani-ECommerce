'use client'

import { supabase } from '@/lib/supabase'

/** List all orders (admin dashboard / orders / customers). Requires service-role API. */
export async function fetchAdminOrdersRows(): Promise<{ ok: boolean; orders: Record<string, unknown>[] }> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) return { ok: false, orders: [] }
  const res = await fetch('/api/admin/orders', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return { ok: false, orders: [] }
  const body = (await res.json()) as { orders?: Record<string, unknown>[] }
  return { ok: true, orders: body.orders ?? [] }
}

export async function patchAdminOrderStatus(id: string, status: string): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) return false
  const res = await fetch('/api/admin/orders', {
    method:  'PATCH',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, status }),
  })
  return res.ok
}
