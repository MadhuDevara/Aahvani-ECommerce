/**
 * Mirrors `:root` / `@theme` in `app/globals.css` for typed references in TS only.
 * Prefer Tailwind classes (`bg-lux-ivory`, `text-lux-gold`, …) in components.
 */
export const lux = {
  black: '#0a0a0a',
  ivory: '#f5f0e8',
  ivoryMuted: '#ebe6de',
  gold: '#c9a96e',
  goldHover: '#b8955a',
  stone: '#7a756c',
  stoneLight: '#d4cfc4',
  ink: '#121212',
} as const

export type LuxTokenKey = keyof typeof lux
