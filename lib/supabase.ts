import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

/** Default URL points at local Supabase; if it is not running, undead TCP can hang the UI for minutes. */
const FETCH_MS = 15_000

async function fetchWithDeadline(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_MS)
  const parent = init?.signal
  const onParentAbort = () => ctrl.abort()
  if (parent) {
    if (parent.aborted) {
      clearTimeout(timer)
      return Promise.reject(new DOMException('Aborted', 'AbortError'))
    }
    parent.addEventListener('abort', onParentAbort, { once: true })
  }
  try {
    return await fetch(input, { ...init, signal: ctrl.signal })
  } finally {
    clearTimeout(timer)
    parent?.removeEventListener('abort', onParentAbort)
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { timeout: FETCH_MS },
  global: { fetch: fetchWithDeadline },
})
