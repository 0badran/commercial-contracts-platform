"use client"

import { Card, CardContent } from "@/components/ui/card"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ message = "جاري التحميل...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center">
          <div
            className={`animate-spin rounded-full border-b-2 border-primary mx-auto mb-4 ${sizeClasses[size]}`}
          ></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoadingSpinner
