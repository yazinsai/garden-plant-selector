import type { WateringLevel, SelectedPlant } from './plant'

export interface IrrigationZone {
  id: string
  name: string
  rainbirdZoneNumber: number
  assignedGroup: WateringLevel | null
  notes?: string
}

export interface ZoneWithPlants extends IrrigationZone {
  plants: SelectedPlant[]
}
