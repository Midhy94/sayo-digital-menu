export type Diet = 'vegetarian' | 'non-vegetarian' | 'all'
export type PriceRange = 'all' | 'under30' | 'under50' | 'under100' | 'over100'

export interface Dish {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  category: string
  categoryKey: string
  price: number
  pricePerPiece?: number
  image: string
  images?: string[]
  diet: 'vegetarian' | 'non-vegetarian'
  calories?: number
  isStar?: boolean
  isChefSpecialty?: boolean
  popularity?: number
  ingredients?: string[]
  allergens?: string[]
  /** ISO 3166-1 alpha-2 country code for dish origin (e.g. JP, TH, IN). */
  country?: string
  /** Spice level 0–4: 0 = not spicy, 4 = very hot. */
  spiceLevel?: number
  /** Top-level menu: food, kids, or beverages (used for Show all / Food / Kids / Beverages nav). */
  menuGroup?: 'food' | 'kids' | 'beverages'
}

export interface MenuFilters {
  category: string
  diet: Diet
  priceRange: PriceRange
  priceMin?: number
  priceMax?: number
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'popularity'
  chefSpecialOnly: boolean
}
