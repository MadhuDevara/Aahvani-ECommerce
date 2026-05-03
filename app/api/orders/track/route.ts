import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

/** Guest-safe tracking: match `order_number` + `user_email` (case-insensitive email). */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { orderNumber?: string; email?: string }
    const orderNumber = String(body.orderNumber ?? '').trim()
    const email       = String(body.email ?? '').trim()
    if (!orderNumber || !email || orderNumber.length > 80 || email.length > 320) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .ilike('user_email', email)
      .maybeSingle()

    if (error) {
      console.error('[track-order]', error.message)
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ order: data })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error'
    if (msg.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 503 })
    }
    console.error('[track-order]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
