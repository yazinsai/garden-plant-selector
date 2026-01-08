export type WateringLevel = 'None' | 'Minimum' | 'Average' | 'Frequent'

export interface PlantImage {
  license: number
  license_name: string
  license_url: string
  original_url: string
  regular_url: string
  medium_url: string
  small_url: string
  thumbnail: string
}

export interface Plant {
  id: number
  common_name: string
  scientific_name: string[]
  other_name: string[] | null
  cycle: 'Perennial' | 'Annual' | 'Biennial' | 'Biannual'
  watering: WateringLevel
  sunlight: string[]
  default_image: PlantImage | null
}

export interface SelectedPlant extends Plant {
  quantity: number
  selectedAt: Date
}

export interface WateringGroup {
  level: WateringLevel
  label: string
  description: string
  suggestedFrequency: string
  color: string
  plants: SelectedPlant[]
}

// Helper to normalize API watering values to known levels
export function normalizeWateringLevel(watering: string | undefined | null): WateringLevel {
  if (!watering) return 'Average'
  const normalized = watering.toLowerCase()
  if (normalized === 'none' || normalized.includes('minimum') && normalized.includes('drought')) return 'None'
  if (normalized === 'minimum' || normalized.includes('low')) return 'Minimum'
  if (normalized === 'frequent' || normalized.includes('high') || normalized.includes('moist')) return 'Frequent'
  // Default to Average for unknown values (including API upgrade messages)
  return 'Average'
}

export const WATERING_GROUPS: Record<WateringLevel, Omit<WateringGroup, 'plants'>> = {
  'None': {
    level: 'None',
    label: 'Minimal',
    description: 'Drought-tolerant, water only during establishment',
    suggestedFrequency: 'Once monthly or less',
    color: 'bg-amber-100 text-amber-800',
  },
  'Minimum': {
    level: 'Minimum',
    label: 'Low',
    description: 'Water when soil is completely dry',
    suggestedFrequency: 'Every 2-3 weeks',
    color: 'bg-green-100 text-green-800',
  },
  'Average': {
    level: 'Average',
    label: 'Medium',
    description: 'Regular watering, allow soil to dry between',
    suggestedFrequency: 'Weekly',
    color: 'bg-blue-100 text-blue-800',
  },
  'Frequent': {
    level: 'Frequent',
    label: 'High',
    description: 'Keep soil consistently moist',
    suggestedFrequency: '2-3 times per week',
    color: 'bg-cyan-100 text-cyan-800',
  },
}
