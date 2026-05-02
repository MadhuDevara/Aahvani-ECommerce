export interface Product {
  id: number
  name: string
  category: string
  originalPrice: number
  salePrice: number
  material: string
  rating: number
  reviews: number
  popularity: number
  bg: string
  label?: string
  sku: string
}

export const PRODUCTS: Product[] = [
  { id: 12, name: 'Kundan Polki Ring',       category: 'Rings',     originalPrice: 4999,  salePrice: 3499, material: 'Gold Plated', rating: 4.8, reviews: 124, popularity: 95,  label: 'Best Seller', bg: 'bg-[#F5EBD8]', sku: 'AHV-RNG-012' },
  { id: 11, name: 'Meenakari Jhumka',        category: 'Earrings',  originalPrice: 2499,  salePrice: 1799, material: 'Silver',      rating: 4.5, reviews: 89,  popularity: 88,  label: 'New',         bg: 'bg-[#EFE0C9]', sku: 'AHV-EAR-011' },
  { id: 10, name: 'Temple Necklace Set',     category: 'Necklaces', originalPrice: 7999,  salePrice: 5499, material: 'Gold Plated', rating: 4.9, reviews: 203, popularity: 98,  label: 'Best Seller', bg: 'bg-[#F9F0E3]', sku: 'AHV-NEC-010' },
  { id: 9,  name: 'Jadau Bangle Pair',       category: 'Bracelets', originalPrice: 5499,  salePrice: 3999, material: 'Kundan',      rating: 4.6, reviews: 67,  popularity: 80,                        bg: 'bg-[#EDE4D5]', sku: 'AHV-BRC-009' },
  { id: 8,  name: 'Oxidised Chandbali',      category: 'Earrings',  originalPrice: 1499,  salePrice:  999, material: 'Oxidised',    rating: 3.5, reviews: 45,  popularity: 75,  label: 'Sale',        bg: 'bg-[#F2E9D8]', sku: 'AHV-EAR-008' },
  { id: 7,  name: 'Pearl Drop Necklace',     category: 'Necklaces', originalPrice: 3999,  salePrice: 2799, material: 'Pearl',       rating: 4.7, reviews: 156, popularity: 85,                        bg: 'bg-[#F7EDE0]', sku: 'AHV-NEC-007' },
  { id: 6,  name: 'Polki Solitaire Ring',    category: 'Rings',     originalPrice: 3499,  salePrice: 2499, material: 'Gold Plated', rating: 4.4, reviews: 78,  popularity: 72,  label: 'New',         bg: 'bg-[#F5EBD8]', sku: 'AHV-RNG-006' },
  { id: 5,  name: 'Navratan Kada',           category: 'Bracelets', originalPrice: 6999,  salePrice: 4999, material: 'Gold Plated', rating: 4.8, reviews: 112, popularity: 90,  label: 'Best Seller', bg: 'bg-[#EDE4D5]', sku: 'AHV-BRC-005' },
  { id: 4,  name: 'Filigree Silver Studs',   category: 'Earrings',  originalPrice: 1299,  salePrice:  899, material: 'Silver',      rating: 3.8, reviews: 34,  popularity: 65,                        bg: 'bg-[#EFE0C9]', sku: 'AHV-EAR-004' },
  { id: 3,  name: 'Rani Haar Set',           category: 'Sets',      originalPrice: 12999, salePrice: 8999, material: 'Gold Plated', rating: 5.0, reviews: 289, popularity: 100, label: 'Premium',     bg: 'bg-[#F9F0E3]', sku: 'AHV-SET-003' },
  { id: 2,  name: 'Kundan Maang Tikka Set',  category: 'Sets',      originalPrice: 4499,  salePrice: 3199, material: 'Kundan',      rating: 4.6, reviews: 91,  popularity: 82,                        bg: 'bg-[#F5EBD8]', sku: 'AHV-SET-002' },
  { id: 1,  name: 'Oxidised Statement Ring', category: 'Rings',     originalPrice: 1999,  salePrice: 1299, material: 'Oxidised',    rating: 3.2, reviews: 28,  popularity: 60,  label: 'Sale',        bg: 'bg-[#EFE0C9]', sku: 'AHV-RNG-001' },
]

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
