import { Droplets } from 'lucide-react'
import type { WateringLevel } from '@/types/plant'
import { cn } from '@/lib/utils'

interface WateringBadgeProps {
  level: WateringLevel
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const wateringConfig: Record<WateringLevel, { label: string; drops: number; className: string }> = {
  'None': { label: 'Minimal', drops: 1, className: 'watering-minimal' },
  'Minimum': { label: 'Low', drops: 2, className: 'watering-low' },
  'Average': { label: 'Medium', drops: 3, className: 'watering-medium' },
  'Frequent': { label: 'High', drops: 4, className: 'watering-high' },
}

export function WateringBadge({ level, showLabel = true, size = 'md' }: WateringBadgeProps) {
  // Handle API placeholder responses or unknown levels
  const normalizedLevel = (level && wateringConfig[level]) ? level : 'Average'
  const config = wateringConfig[normalizedLevel]

  return (
    <span
      className={cn(
        'watering-badge',
        config.className,
        size === 'sm' && 'px-2 py-0.5 text-[10px]'
      )}
    >
      <span className="flex">
        {Array.from({ length: config.drops }).map((_, i) => (
          <Droplets
            key={i}
            className={cn(
              size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5',
              i > 0 && '-ml-1'
            )}
            style={{ opacity: 0.5 + (i * 0.15) }}
          />
        ))}
      </span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
