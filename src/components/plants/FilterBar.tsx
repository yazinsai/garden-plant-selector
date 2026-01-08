import { Search, RotateCcw, Globe, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/store/filterStore'
import { useCallback, useState, useEffect } from 'react'

const wateringOptions = [
  { value: 'all', label: 'All Watering' },
  { value: 'none', label: 'Minimal' },
  { value: 'minimum', label: 'Low' },
  { value: 'average', label: 'Medium' },
  { value: 'frequent', label: 'High' },
]

const sunlightOptions = [
  { value: 'all', label: 'All Sunlight' },
  { value: 'full_sun', label: 'Full Sun' },
  { value: 'part_shade', label: 'Part Shade' },
  { value: 'full_shade', label: 'Full Shade' },
]

const cycleOptions = [
  { value: 'all', label: 'All Cycles' },
  { value: 'perennial', label: 'Perennial' },
  { value: 'annual', label: 'Annual' },
  { value: 'biennial', label: 'Biennial' },
]

const plantTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'tree', label: 'Trees' },
  { value: 'shrub', label: 'Shrubs' },
  { value: 'herb', label: 'Herbs' },
  { value: 'grass', label: 'Grasses' },
  { value: 'vine', label: 'Vines' },
]

const flowerColorOptions = [
  { value: 'all', label: 'Any Color' },
  { value: 'white', label: 'White' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'pink', label: 'Pink' },
  { value: 'purple', label: 'Purple' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
]

export function FilterBar() {
  const {
    search, watering, sunlight, cycle, region, plantType, flowerColor,
    setSearch, setWatering, setSunlight, setCycle, setRegion, setPlantType, setFlowerColor,
    resetFilters
  } = useFilterStore()
  const [localSearch, setLocalSearch] = useState(search)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearch])

  const handleReset = useCallback(() => {
    setLocalSearch('')
    resetFilters()
  }, [resetFilters])

  const hasFilters = search || watering !== 'all' || sunlight !== 'all' || cycle !== 'all' || plantType !== 'all' || flowerColor !== 'all'

  return (
    <div className="glass-card rounded-2xl p-4 mb-6 space-y-3">
      {/* Row 1: Search + Region Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--sand-400))]" />
          <Input
            type="text"
            placeholder="Search plants..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Region Toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-[hsl(var(--sand-100))]">
          <button
            onClick={() => setRegion('gulf')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              region === 'gulf'
                ? 'bg-[hsl(var(--oasis-500))] text-white shadow-md'
                : 'text-[hsl(var(--sand-500))] hover:bg-[hsl(var(--sand-200))]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Gulf Plants
          </button>
          <button
            onClick={() => setRegion('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              region === 'all'
                ? 'bg-[hsl(var(--oasis-500))] text-white shadow-md'
                : 'text-[hsl(var(--sand-500))] hover:bg-[hsl(var(--sand-200))]'
            }`}
          >
            <Globe className="w-4 h-4" />
            All Plants
          </button>
        </div>
      </div>

      {/* Row 2: Filter Dropdowns */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={plantType}
          onChange={(e) => setPlantType(e.target.value)}
          options={plantTypeOptions}
          className="w-28"
          disabled={region === 'gulf'}
          title={region === 'gulf' ? 'Plant type filter only available in All Plants mode' : undefined}
        />
        <Select
          value={flowerColor}
          onChange={(e) => setFlowerColor(e.target.value)}
          options={flowerColorOptions}
          className="w-28"
          disabled={region === 'gulf'}
          title={region === 'gulf' ? 'Flower color filter only available in All Plants mode' : undefined}
        />
        <Select
          value={watering}
          onChange={(e) => setWatering(e.target.value)}
          options={wateringOptions}
          className="w-32"
        />
        <Select
          value={sunlight}
          onChange={(e) => setSunlight(e.target.value)}
          options={sunlightOptions}
          className="w-32"
        />
        <Select
          value={cycle}
          onChange={(e) => setCycle(e.target.value)}
          options={cycleOptions}
          className="w-28"
        />

        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-[hsl(var(--sand-400))] hover:text-[hsl(var(--oasis-500))]"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[hsl(var(--sand-200))]">
          <span className="text-xs text-[hsl(var(--sand-400))]">Active:</span>
          {search && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--oasis-50))] text-[hsl(var(--oasis-600))]">
              "{search}"
            </span>
          )}
          {plantType !== 'all' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--oasis-50))] text-[hsl(var(--oasis-600))]">
              {plantTypeOptions.find(o => o.value === plantType)?.label}
            </span>
          )}
          {flowerColor !== 'all' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--oasis-50))] text-[hsl(var(--oasis-600))]">
              {flowerColorOptions.find(o => o.value === flowerColor)?.label} flowers
            </span>
          )}
          {watering !== 'all' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--oasis-50))] text-[hsl(var(--oasis-600))]">
              {wateringOptions.find(o => o.value === watering)?.label}
            </span>
          )}
          {sunlight !== 'all' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--oasis-50))] text-[hsl(var(--oasis-600))]">
              {sunlightOptions.find(o => o.value === sunlight)?.label}
            </span>
          )}
          {cycle !== 'all' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--oasis-50))] text-[hsl(var(--oasis-600))]">
              {cycleOptions.find(o => o.value === cycle)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
