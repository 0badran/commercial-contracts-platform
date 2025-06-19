"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface DashboardHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  iconColor: string
}

export default function DashboardHeader({ icon: Icon, title, subtitle, iconColor }: DashboardHeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xs border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Icon className={`h-8 w-8 ${iconColor} mr-3`} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </header>
  )
}
