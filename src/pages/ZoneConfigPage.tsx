import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, ArrowRight, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { WateringBadge } from '@/components/plants/WateringBadge'
import { useZoneStore } from '@/store/zoneStore'
import { usePlantSelectionStore } from '@/store/plantSelectionStore'
import { WATERING_GROUPS, normalizeWateringLevel, type WateringLevel } from '@/types/plant'

const wateringLevels: WateringLevel[] = ['None', 'Minimum', 'Average', 'Frequent']

export function ZoneConfigPage() {
  const navigate = useNavigate()
  const { zones, addZone, deleteZone, assignGroupToZone } = useZoneStore()
  const selectedPlantsMap = usePlantSelectionStore((s) => s.selectedPlants)

  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneNumber, setNewZoneNumber] = useState('')

  const selectedPlants = useMemo(() => Array.from(selectedPlantsMap.values()), [selectedPlantsMap])

  // Helper to get plants by watering level
  const getPlantsByWatering = (level: WateringLevel) =>
    selectedPlants.filter((p) => normalizeWateringLevel(p.watering) === level)

  // Get groups that have plants
  const activeGroups = useMemo(() => wateringLevels.filter(
    (level) => getPlantsByWatering(level).length > 0
  ), [selectedPlants])

  // Get assigned groups
  const assignedGroups = new Set(zones.map((z) => z.assignedGroup).filter(Boolean))

  const handleAddZone = () => {
    if (newZoneName && newZoneNumber) {
      addZone({
        name: newZoneName,
        rainbirdZoneNumber: parseInt(newZoneNumber, 10),
        assignedGroup: null,
      })
      setNewZoneName('')
      setNewZoneNumber('')
    }
  }

  const canProceed = activeGroups.every((group) => assignedGroups.has(group))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
          Configure Irrigation Zones
        </h1>
        <p className="text-[hsl(var(--sand-400))]">
          Set up your RainBird irrigation zones and assign plant groups to each zone.
          Plants with similar watering needs should share the same zone.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Zone Management */}
        <Card className="animate-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Your Zones</CardTitle>
            <CardDescription>
              Add your RainBird irrigation zones (typically numbered 1-16)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add zone form */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Zone name (e.g., Front Yard)"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="#"
                min={1}
                max={16}
                value={newZoneNumber}
                onChange={(e) => setNewZoneNumber(e.target.value)}
                className="w-16"
              />
              <Button
                onClick={handleAddZone}
                disabled={!newZoneName || !newZoneNumber}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Zone list */}
            {zones.length === 0 ? (
              <div className="text-center py-8 text-[hsl(var(--sand-400))]">
                <Droplets className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No zones added yet</p>
                <p className="text-xs mt-1">Add your irrigation zones above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--sand-50))] hover:bg-[hsl(var(--sand-100))] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-500))] flex items-center justify-center text-white font-bold shadow-sm">
                      {zone.rainbirdZoneNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[hsl(var(--foreground))] truncate">
                        {zone.name}
                      </p>
                      <p className="text-xs text-[hsl(var(--sand-400))]">
                        RainBird Zone #{zone.rainbirdZoneNumber}
                      </p>
                    </div>
                    {zone.assignedGroup && (
                      <WateringBadge level={zone.assignedGroup} size="sm" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[hsl(var(--sand-400))] hover:text-red-500 hover:bg-red-50"
                      onClick={() => deleteZone(zone.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group to Zone Mapping */}
        <Card className="animate-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Assign Plant Groups</CardTitle>
            <CardDescription>
              Map each watering group to an irrigation zone
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeGroups.length === 0 ? (
              <div className="text-center py-8 text-[hsl(var(--sand-400))]">
                <p className="text-sm">No plant groups to assign</p>
                <Link to="/review" className="text-xs text-[hsl(var(--oasis-500))] hover:underline">
                  Go back and select plants
                </Link>
              </div>
            ) : zones.length === 0 ? (
              <div className="text-center py-8 text-[hsl(var(--sand-400))]">
                <p className="text-sm">Add zones first to assign plant groups</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeGroups.map((level) => {
                  const config = WATERING_GROUPS[level]
                  const plants = getPlantsByWatering(level)
                  const assignedZone = zones.find((z) => z.assignedGroup === level)

                  return (
                    <div
                      key={level}
                      className="p-4 rounded-xl border-2 border-[hsl(var(--sand-200))] hover:border-[hsl(var(--oasis-200))] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <WateringBadge level={level} />
                          <p className="text-sm text-[hsl(var(--sand-400))] mt-2">
                            {plants.length} species • {config.suggestedFrequency}
                          </p>
                        </div>
                      </div>

                      <Select
                        value={assignedZone?.id || ''}
                        onChange={(e) => {
                          // Unassign from previous zone
                          const prevZone = zones.find((z) => z.assignedGroup === level)
                          if (prevZone) {
                            assignGroupToZone(prevZone.id, null)
                          }
                          // Assign to new zone
                          if (e.target.value) {
                            assignGroupToZone(e.target.value, level)
                          }
                        }}
                        options={[
                          { value: '', label: 'Select a zone...' },
                          ...zones.map((z) => ({
                            value: z.id,
                            label: `${z.name} (Zone #${z.rainbirdZoneNumber})`,
                          })),
                        ]}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Progress indicator */}
            {activeGroups.length > 0 && zones.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[hsl(var(--sand-200))]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--sand-400))]">Assignment progress</span>
                  <span className="font-medium text-[hsl(var(--oasis-600))]">
                    {assignedGroups.size} / {activeGroups.length} groups assigned
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[hsl(var(--sand-100))] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-500))] transition-all duration-300"
                    style={{ width: `${(assignedGroups.size / activeGroups.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-[hsl(var(--sand-200))]">
        <Link to="/review">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </Button>
        </Link>

        <Button
          onClick={() => navigate('/summary')}
          disabled={!canProceed}
        >
          View Summary
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {!canProceed && activeGroups.length > 0 && zones.length > 0 && (
        <p className="text-center text-sm text-[hsl(var(--sand-400))] mt-4">
          Assign all plant groups to zones to continue
        </p>
      )}
    </div>
  )
}
