import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Copy, Download, RotateCcw, Check } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WateringBadge } from '@/components/plants/WateringBadge'
import { useZoneStore } from '@/store/zoneStore'
import { usePlantSelectionStore } from '@/store/plantSelectionStore'
import { WATERING_GROUPS, normalizeWateringLevel } from '@/types/plant'

export function SummaryPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const zones = useZoneStore((s) => s.zones)
  const clearZones = useZoneStore((s) => s.clearZones)
  const selectedPlantsMap = usePlantSelectionStore((s) => s.selectedPlants)
  const clearSelection = usePlantSelectionStore((s) => s.clearSelection)

  const selectedPlants = useMemo(() => Array.from(selectedPlantsMap.values()), [selectedPlantsMap])

  // Get zones with their assigned plants
  const zonesWithPlants = useMemo(() => zones
    .filter((zone) => zone.assignedGroup)
    .map((zone) => ({
      ...zone,
      plants: selectedPlants.filter((p) => normalizeWateringLevel(p.watering) === zone.assignedGroup),
      config: WATERING_GROUPS[zone.assignedGroup!],
    })), [zones, selectedPlants])

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = async () => {
    const text = zonesWithPlants
      .map((zone) => {
        const plantList = zone.plants
          .map((p) => `  - ${p.common_name} (${p.quantity})`)
          .join('\n')
        return `${zone.name} (RainBird Zone #${zone.rainbirdZoneNumber})\nWatering: ${zone.config.suggestedFrequency}\nPlants:\n${plantList}`
      })
      .join('\n\n')

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      zones: zonesWithPlants.map((zone) => ({
        name: zone.name,
        rainbirdZoneNumber: zone.rainbirdZoneNumber,
        wateringSchedule: zone.config.suggestedFrequency,
        wateringLevel: zone.config.label,
        plants: zone.plants.map((p) => ({
          id: p.id,
          commonName: p.common_name,
          scientificName: p.scientific_name[0],
          quantity: p.quantity,
        })),
      })),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'garden-plan.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? This will clear all selections and zones.')) {
      clearSelection()
      clearZones()
      navigate('/')
    }
  }

  if (zonesWithPlants.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--sand-100))] flex items-center justify-center">
          <svg className="w-10 h-10 text-[hsl(var(--sand-400))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">No zones configured</h2>
        <p className="text-[hsl(var(--sand-400))] mb-6">
          Configure your irrigation zones and assign plant groups first.
        </p>
        <Link to="/zones">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Configure Zones
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 print:mb-4">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
          Garden Plan Summary
        </h1>
        <p className="text-[hsl(var(--sand-400))] print:hidden">
          Your complete irrigation plan is ready. Print or export to reference when planting.
        </p>
        <p className="hidden print:block text-sm text-[hsl(var(--sand-400))]">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Export actions */}
      <div className="flex flex-wrap gap-2 mb-6 no-print">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleExportJSON}>
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
      </div>

      {/* Zone summary cards */}
      <div className="space-y-6">
        {zonesWithPlants.map((zone, index) => (
          <Card
            key={zone.id}
            className="animate-in overflow-hidden print:shadow-none print:border-2"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="bg-gradient-to-r from-[hsl(var(--oasis-50))] to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-600))] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {zone.rainbirdZoneNumber}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{zone.name}</CardTitle>
                      <p className="text-sm text-[hsl(var(--sand-400))]">
                        RainBird Zone #{zone.rainbirdZoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
                <WateringBadge level={zone.assignedGroup!} />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Watering schedule */}
              <div className="mb-4 p-3 rounded-xl bg-[hsl(var(--sand-50))]">
                <p className="text-sm font-medium text-[hsl(var(--oasis-600))]">
                  Watering Schedule
                </p>
                <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  {zone.config.suggestedFrequency}
                </p>
                <p className="text-sm text-[hsl(var(--sand-400))] mt-1">
                  {zone.config.description}
                </p>
              </div>

              {/* Plant list */}
              <div>
                <p className="text-sm font-medium text-[hsl(var(--sand-500))] mb-3">
                  Plants in this zone ({zone.plants.reduce((sum, p) => sum + p.quantity, 0)} total)
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {zone.plants.map((plant) => (
                    <div
                      key={plant.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[hsl(var(--sand-100))]"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[hsl(var(--sand-100))] flex-shrink-0">
                        {plant.default_image?.thumbnail ? (
                          <img
                            src={plant.default_image.thumbnail}
                            alt={plant.common_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[hsl(var(--sand-300))]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[hsl(var(--foreground))] truncate">
                          {plant.common_name}
                        </p>
                        <p className="text-xs text-[hsl(var(--sand-400))]">
                          Qty: {plant.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-[hsl(var(--sand-200))] no-print">
        <Link to="/zones">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Zones
          </Button>
        </Link>

        <Button variant="secondary" onClick={handleStartOver}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>

      {/* Print footer */}
      <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-[hsl(var(--sand-400))]">
        <p>Plant Selector for Bahrain Gardens • Optimized for Zone 11+ Climate</p>
      </div>
    </div>
  )
}
