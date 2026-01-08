import { useMemo } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Leaf, Search, ClipboardList, Settings, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlantSelectionStore } from '@/store/plantSelectionStore'

const steps = [
  { path: '/', label: 'Browse', icon: Search },
  { path: '/review', label: 'Review', icon: ClipboardList },
  { path: '/zones', label: 'Zones', icon: Settings },
  { path: '/summary', label: 'Summary', icon: FileCheck },
]

export function Layout() {
  const location = useLocation()
  const selectedPlantsMap = usePlantSelectionStore((s) => s.selectedPlants)
  const selectedCount = useMemo(
    () => Array.from(selectedPlantsMap.values()).reduce((sum, p) => sum + p.quantity, 0),
    [selectedPlantsMap]
  )

  const currentStepIndex = steps.findIndex((s) => s.path === location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-[hsl(var(--sand-200))] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-600))] flex items-center justify-center shadow-lg shadow-[hsl(var(--oasis-500)/0.3)] group-hover:shadow-xl group-hover:shadow-[hsl(var(--oasis-500)/0.4)] transition-shadow">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  Plant Selector
                </h1>
                <p className="text-xs text-[hsl(var(--sand-400))] -mt-0.5">
                  Bahrain Garden Planner
                </p>
              </div>
            </Link>

            {/* Step Indicator */}
            <nav className="hidden md:flex items-center gap-1">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = location.pathname === step.path
                const isPast = index < currentStepIndex
                const isClickable = index <= currentStepIndex || (index === 1 && selectedCount > 0)

                return (
                  <div key={step.path} className="flex items-center">
                    {index > 0 && (
                      <div
                        className={cn(
                          "w-8 h-0.5 mx-1 rounded-full transition-colors",
                          isPast ? "bg-[hsl(var(--oasis-400))]" : "bg-[hsl(var(--sand-200))]"
                        )}
                      />
                    )}
                    <Link
                      to={isClickable ? step.path : '#'}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
                        isActive && "bg-[hsl(var(--oasis-50))] text-[hsl(var(--oasis-600))]",
                        isPast && !isActive && "text-[hsl(var(--oasis-500))]",
                        !isActive && !isPast && "text-[hsl(var(--sand-400))]",
                        isClickable && !isActive && "hover:bg-[hsl(var(--sand-100))] cursor-pointer",
                        !isClickable && "cursor-not-allowed opacity-50"
                      )}
                      onClick={(e) => !isClickable && e.preventDefault()}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                          isActive && "bg-gradient-to-br from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-500))] text-white shadow-md",
                          isPast && !isActive && "bg-[hsl(var(--oasis-100))] text-[hsl(var(--oasis-600))]",
                          !isActive && !isPast && "bg-[hsl(var(--sand-100))]"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{step.label}</span>
                    </Link>
                  </div>
                )
              })}
            </nav>

            {/* Selection count badge */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--oasis-50))] border border-[hsl(var(--oasis-200))]">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--oasis-400))] animate-pulse" />
                <span className="text-sm font-medium text-[hsl(var(--oasis-600))]">
                  {selectedCount} plant{selectedCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile step indicator */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = location.pathname === step.path
              const isPast = index < currentStepIndex

              return (
                <div key={step.path} className="flex items-center flex-1">
                  {index > 0 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 rounded-full transition-colors",
                        isPast ? "bg-[hsl(var(--oasis-400))]" : "bg-[hsl(var(--sand-200))]"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isActive && "bg-gradient-to-br from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-500))] text-white shadow-md",
                      isPast && !isActive && "bg-[hsl(var(--oasis-100))] text-[hsl(var(--oasis-600))]",
                      !isActive && !isPast && "bg-[hsl(var(--sand-100))] text-[hsl(var(--sand-400))]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-[hsl(var(--sand-400))] no-print">
        <p>Plant data powered by Trefle API • Optimized for Bahrain climate (Zone 11+)</p>
      </footer>
    </div>
  )
}
