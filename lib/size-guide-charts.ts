/** Reference tables for jewellery sizing (not product catalogue data). */

export const RING_SIZES = [
  { indian: '5',  diameter: '14.0', circumference: '44.0' },
  { indian: '6',  diameter: '14.4', circumference: '45.3' },
  { indian: '7',  diameter: '14.8', circumference: '46.5' },
  { indian: '8',  diameter: '15.2', circumference: '47.8' },
  { indian: '9',  diameter: '15.6', circumference: '49.0' },
  { indian: '10', diameter: '16.1', circumference: '50.6' },
  { indian: '11', diameter: '16.5', circumference: '51.8' },
  { indian: '12', diameter: '16.9', circumference: '53.1' },
  { indian: '13', diameter: '17.3', circumference: '54.4' },
  { indian: '14', diameter: '17.7', circumference: '55.6' },
  { indian: '15', diameter: '18.1', circumference: '56.9' },
  { indian: '16', diameter: '18.5', circumference: '58.1' },
  { indian: '17', diameter: '19.0', circumference: '59.7' },
  { indian: '18', diameter: '19.4', circumference: '61.0' },
  { indian: '19', diameter: '19.8', circumference: '62.2' },
  { indian: '20', diameter: '20.2', circumference: '63.5' },
  { indian: '21', diameter: '20.6', circumference: '64.7' },
  { indian: '22', diameter: '21.0', circumference: '66.0' },
] as const

export const NECKLACE_LENGTHS = [
  { inches: '14"', cm: '36 cm', name: 'Collar',       desc: 'Sits at the base of the neck. Ideal for open necklines.' },
  { inches: '16"', cm: '41 cm', name: 'Choker',       desc: 'Rests on the collarbone. Most popular everyday length.' },
  { inches: '18"', cm: '46 cm', name: 'Princess',     desc: 'Just below the collarbone. Versatile — suits most necklines.' },
  { inches: '20"', cm: '51 cm', name: 'Matinee',      desc: 'Falls over the chest. Elegant for formal and festive wear.' },
  { inches: '22"', cm: '56 cm', name: 'Matinee long', desc: 'Between matinee and opera; strong presence on the décolletage.' },
  { inches: '24"', cm: '61 cm', name: 'Opera',       desc: 'Reaches the bust line. Statement length for special occasions.' },
  { inches: '30"', cm: '76 cm', name: 'Rope / Lariat', desc: 'Long and dramatic. Can be layered, looped or knotted.' },
] as const

export const BRACELET_SIZES = [
  { size: 'XS', wrist: '13–14 cm', bracelet: '15–16 cm' },
  { size: 'S',  wrist: '14–15 cm', bracelet: '16–17 cm' },
  { size: 'M',  wrist: '15–17 cm', bracelet: '17–18 cm' },
  { size: 'L',  wrist: '17–18 cm', bracelet: '19–20 cm' },
  { size: 'XL', wrist: '18–19 cm', bracelet: '20–21 cm' },
] as const

export type SizeGuideVariant = 'rings' | 'necklaces' | 'bracelets' | 'sets' | 'earrings' | 'other'

/** Maps Supabase `product.category` to which in-modal guide to show. */
export function sizeGuideVariantFromCategory(category: string): SizeGuideVariant {
  const c = category.trim().toLowerCase()
  if (c === 'earrings') return 'earrings'
  if (c === 'rings') return 'rings'
  if (c === 'necklaces') return 'necklaces'
  if (c === 'bracelets') return 'bracelets'
  if (c === 'sets') return 'sets'
  return 'other'
}
