import { useState } from 'react'
import { Sun, CloudSun, Cloud, Plus, Check, Minus } from 'lucide-react'
import type { Plant } from '@/types/plant'
import { usePlantSelectionStore } from '@/store/plantSelectionStore'
import { WateringBadge } from './WateringBadge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PlantCardProps {
  plant: Plant
  index?: number
}

const sunlightIcons: Record<string, typeof Sun> = {
  'full_sun': Sun,
  'Full sun': Sun,
  'part_shade': CloudSun,
  'Part shade': CloudSun,
  'sun-part_shade': CloudSun,
  'full_shade': Cloud,
  'Full shade': Cloud,
}

export function PlantCard({ plant, index = 0 }: PlantCardProps) {
  const [imageError, setImageError] = useState(false)
  const { selectedPlants, selectPlant, deselectPlant, updateQuantity } = usePlantSelectionStore()

  const selectedPlant = selectedPlants.get(plant.id)
  const isSelected = !!selectedPlant
  const quantity = selectedPlant?.quantity || 0

  const imageUrl = plant.default_image?.medium_url || plant.default_image?.regular_url

  const handleSelect = () => {
    if (isSelected) {
      deselectPlant(plant.id)
    } else {
      selectPlant(plant)
    }
  }

  const handleQuantityChange = (delta: number) => {
    if (selectedPlant) {
      const newQuantity = quantity + delta
      if (newQuantity <= 0) {
        deselectPlant(plant.id)
      } else {
        updateQuantity(plant.id, newQuantity)
      }
    }
  }

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden plant-card-hover animate-in opacity-0",
        isSelected
          ? "ring-2 ring-[hsl(var(--oasis-400))] ring-offset-2 ring-offset-[hsl(var(--sand-50))]"
          : "hover:ring-1 hover:ring-[hsl(var(--sand-300))]"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-[hsl(var(--sand-100))] overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={plant.common_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-[hsl(var(--sand-400))]">
              <svg
                className="w-12 h-12 mx-auto mb-2 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-500))] flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}

        {/* Sunlight icons */}
        <div className="absolute top-3 left-3 flex gap-1">
          {(Array.isArray(plant.sunlight) ? plant.sunlight : [plant.sunlight]).filter(Boolean).slice(0, 2).map((sun, i) => {
            const Icon = sunlightIcons[sun] || Sun
            return (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                title={sun}
              >
                <Icon className="w-3.5 h-3.5 text-amber-500" />
              </div>
            )
          })}
        </div>

        {/* Plant name overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 drop-shadow-md">
            {plant.common_name}
          </h3>
          {plant.scientific_name[0] && (
            <p className="text-white/70 text-xs italic mt-0.5 truncate">
              {plant.scientific_name[0]}
            </p>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3 bg-white/90 backdrop-blur-sm border-t border-[hsl(var(--sand-100))]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <WateringBadge level={plant.watering} size="sm" />
            <span className="text-xs text-[hsl(var(--sand-400))] capitalize">
              {plant.cycle}
            </span>
          </div>

          {isSelected ? (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleSelect}
              className="h-7 px-3 text-xs"
            >
              <Plus className="w-3 h-3" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
