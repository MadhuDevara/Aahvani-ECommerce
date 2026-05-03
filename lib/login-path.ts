/** Safe internal path for post-login redirect (open redirect guard). */
export function loginPath(nextPath: string): string {
  const p = nextPath.trim() || '/'
  if (!p.startsWith('/') || p.startsWith('//')) return '/auth/login'
  return `/auth/login?next=${encodeURIComponent(p)}`
}
