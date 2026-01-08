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

// Client-side filter for Gulf plants
function applyClientFilters(plants: Plant[], params: PlantListParams): Plant[] {
  let filtered = plants

  // Search filter
  if (params.q) {
    const query = params.q.toLowerCase()
    filtered = filtered.filter(p =>
      p.common_name.toLowerCase().includes(query) ||
      p.scientific_name.some(s => s.toLowerCase().includes(query))
    )
  }

  // Plant type filter (based on family heuristics since we don't have growth_habit in list)
  if (params.plantType && params.plantType !== 'all') {
    const treeFamilies = ['Fagaceae', 'Pinaceae', 'Cupressaceae', 'Moraceae', 'Oleaceae', 'Sapindaceae', 'Betulaceae', 'Salicaceae', 'Meliaceae', 'Anacardiaceae']
    const shrubFamilies = ['Rosaceae', 'Caprifoliaceae', 'Ericaceae', 'Hydrangeaceae', 'Rhamnaceae']
    const grassFamilies = ['Poaceae', 'Cyperaceae', 'Juncaceae']
    const vineFamilies = ['Vitaceae', 'Convolvulaceae', 'Passifloraceae']

    filtered = filtered.filter(p => {
      const family = (p as Plant & { family?: string }).family || ''
      switch (params.plantType) {
        case 'tree': return treeFamilies.includes(family)
        case 'shrub': return shrubFamilies.includes(family)
        case 'grass': return grassFamilies.includes(family)
        case 'vine': return vineFamilies.includes(family)
        case 'herb': return !treeFamilies.includes(family) && !shrubFamilies.includes(family) && !grassFamilies.includes(family) && !vineFamilies.includes(family)
        default: return true
      }
    })
  }

  return filtered
}

// Store for Gulf plants cache (avoid refetching all pages)
let gulfPlantsCache: Plant[] | null = null
let gulfPlantsCacheTime: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function fetchAllGulfPlants(token: string): Promise<Plant[]> {
  // Return cached data if fresh
  if (gulfPlantsCache && Date.now() - gulfPlantsCacheTime < CACHE_TTL) {
    return gulfPlantsCache
  }

  const allPlants: TreflePlant[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(
      `${TREFLE_BASE_URL}/distributions/gst/plants?token=${token}&page=${page}`
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data: TrefleListResponse = await response.json()
    allPlants.push(...data.data)

    // Check if there are more pages (20 per page)
    hasMore = data.data.length === 20 && allPlants.length < data.meta.total
    page++

    // Safety limit to prevent infinite loops
    if (page > 50) break
  }

  // Transform and cache
  gulfPlantsCache = allPlants.map(p => ({
    ...transformTreflePlant(p),
    family: p.family, // Keep family for filtering
  }))
  gulfPlantsCacheTime = Date.now()

  return gulfPlantsCache
}

export async function fetchPlants(params: PlantListParams): Promise<PlantListResponse> {
  const token = import.meta.env.VITE_TREFLE_TOKEN

  if (!token) {
    throw new Error('VITE_TREFLE_TOKEN is not configured. Please add it to your .env file.')
  }

  const perPage = 20
  const currentPage = params.page || 1
  const region = params.region || 'gulf'

  // Gulf mode: fetch all Gulf plants and filter client-side
  if (region === 'gulf') {
    const allGulfPlants = await fetchAllGulfPlants(token)
    const filtered = applyClientFilters(allGulfPlants, params)

    // Client-side pagination
    const total = filtered.length
    const lastPage = Math.ceil(total / perPage)
    const startIndex = (currentPage - 1) * perPage
    const pageData = filtered.slice(startIndex, startIndex + perPage)

    return {
      data: pageData,
      to: Math.min(currentPage * perPage, total),
      per_page: perPage,
      current_page: currentPage,
      from: startIndex + 1,
      last_page: lastPage,
      total,
    }
  }

  // Global mode: use species endpoint with server-side filters
  const searchParams = new URLSearchParams({
    token,
    page: String(currentPage),
  })

  let endpoint = '/species'

  // Search
  if (params.q) {
    endpoint = '/plants/search'
    searchParams.set('q', params.q)
  }

  // Plant type filter (server-side)
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
