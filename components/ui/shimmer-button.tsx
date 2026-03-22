"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
}

export function ShimmerButton({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ShimmerButtonProps) {
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  }

  if (variant === "primary") {
    return (
      <button
        className={cn(
          "relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-transform hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--gradient-end)_0%,var(--gradient-start)_50%,var(--gradient-end)_100%)]" />
        <span
          className={cn(
            "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background font-medium text-foreground backdrop-blur-3xl gap-2",
            sizeClasses[size]
          )}
        >
          {children}
        </span>
      </button>
    )
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border bg-[linear-gradient(110deg,var(--secondary),45%,var(--muted),55%,var(--secondary))] bg-[length:200%_100%] font-medium text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background animate-shimmer hover:text-foreground hover:border-primary/30 gap-2",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Standalone components for direct use
export function BorderMagicButton({
  children,
  className,
  size = "md",
  ...props
}: Omit<ShimmerButtonProps, "variant">) {
  return (
    <ShimmerButton variant="primary" size={size} className={className} {...props}>
      {children}
    </ShimmerButton>
  )
}

export function SecondaryShimmerButton({
  children,
  className,
  size = "md",
  ...props
}: Omit<ShimmerButtonProps, "variant">) {
  return (
    <ShimmerButton variant="secondary" size={size} className={className} {...props}>
      {children}
    </ShimmerButton>
  )
}
