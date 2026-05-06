import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SKIP = new Set([path.join(ROOT, 'app', 'globals.css'), path.join(ROOT, 'lib', 'lux-tokens.ts')])

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.next' || ent.name === '.git') continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts|css)$/.test(ent.name)) out.push(p)
  }
  return out
}

const RULES = [
  [/border-\[#1A1A1A\]\/10/g, 'border-lux-ink/10'],
  [/border-\[#1A1A1A\]\/25/g, 'border-lux-ink/25'],
  [/border-\[#1A1A1A\]\/30/g, 'border-lux-ink/30'],
  [/border-\[#1A1A1A\]\/08/g, 'border-lux-ink/8'],
  [/border-\[#1A1A1A\]\/5/g, 'border-lux-ink/5'],
  [/bg-\[#1A1A1A\]\/50/g, 'bg-lux-black/50'],
  [/bg-\[#1A1A1A\]\/15/g, 'bg-lux-ink/15'],
  [/bg-\[#1A1A1A\]\/10/g, 'bg-lux-ink/10'],
  [/bg-\[#1A1A1A\]\/5/g, 'bg-lux-ink/5'],
  [/bg-\[#1A1A1A\]\/6/g, 'bg-lux-ink/6'],
  [/bg-\[#1A1A1A\]\/45/g, 'bg-lux-black/45'],
  [/bg-\[#1A1A1A\]/g, 'bg-lux-black'],
  [/border-\[#1A1A1A\]/g, 'border-lux-ink'],
  [/text-\[#1A1A1A\]\/25/g, 'text-lux-ink/25'],
  [/text-\[#1A1A1A\]\/20/g, 'text-lux-ink/20'],
  [/bg-\[#FAFAF8\]\/80/g, 'bg-lux-ivory/80'],
  [/bg-\[#FAFAF8\]/g, 'bg-lux-ivory'],
  [/hover:bg-\[#FAFAF8\]/g, 'hover:bg-lux-ivory'],
  [/hover:bg-\[#1A1A1A\]/g, 'hover:bg-lux-black'],
  [/hover:border-\[#1A1A1A\]/g, 'hover:border-lux-ink'],
  [/placeholder-\[#1A1A1A\]\/25/g, 'placeholder-lux-ink/25'],
  [/placeholder-\[#1A1A1A\]\/20/g, 'placeholder-lux-ink/20'],
  [/bg-\[#1A1A1A\]\/6/g, 'bg-lux-ink/6'],
  [/bg-\[#1A1A1A\]/g, 'bg-lux-black'],
  [/hover:text-\[#b5872e\]/g, 'hover:text-lux-gold-hover'],
  [/hover:bg-\[#2a2a2a\]/g, 'hover:bg-lux-black/90'],
  [/accent-\[#C6973F\]/g, 'accent-lux-gold'],
  [/bg-\[#F7EDD8\]/g, 'bg-lux-ivory-muted'],
  [/bg-\[#F0E4CC\]/g, 'bg-lux-ivory-deep'],
  [/bg-\[#F3EAD6\]/g, 'bg-lux-ivory-muted'],
  [/to-\[#C6973F\]\/5/g, 'to-lux-gold/5'],
  [/to-\[#F0E4CC\]\/0/g, 'to-transparent'],
  [/fill="#C6973F"/g, 'fill="var(--lux-gold)"'],
  [/fill='#C6973F'/g, "fill='var(--lux-gold)'"],
  [/fill="#C6973F" fillOpacity="0.5"/g, 'fill="var(--lux-gold)" fillOpacity={0.5}'],
  [/fill="#C6973F" fillOpacity="0.35"/g, 'fill="var(--lux-gold)" fillOpacity={0.35}'],
]

let changed = 0
for (const file of walk(ROOT)) {
  if (SKIP.has(file)) continue
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
