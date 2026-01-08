import { create } from 'zustand'

interface FilterState {
  search: string
  watering: string
  sunlight: string
  cycle: string
  page: number
  // Enhanced filters
  region: 'gulf' | 'all'
  plantType: string
  flowerColor: string
  setSearch: (search: string) => void
  setWatering: (watering: string) => void
  setSunlight: (sunlight: string) => void
  setCycle: (cycle: string) => void
  setPage: (page: number) => void
  setRegion: (region: 'gulf' | 'all') => void
  setPlantType: (plantType: string) => void
  setFlowerColor: (flowerColor: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  watering: 'all',
  sunlight: 'all',
  cycle: 'all',
  page: 1,
  // Enhanced filters - default to Gulf region
  region: 'gulf',
  plantType: 'all',
  flowerColor: 'all',

  setSearch: (search) => set({ search, page: 1 }),
  setWatering: (watering) => set({ watering, page: 1 }),
  setSunlight: (sunlight) => set({ sunlight, page: 1 }),
  setCycle: (cycle) => set({ cycle, page: 1 }),
  setPage: (page) => set({ page }),
  setRegion: (region) => set({ region, page: 1 }),
  setPlantType: (plantType) => set({ plantType, page: 1 }),
  setFlowerColor: (flowerColor) => set({ flowerColor, page: 1 }),
  resetFilters: () =>
    set({
      search: '',
      watering: 'all',
      sunlight: 'all',
      cycle: 'all',
      page: 1,
      region: 'gulf',
      plantType: 'all',
      flowerColor: 'all',
    }),
}))
