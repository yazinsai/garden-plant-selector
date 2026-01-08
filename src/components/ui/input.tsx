import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border-2 border-[hsl(var(--sand-200))] bg-white/80 px-4 py-2 text-sm transition-all duration-200",
          "placeholder:text-[hsl(var(--sand-400))]",
          "focus:outline-none focus:border-[hsl(var(--oasis-300))] focus:ring-4 focus:ring-[hsl(var(--oasis-100))]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
