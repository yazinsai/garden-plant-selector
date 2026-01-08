import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchPlants } from '@/services/perenualApi'
import type { PlantListParams } from '@/types/api'

export function usePlants(params: PlantListParams) {
  return useQuery({
    queryKey: ['plants', params],
    queryFn: () => fetchPlants(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })
}
