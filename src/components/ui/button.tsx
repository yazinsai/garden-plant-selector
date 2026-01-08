import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[hsl(var(--oasis-400))] to-[hsl(var(--oasis-500))] text-primary-foreground shadow-md shadow-[hsl(var(--oasis-500)/0.25)] hover:shadow-lg hover:shadow-[hsl(var(--oasis-500)/0.35)] hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-destructive-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "border-2 border-[hsl(var(--oasis-300))] bg-transparent text-[hsl(var(--oasis-600))] hover:bg-[hsl(var(--oasis-50))] hover:border-[hsl(var(--oasis-400))]",
        secondary:
          "bg-[hsl(var(--sand-100))] text-secondary-foreground hover:bg-[hsl(var(--sand-200))]",
        ghost:
          "hover:bg-[hsl(var(--sand-100))] hover:text-[hsl(var(--oasis-600))]",
        link:
          "text-[hsl(var(--oasis-500))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-xl",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
