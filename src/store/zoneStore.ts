import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { IrrigationZone } from '@/types/zone'
import type { WateringLevel } from '@/types/plant'

interface ZoneState {
  zones: IrrigationZone[]
  addZone: (zone: Omit<IrrigationZone, 'id'>) => void
  updateZone: (id: string, updates: Partial<IrrigationZone>) => void
  deleteZone: (id: string) => void
  assignGroupToZone: (zoneId: string, group: WateringLevel | null) => void
  clearZones: () => void
}

export const useZoneStore = create<ZoneState>()(
  persist(
    (set) => ({
      zones: [],

      addZone: (zone) => {
        set((state) => ({
          zones: [
            ...state.zones,
            {
              ...zone,
              id: crypto.randomUUID(),
            },
          ],
        }))
      },

      updateZone: (id, updates) => {
        set((state) => ({
          zones: state.zones.map((zone) =>
            zone.id === id ? { ...zone, ...updates } : zone
          ),
        }))
      },

      deleteZone: (id) => {
        set((state) => ({
          zones: state.zones.filter((zone) => zone.id !== id),
        }))
      },

      assignGroupToZone: (zoneId, group) => {
        set((state) => ({
          zones: state.zones.map((zone) =>
            zone.id === zoneId ? { ...zone, assignedGroup: group } : zone
          ),
        }))
      },

      clearZones: () => {
        set({ zones: [] })
      },
    }),
    {
      name: 'zone-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
