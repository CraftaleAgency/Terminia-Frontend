"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-14 px-8 text-base gap-2",
}

/**
 * Primary CTA — spinning conic-gradient border ring
 */
export function BorderMagicButton({ children, size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary/50 transition-transform hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {/* spinning gradient ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#2dd4bf_0%,#0d4f5f_50%,#2dd4bf_100%)]"
      />
      {/* inner pill */}
      <span
        className={cn(
          "relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background font-semibold text-foreground backdrop-blur-3xl",
          sizeMap[size]
        )}
      >
        {children}
      </span>
    </button>
  )
}

/**
 * Secondary — subtle shimmer sweep button (single button element, no nesting)
 */
export function SecondaryShimmerButton({ children, size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border bg-secondary font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
