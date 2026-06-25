"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils/css"

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled = false, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "switch-cut12 relative inline-flex cursor-pointer h-6 w-11 items-center rounded-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "switch-thumb absolute h-6 w-6 rounded-none transition-transform",
            checked ? "translate-x-5" : "translate-x-0.45"
          )}
        >
          <span className="switch-thumb-rotator block h-full w-full" />
        </span>
      </button>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
