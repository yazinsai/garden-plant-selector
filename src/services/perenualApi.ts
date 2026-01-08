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

// Client-side filter for fields Trefle doesn't support server-side
function applyClientFilters(plants: Plant[], params: PlantListParams): Plant[] {
  let filtered = plants

  // Watering filter (client-side - Trefle doesn't have this)
  if (params.watering && params.watering !== 'all') {
    const wateringMap: Record<string, WateringLevel> = {
      none: 'None',
      minimum: 'Minimum',
      average: 'Average',
      frequent: 'Frequent',
    }
    const targetLevel = wateringMap[params.watering.toLowerCase()]
    if (targetLevel) {
      filtered = filtered.filter(p => p.watering === targetLevel)
    }
  }

  // Sunlight filter (client-side)
  if (params.sunlight && params.sunlight !== 'all') {
    filtered = filtered.filter(p =>
      p.sunlight.some(s => s.toLowerCase().includes(params.sunlight!.toLowerCase()))
    )
  }

  // Cycle filter (client-side)
  if (params.cycle && params.cycle !== 'all') {
    filtered = filtered.filter(p =>
      p.cycle.toLowerCase() === params.cycle!.toLowerCase()
    )
  }

  return filtered
}

export async function fetchPlants(params: PlantListParams): Promise<PlantListResponse> {
  const token = import.meta.env.VITE_TREFLE_TOKEN

  if (!token) {
    throw new Error('VITE_TREFLE_TOKEN is not configured. Please add it to your .env file.')
  }

  const perPage = 20
  const currentPage = params.page || 1
  const region = params.region || 'gulf'

  // Build search params - use species endpoint for both modes
  // This allows us to use all filters (flower_color, growth_habit, etc.)
  const searchParams = new URLSearchParams({
    token,
    page: String(currentPage),
  })

  let endpoint = '/species'

  // Gulf mode: filter by GST (Gulf States) distribution
  if (region === 'gulf') {
    searchParams.set('filter[distribution]', 'gst')
  }

  // Search by name
  if (params.q) {
    endpoint = '/plants/search'
    searchParams.set('q', params.q)
    // Keep distribution filter for Gulf mode search
    if (region === 'gulf') {
      searchParams.set('filter[distribution]', 'gst')
    }
  }

  // Plant type filter (server-side via growth_habit)
  if (params.plantType && params.plantType !== 'all') {
    const habitMap: Record<string, string> = {
      tree: 'tree',
      shrub: 'shrub',
      herb: 'herb',
      vine: 'liana',
      grass: 'graminoid',
    }
    if (habitMap[params.plantType]) {
      searchParams.set('filter[growth_habit]', habitMap[params.plantType])
    }
  }

  // Flower color filter (server-side)
  if (params.flowerColor && params.flowerColor !== 'all') {
    searchParams.set('filter[flower_color]', params.flowerColor)
  }

  const response = await fetch(`${TREFLE_BASE_URL}${endpoint}?${searchParams}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const trefleResponse: TrefleListResponse = await response.json()

  // Transform then apply client-side filters (watering, sunlight, cycle)
  let plants = trefleResponse.data.map(transformTreflePlant)
  plants = applyClientFilters(plants, params)

  const total = trefleResponse.meta.total
  const lastPage = Math.ceil(total / perPage)

  return {
    data: plants,
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
