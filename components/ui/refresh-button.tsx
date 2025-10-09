"use client"

import { Button } from "./button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface RefreshButtonProps {
  onRefresh: () => void
  loading?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
  className?: string
  children?: React.ReactNode
}

export function RefreshButton({ 
  onRefresh, 
  loading = false, 
  size = "sm",
  variant = "outline",
  className,
  children 
}: RefreshButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onRefresh}
      disabled={loading}
      className={cn(className)}
    >
      <RefreshCw className={cn(
        "h-4 w-4",
        loading && "animate-spin",
        children && "mr-2"
      )} />
      {children}
    </Button>
  )
}
