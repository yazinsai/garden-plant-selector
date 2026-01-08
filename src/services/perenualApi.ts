import type { PlantListResponse, PlantListParams, TrefleListResponse, TreflePlant } from '@/types/api'
import type { Plant, WateringLevel } from '@/types/plant'

// Using Vite proxy to avoid CORS issues
const TREFLE_BASE_URL = '/api/trefle'

// Map Trefle's light value to our sunlight categories
function mapLightToSunlight(light: number | null): string[] {
  if (light === null) return ['full_sun'] // default for Bahrain
  if (light >= 7) return ['full_sun']
  if (light >= 4) return ['part_shade', 'full_sun']
  return ['full_shade', 'part_shade']
}

// Estimate watering needs based on available data
// For Bahrain, we default to drought-tolerant assumptions
function estimateWatering(plant: TreflePlant): WateringLevel {
  // Since Trefle doesn't provide direct watering data,
  // we'll use a simple heuristic based on plant family
  // Desert-adapted families get lower watering
  const droughtTolerantFamilies = [
    'Cactaceae', 'Agavaceae', 'Aizoaceae', 'Euphorbiaceae',
    'Asphodelaceae', 'Crassulaceae', 'Apocynaceae'
  ]

  if (droughtTolerantFamilies.includes(plant.family)) {
    return 'Minimum'
  }

  // Default to Average for most plants
  return 'Average'
}

// Transform Trefle plant to our Plant interface
function transformTreflePlant(treflePlant: TreflePlant): Plant {
  return {
    id: treflePlant.id,
    common_name: treflePlant.common_name || treflePlant.scientific_name,
    scientific_name: [treflePlant.scientific_name],
    other_name: treflePlant.synonyms || null,
    cycle: 'Perennial', // Trefle doesn't provide this, default to Perennial
    watering: estimateWatering(treflePlant),
    sunlight: mapLightToSunlight(null), // List endpoint doesn't have light data
    default_image: treflePlant.image_url ? {
      license: 0,
      license_name: '',
      license_url: '',
      original_url: treflePlant.image_url,
      regular_url: treflePlant.image_url,
      medium_url: treflePlant.image_url,
      small_url: treflePlant.image_url,
      thumbnail: treflePlant.image_url,
    } : null,
  }
}

export async function fetchPlants(params: PlantListParams): Promise<PlantListResponse> {
  const token = import.meta.env.VITE_TREFLE_TOKEN

  if (!token) {
    throw new Error('VITE_TREFLE_TOKEN is not configured. Please add it to your .env file.')
  }

  const perPage = 20
  const currentPage = params.page || 1
  const region = params.region || 'gulf'

  // Build search params
  const searchParams = new URLSearchParams({
    token,
    page: String(currentPage),
  })

  let endpoint: string

  if (region === 'gulf') {
    // Gulf mode: fetch from GST (Gulf States) distribution - single page at a time
    endpoint = '/distributions/gst/plants'

    // Search by name if provided
    if (params.q) {
      searchParams.set('filter[common_name]', params.q)
    }
  } else {
    // Global mode: use species endpoint
    endpoint = '/species'

    if (params.q) {
      endpoint = '/plants/search'
      searchParams.set('q', params.q)
    }

    // Plant type filter (server-side, global only)
    if (params.plantType && params.plantType !== 'all') {
      const habitMap: Record<string, string> = {
        tree: 'Tree',
        shrub: 'Shrub',
        herb: 'Herb',
        vine: 'Vine',
        grass: 'Graminoid',
      }
      if (habitMap[params.plantType]) {
        searchParams.set('filter[growth_habit]', habitMap[params.plantType])
      }
    }

    // Flower color filter (server-side, global only)
    if (params.flowerColor && params.flowerColor !== 'all') {
      searchParams.set('filter[flower_color]', params.flowerColor)
    }
  }

  const response = await fetch(`${TREFLE_BASE_URL}${endpoint}?${searchParams}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const trefleResponse: TrefleListResponse = await response.json()

  const total = trefleResponse.meta.total
  const lastPage = Math.ceil(total / perPage)

  return {
    data: trefleResponse.data.map(transformTreflePlant),
    to: Math.min(currentPage * perPage, total),
    per_page: perPage,
    current_page: currentPage,
    from: (currentPage - 1) * perPage + 1,
    last_page: lastPage,
    total,
  }
}

export async function fetchPlantDetails(plantId: number) {
  const token = import.meta.env.VITE_TREFLE_TOKEN

  if (!token) {
    throw new Error('VITE_TREFLE_TOKEN is not configured')
  }

  const response = await fetch(
    `${TREFLE_BASE_URL}/species/${plantId}?token=${token}`
  )

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}
