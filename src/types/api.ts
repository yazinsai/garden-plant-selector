import type { Plant } from './plant'

// Trefle API response types
export interface TreflePlant {
  id: number
  slug: string
  common_name: string | null
  scientific_name: string
  image_url: string | null
  genus: string
  family: string
  family_common_name: string | null
  year: number | null
  bibliography: string | null
  author: string | null
  status: string
  rank: string
  synonyms: string[]
  links: {
    self: string
    plant: string
    genus: string
  }
}

export interface TrefleSpeciesDetail {
  id: number
  slug: string
  common_name: string | null
  scientific_name: string
  image_url: string | null
  images: {
    flower?: { image_url: string }[]
    leaf?: { image_url: string }[]
    habit?: { image_url: string }[]
    bark?: { image_url: string }[]
    other?: { image_url: string }[]
  }
  genus: string
  family: string
  growth: {
    light: number | null // 0-10, higher = more sun
    atmospheric_humidity: number | null // 0-10, higher = more humid
    growth_rate: string | null // "Slow", "Moderate", "Rapid"
    drought_tolerance: boolean | null
    soil_nutriments: number | null
    soil_humidity: number | null
  } | null
  specifications: {
    ligneous_type: string | null
    growth_form: string | null
    growth_habit: string | null
    growth_rate: string | null
    average_height: { cm: number } | null
    maximum_height: { cm: number } | null
    toxicity: string | null
  } | null
  distribution: {
    native: string[]
    introduced: string[]
  } | null
}

export interface TrefleListResponse {
  data: TreflePlant[]
  links: {
    self: string
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    total: number
  }
}

export interface PlantListResponse {
  data: Plant[]
  to: number
  per_page: number
  current_page: number
  from: number
  last_page: number
  total: number
}

export interface PlantListParams {
  page?: number
  q?: string
  watering?: string
  sunlight?: string
  cycle?: string
  // Enhanced filters
  region?: 'gulf' | 'all'
  plantType?: string  // tree, shrub, herb, vine, grass
  flowerColor?: string
}
