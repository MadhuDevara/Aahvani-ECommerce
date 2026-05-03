/** Email allowed into `/admin` (must match Supabase Auth user). */
export const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'maddy@dkmstack.com').trim()

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
}
