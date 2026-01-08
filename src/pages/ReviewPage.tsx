import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Minus, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WateringBadge } from '@/components/plants/WateringBadge'
import { usePlantSelectionStore } from '@/store/plantSelectionStore'
import { WATERING_GROUPS, normalizeWateringLevel, type WateringLevel, type SelectedPlant } from '@/types/plant'
import { cn } from '@/lib/utils'

const wateringLevels: WateringLevel[] = ['None', 'Minimum', 'Average', 'Frequent']

interface GroupSectionProps {
  level: WateringLevel
  plants: SelectedPlant[]
}

function GroupSection({ level, plants }: GroupSectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { deselectPlant, updateQuantity } = usePlantSelectionStore()
  const config = WATERING_GROUPS[level]

  if (plants.length === 0) return null

  const totalQuantity = plants.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <Card className="overflow-hidden animate-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader
        className="cursor-pointer hover:bg-[hsl(var(--sand-50))] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WateringBadge level={level} />
            <div>
              <CardTitle className="text-lg">{config.label} Water</CardTitle>
              <p className="text-sm text-[hsl(var(--sand-400))] mt-0.5">
                {config.suggestedFrequency} • {plants.length} species, {totalQuantity} total
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <CardContent className="pt-0">
          <div className="border-t border-[hsl(var(--sand-100))] pt-4">
            <p className="text-sm text-[hsl(var(--sand-400))] mb-4">
              {config.description}
            </p>

            <div className="space-y-3">
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[hsl(var(--sand-50))] hover:bg-[hsl(var(--sand-100))] transition-colors"
                >
                  {/* Plant image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                    {plant.default_image?.thumbnail ? (
                      <img
                        src={plant.default_image.thumbnail}
                        alt={plant.common_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[hsl(var(--sand-300))]">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Plant info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[hsl(var(--foreground))] truncate">
                      {plant.common_name}
                    </h4>
                    <p className="text-sm text-[hsl(var(--sand-400))] truncate">
                      {plant.scientific_name[0]}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (plant.quantity <= 1) {
                          deselectPlant(plant.id)
                        } else {
                          updateQuantity(plant.id, plant.quantity - 1)
                        }
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{plant.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(plant.id, plant.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[hsl(var(--sand-400))] hover:text-red-500 hover:bg-red-50"
                    onClick={() => deselectPlant(plant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function ReviewPage() {
  const navigate = useNavigate()
  const selectedPlantsMap = usePlantSelectionStore((s) => s.selectedPlants)
  const clearSelection = usePlantSelectionStore((s) => s.clearSelection)

  const selectedPlants = useMemo(() => Array.from(selectedPlantsMap.values()), [selectedPlantsMap])
  const totalCount = useMemo(() => selectedPlants.reduce((sum, p) => sum + p.quantity, 0), [selectedPlants])

  const groupedPlants = useMemo(() => wateringLevels.map((level) => ({
    level,
    plants: selectedPlants.filter((p) => normalizeWateringLevel(p.watering) === level),
  })), [selectedPlants])

  const hasPlants = totalCount > 0

  if (!hasPlants) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--sand-100))] flex items-center justify-center">
          <svg className="w-10 h-10 text-[hsl(var(--sand-400))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">No plants selected</h2>
        <p className="text-[hsl(var(--sand-400))] mb-6">
          Go back to browse and select some plants for your garden.
        </p>
        <Link to="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse Plants
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
          Review Selection
        </h1>
        <p className="text-[hsl(var(--sand-400))]">
          Your plants are grouped by watering needs. Plants in the same group should be placed
          together in your garden for efficient irrigation.
        </p>
      </div>

      {/* Grouped plants */}
      <div className="space-y-4 mb-8">
        {groupedPlants.map(({ level, plants }) => (
          <GroupSection key={level} level={level} plants={plants} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-[hsl(var(--sand-200))]">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm('Are you sure you want to clear all selected plants?')) {
                clearSelection()
                navigate('/')
              }
            }}
          >
            Clear All
          </Button>
        </div>

        <Button onClick={() => navigate('/zones')}>
          Configure Zones
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
