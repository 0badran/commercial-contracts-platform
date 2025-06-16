"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface AlertCardProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  variant?: "info" | "warning" | "error" | "success"
}

export default function AlertCard({ icon: Icon, title, children, variant = "info" }: AlertCardProps) {
  const variantStyles = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-green-200 bg-green-50 text-green-800",
  }

  return (
    <Card className={variantStyles[variant]}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${variantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
