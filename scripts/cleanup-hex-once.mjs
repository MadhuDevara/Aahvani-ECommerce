/**
 * One-off legacy hex → lux Tailwind classes (exempt globals.css, lux-tokens.ts).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SKIP_FILES = new Set([
  path.join(ROOT, 'app', 'globals.css'),
  path.join(ROOT, 'lib', 'lux-tokens.ts'),
])

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.next' || ent.name === '.git') continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts|css)$/.test(ent.name)) out.push(p)
  }
  return out
}

/** Longest / most specific first */
const RULES = [
  // Gold (#C6973F legacy brand — map to lux-gold token)
  [/text-\[#C6973F\]\/70/g, 'text-lux-gold/70'],
  [/text-\[#C6973F\]\/60/g, 'text-lux-gold/60'],
  [/text-\[#C6973F\]\/50/g, 'text-lux-gold/50'],
  [/text-\[#C6973F\]\/45/g, 'text-lux-gold/45'],
  [/text-\[#C6973F\]\/40/g, 'text-lux-gold/40'],
  [/text-\[#C6973F\]\/35/g, 'text-lux-gold/35'],
  [/text-\[#C6973F\]\/30/g, 'text-lux-gold/30'],
  [/text-\[#C6973F\]\/25/g, 'text-lux-gold/25'],
  [/text-\[#C6973F\]\/20/g, 'text-lux-gold/20'],
  [/text-\[#C6973F\]\/12/g, 'text-lux-gold/12'],
  [/text-\[#C6973F\]\/8/g, 'text-lux-gold/8'],
  [/hover:text-\[#C6973F\]/g, 'hover:text-lux-gold'],
  [/group-hover:text-\[#C6973F\]/g, 'group-hover:text-lux-gold'],
  [/border-\[#C6973F\]\/50/g, 'border-lux-gold/50'],
  [/border-\[#C6973F\]\/30/g, 'border-lux-gold/30'],
  [/border-\[#C6973F\]\/25/g, 'border-lux-gold/25'],
  [/border-\[#C6973F\]\/20/g, 'border-lux-gold/20'],
  [/border-\[#C6973F\]\/12/g, 'border-lux-gold/12'],
  [/bg-\[#C6973F\]\/12/g, 'bg-lux-gold/12'],
  [/bg-\[#C6973F\]\/10/g, 'bg-lux-gold/10'],
  [/bg-\[#C6973F\]\/8/g, 'bg-lux-gold/8'],
  [/bg-\[#C6973F\]\/6/g, 'bg-lux-gold/6'],
  [/bg-\[#C6973F\]\/0/g, 'bg-lux-gold/0'],
  [/ring-\[#C6973F\]/g, 'ring-lux-gold'],
  [/fill-\[#C6973F\]/g, 'fill-lux-gold'],
  [/stroke-\[#C6973F\]/g, 'stroke-lux-gold'],
  [/text-\[#C6973F\]/g, 'text-lux-gold'],
  [/bg-\[#C6973F\]/g, 'bg-lux-gold'],
  [/border-\[#C6973F\]/g, 'border-lux-gold'],
  [/from-\[#C6973F\]/g, 'from-lux-gold'],

  // Ink (#1A1A1A → lux-ink)
  [/text-\[#1A1A1A\]\/80/g, 'text-lux-ink/80'],
  [/text-\[#1A1A1A\]\/65/g, 'text-lux-ink/65'],
  [/text-\[#1A1A1A\]\/60/g, 'text-lux-ink/60'],
  [/text-\[#1A1A1A\]\/55/g, 'text-lux-ink/55'],
  [/text-\[#1A1A1A\]\/50/g, 'text-lux-ink/50'],
  [/text-\[#1A1A1A\]\/45/g, 'text-lux-ink/45'],
  [/text-\[#1A1A1A\]\/40/g, 'text-lux-ink/40'],
  [/text-\[#1A1A1A\]\/35/g, 'text-lux-ink/35'],
  [/text-\[#1A1A1A\]\/30/g, 'text-lux-ink/30'],
  [/text-\[#1A1A1A\]\/25/g, 'text-lux-ink/25'],
  [/text-\[#1A1A1A\]/g, 'text-lux-ink'],
  [/border-\[#1A1A1A\]\/8/g, 'border-lux-ink/8'],
  [/border-\[#1A1A1A\]\/6/g, 'border-lux-ink/6'],
  [/border-\[#1A1A1A\]\/12/g, 'border-lux-ink/12'],
  [/border-\[#1A1A1A\]\/15/g, 'border-lux-ink/15'],
  [/border-\[#1A1A1A\]\/20/g, 'border-lux-ink/20'],
  [/divide-\[#1A1A1A\]\/8/g, 'divide-lux-ink/8'],
  [/divide-\[#1A1A1A\]\/6/g, 'divide-lux-ink/6'],
  [/bg-\[#1A1A1A\]\/8/g, 'bg-lux-ink/8'],
  [/fill-\[#1A1A1A\]\/10/g, 'fill-lux-ink/10'],
  [/shadow-\[#1A1A1A\]/g, 'shadow-lux-ink'],

  // Blacks / ivories / misc
  [/bg-\[#0a0a0a\]\/45/g, 'bg-lux-black/45'],
  [/bg-\[#0a0a0a\]/g, 'bg-lux-black'],
  [/text-\[#0a0a0a\]/g, 'text-lux-black'],
  [/bg-\[#FDF6EC\]\/50/g, 'bg-lux-ivory/50'],
  [/bg-\[#FDF6EC\]/g, 'bg-lux-ivory'],
  [/bg-\[#F9F6F1\]/g, 'bg-lux-ivory'],
  [/border-\[#FDF6EC\]/g, 'border-lux-ivory'],

  // Hover greens / secondary (replace hex with Tailwind semantic)
  [/text-\[#25D366\]/g, 'text-emerald-600'],
  [/border-\[#25D366\]/g, 'border-emerald-600'],
  [/hover:border-\[#25D366\]/g, 'hover:border-emerald-600'],
  [/text-\[#4CAF50\]/g, 'text-emerald-600'],

  // Gold hover variants from old palette
  [/hover:bg-\[#b5872e\]/g, 'hover:bg-lux-gold-hover'],
  [/active:bg-\[#a07528\]/g, 'active:bg-lux-gold-hover'],
  [/hover:bg-\[#C6973F\]/g, 'hover:bg-lux-gold'],
  [/fill-\[#EB001B\]/g, 'fill-red-600'],
  [/fill-\[#F79E1B\]/g, 'fill-amber-500'],
  [/fill-\[#FF5F00\]/g, 'fill-orange-500'],

  // Product thumbnails (map to lux ivory spectrum)
  [/bg-\[#F5EBD8\]/g, 'bg-lux-ivory-muted'],
  [/bg-\[#EDE4D5\]/g, 'bg-lux-ivory-deep'],
  [/bg-\[#F9F0E3\]/g, 'bg-lux-ivory'],
  [/bg-\[#EFE0C9\]/g, 'bg-lux-ivory-muted'],

  // Chart / visa blues — use slate for card art literals in TSX SVG text
  [/#1A1F71/g, 'currentColor'],

  // Shadow rgba legacy
  [/hover:shadow-\[0_8px_32px_rgba\(198,151,63,0\.10\)\]/g, 'hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--lux-gold)_10%,transparent)]'],
  [/hover:shadow-\[0_8px_32px_rgba\(198,151,63,0\.12\)\]/g, 'hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--lux-gold)_12%,transparent)]'],
  [/hover:shadow-\[0_8px_32px_rgba\(198,151,63,0\.1\)\]/g, 'hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--lux-gold)_10%,transparent)]'],
  [/shadow-\[-12px_0_48px_rgba\(0,0,0,0\.12\)\]/g, 'shadow-[var(--lux-shadow-nav)]'],

  // Border t gold spinner
  [/border-t-\[#C6973F\]/g, 'border-t-lux-gold'],
  [/border-\[#C6973F\]\/25/g, 'border-lux-gold/25'],
  [/border-\[3px\] border-\[#C6973F\]\/25 border-t-\[#C6973F\]/g, 'border-[3px] border-lux-gold/25 border-t-lux-gold'],
]

let changed = 0
for (const file of walk(ROOT)) {
  if (SKIP_FILES.has(file)) continue
  let s = fs.readFileSync(file, 'utf8')
  if (!s.includes('#')) continue
  const orig = s
  for (const [re, rep] of RULES) s = s.replace(re, rep)
  if (s !== orig) {
    fs.writeFileSync(file, s)
    changed++
    console.log('updated', path.relative(ROOT, file))
  }
}
console.log('files touched:', changed)
