"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  gradient?: string
  textColor?: string
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = "bg-gradient-to-br from-card to-card/80 border-border/50",
  textColor = "text-muted-foreground",
}: StatsCardProps) {
  return (
    <Card className={`card-hover ${gradient}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${textColor}`}>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${textColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${textColor}`}>{subtitle}</p>
      </CardContent>
    </Card>
  )
}
