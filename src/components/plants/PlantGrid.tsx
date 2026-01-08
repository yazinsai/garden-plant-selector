import type { Plant } from '@/types/plant'
import { PlantCard } from './PlantCard'

interface PlantGridProps {
  plants: Plant[]
  isLoading?: boolean
}

function PlantSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] shimmer" />
      <div className="p-3 bg-white/90">
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded-full shimmer" />
          <div className="h-7 w-14 rounded-lg shimmer" />
        </div>
      </div>
    </div>
  )
}

export function PlantGrid({ plants, isLoading }: PlantGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <PlantSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[hsl(var(--sand-100))] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[hsl(var(--sand-400))]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[hsl(var(--sand-500))] mb-2">
          No plants found
        </h3>
        <p className="text-[hsl(var(--sand-400))] text-sm max-w-md mx-auto">
          Try adjusting your filters or search terms to find plants suitable for Bahrain's climate.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {plants.map((plant, index) => (
        <PlantCard key={plant.id} plant={plant} index={index} />
      ))}
    </div>
  )
}
