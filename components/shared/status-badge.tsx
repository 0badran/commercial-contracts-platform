"use client"

import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  type?: "contract" | "payment" | "credit"
}

export default function StatusBadge({ status, type = "contract" }: StatusBadgeProps) {
  const getStatusColor = (status: string, type: string) => {
    if (type === "contract") {
      switch (status) {
        case "نشط":
          return "bg-green-100 text-green-800"
        case "بانتظار الموافقة":
          return "bg-blue-100 text-blue-800"
        case "مرفوض":
          return "bg-red-100 text-red-800"
        case "منتهي":
          return "bg-gray-100 text-gray-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    if (type === "payment") {
      switch (status) {
        case "مدفوع":
          return "bg-green-100 text-green-800"
        case "مستحق":
          return "bg-yellow-100 text-yellow-800"
        case "متأخر":
          return "bg-red-100 text-red-800"
        case "جزئي":
          return "bg-orange-100 text-orange-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    if (type === "credit") {
      switch (status) {
        case "A":
          return "bg-green-100 text-green-800"
        case "B":
          return "bg-blue-100 text-blue-800"
        case "C":
          return "bg-yellow-100 text-yellow-800"
        case "D":
          return "bg-orange-100 text-orange-800"
        case "E":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    return "bg-gray-100 text-gray-800"
  }

  return <Badge className={getStatusColor(status, type)}>{status}</Badge>
}
