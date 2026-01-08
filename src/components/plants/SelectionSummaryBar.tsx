import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlantSelectionStore } from '@/store/plantSelectionStore'
import { cn } from '@/lib/utils'

export function SelectionSummaryBar() {
  const selectedPlantsMap = usePlantSelectionStore((s) => s.selectedPlants)
  const selectedPlants = useMemo(() => Array.from(selectedPlantsMap.values()), [selectedPlantsMap])
  const totalCount = useMemo(() => selectedPlants.reduce((sum, p) => sum + p.quantity, 0), [selectedPlants])

  if (totalCount === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 transform transition-transform duration-300",
        totalCount > 0 ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="glass-card border-t border-[hsl(var(--sand-200))] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Plant count and preview */}
            <div className="flex items-center gap-4">
              {/* Plant avatars */}
              <div className="flex -space-x-2">
                {selectedPlants.slice(0, 4).map((plant, i) => (
                  <div
                    key={plant.id}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-[hsl(var(--sand-100))]"
                    style={{ zIndex: 4 - i }}
                  >
                    {plant.default_image?.thumbnail ? (
                      <img
                        src={plant.default_image.thumbnail}
                        alt={plant.common_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-[hsl(var(--sand-400))]" />
                      </div>
                    )}
                  </div>
                ))}
                {selectedPlants.length > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-[hsl(var(--oasis-100))] flex items-center justify-center">
                    <span className="text-xs font-medium text-[hsl(var(--oasis-600))]">
                      +{selectedPlants.length - 4}
                    </span>
                  </div>
                )}
              </div>

              {/* Count text */}
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">
                  {totalCount} plant{totalCount !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-[hsl(var(--sand-400))]">
                  {selectedPlants.length} unique species
                </p>
              </div>
            </div>

            {/* Action button */}
            <Link to="/review">
              <Button size="lg" className="gap-2">
                Review Selection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
