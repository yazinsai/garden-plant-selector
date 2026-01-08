import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--oasis-100))] text-[hsl(var(--oasis-700))] border border-[hsl(var(--oasis-200))]",
        secondary:
          "bg-[hsl(var(--sand-100))] text-[hsl(var(--sand-500))] border border-[hsl(var(--sand-200))]",
        outline:
          "border-2 border-current text-[hsl(var(--oasis-500))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
