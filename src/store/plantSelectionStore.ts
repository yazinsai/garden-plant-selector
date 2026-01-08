import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Plant, SelectedPlant, WateringLevel } from '@/types/plant'

interface PlantSelectionState {
  selectedPlants: Map<number, SelectedPlant>
  selectPlant: (plant: Plant) => void
  deselectPlant: (plantId: number) => void
  updateQuantity: (plantId: number, quantity: number) => void
  clearSelection: () => void
  getSelectedArray: () => SelectedPlant[]
  getSelectedByWatering: (level: WateringLevel) => SelectedPlant[]
  getTotalCount: () => number
}

export const usePlantSelectionStore = create<PlantSelectionState>()(
  persist(
    (set, get) => ({
      selectedPlants: new Map(),

      selectPlant: (plant: Plant) => {
        set((state) => {
          const newMap = new Map(state.selectedPlants)
          if (!newMap.has(plant.id)) {
            newMap.set(plant.id, {
              ...plant,
              quantity: 1,
              selectedAt: new Date(),
            })
          }
          return { selectedPlants: newMap }
        })
      },

      deselectPlant: (plantId: number) => {
        set((state) => {
          const newMap = new Map(state.selectedPlants)
          newMap.delete(plantId)
          return { selectedPlants: newMap }
        })
      },

      updateQuantity: (plantId: number, quantity: number) => {
        set((state) => {
          const newMap = new Map(state.selectedPlants)
          const plant = newMap.get(plantId)
          if (plant) {
            newMap.set(plantId, { ...plant, quantity: Math.max(1, quantity) })
          }
          return { selectedPlants: newMap }
        })
      },

      clearSelection: () => {
        set({ selectedPlants: new Map() })
      },

      getSelectedArray: () => {
        return Array.from(get().selectedPlants.values())
      },

      getSelectedByWatering: (level: WateringLevel) => {
        return Array.from(get().selectedPlants.values()).filter(
          (plant) => plant.watering === level
        )
      },

      getTotalCount: () => {
        return Array.from(get().selectedPlants.values()).reduce(
          (sum, plant) => sum + plant.quantity,
          0
        )
      },
    }),
    {
      name: 'plant-selection',
      storage: createJSONStorage(() => localStorage, {
        replacer: (_, value) => {
          if (value instanceof Map) {
            return { __type: 'Map', value: Array.from(value.entries()) }
          }
          return value
        },
        reviver: (_, value) => {
          if (value && typeof value === 'object' && '__type' in value) {
            const obj = value as { __type: string; value: [number, SelectedPlant][] }
            if (obj.__type === 'Map') {
              return new Map(obj.value)
            }
          }
          return value
        },
      }),
    }
  )
)
