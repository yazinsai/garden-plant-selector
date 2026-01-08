import { FilterBar } from '@/components/plants/FilterBar'
import { PlantGrid } from '@/components/plants/PlantGrid'
import { Pagination } from '@/components/plants/Pagination'
import { SelectionSummaryBar } from '@/components/plants/SelectionSummaryBar'
import { usePlants } from '@/hooks/usePlants'
import { useFilterStore } from '@/store/filterStore'
import { AlertCircle } from 'lucide-react'

export function BrowsePage() {
  const { search, watering, sunlight, cycle, page, region, plantType, flowerColor, setPage } = useFilterStore()

  const { data, isLoading, error } = usePlants({
    page,
    q: search || undefined,
    watering: watering !== 'all' ? watering : undefined,
    sunlight: sunlight !== 'all' ? sunlight : undefined,
    cycle: cycle !== 'all' ? cycle : undefined,
    region,
    plantType: plantType !== 'all' ? plantType : undefined,
    flowerColor: flowerColor !== 'all' ? flowerColor : undefined,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
          Browse Plants
        </h1>
        <p className="text-[hsl(var(--sand-400))] max-w-2xl">
          Explore plants suitable for Bahrain's hot desert climate. All plants shown are rated for
          hardiness zone 11 or higher, perfect for your garden.
        </p>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Failed to load plants</h3>
              <p className="text-sm text-red-600 mt-1">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Make sure your <code className="bg-red-100 px-1 rounded">VITE_TREFLE_TOKEN</code> is
                configured in your <code className="bg-red-100 px-1 rounded">.env</code> file.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results info */}
      {data && !isLoading && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[hsl(var(--sand-400))]">
            Showing {data.from}–{data.to} of {data.total} plants
          </p>
        </div>
      )}

      {/* Plant grid */}
      <PlantGrid plants={data?.data || []} isLoading={isLoading} />

      {/* Pagination */}
      {data && (
        <Pagination
          currentPage={data.current_page}
          totalPages={data.last_page}
          onPageChange={setPage}
        />
      )}

      {/* Selection summary bar */}
      <SelectionSummaryBar />
    </div>
  )
}
