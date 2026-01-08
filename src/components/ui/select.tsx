import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-xl border-2 border-[hsl(var(--sand-200))] bg-white/80 px-4 py-2 pr-10 text-sm transition-all duration-200",
            "focus:outline-none focus:border-[hsl(var(--oasis-300))] focus:ring-4 focus:ring-[hsl(var(--oasis-100))]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--sand-400))] pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
