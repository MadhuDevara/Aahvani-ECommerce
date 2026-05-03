import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin-config'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

async function getBearerUser(req: Request) {
  const authz = req.headers.get('authorization')
  if (!authz?.toLowerCase().startsWith('bearer ')) return null
  const token = authz.slice(7).trim()
  if (!token) return null
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  const sb = createClient(url, anon)
  const { data, error } = await sb.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export async function GET(req: Request) {
  try {
    const user = await getBearerUser(req)
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[admin/orders GET]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ orders: data ?? [] })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error'
    if (msg.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ error: 'Set SUPABASE_SERVICE_ROLE_KEY on the server' }, { status: 503 })
    }
    console.error('[admin/orders GET]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getBearerUser(req)
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const body = (await req.json()) as { id?: string; status?: string }
    const id     = String(body.id ?? '').trim()
    const status = String(body.status ?? '').trim()
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    const { error } = await admin.from('orders').update({ status }).eq('id', id)
    if (error) {
      console.error('[admin/orders PATCH]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error'
    if (msg.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ error: 'Set SUPABASE_SERVICE_ROLE_KEY on the server' }, { status: 503 })
    }
    console.error('[admin/orders PATCH]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
