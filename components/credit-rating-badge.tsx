import { Badge } from "@/components/ui/badge"

interface CreditRatingBadgeProps {
  rating: "A" | "B" | "C" | "D" | "E"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function CreditRatingBadge({ rating, size = "md", showLabel = false }: CreditRatingBadgeProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "A":
        return "bg-green-100 text-green-800 border-green-200" // ممتاز
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200" // جيد
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200" // متوسط
      case "D":
        return "bg-orange-100 text-orange-800 border-orange-200" // مقبول
      case "E":
        return "bg-red-100 text-red-800 border-red-200" // ضعيف
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case "A":
        return "ممتاز"
      case "B":
        return "جيد"
      case "C":
        return "متوسط"
      case "D":
        return "مقبول"
      case "E":
        return "ضعيف"
      default:
        return "غير محدد"
    }
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1"
      case "lg":
        return "text-lg px-4 py-2 font-bold"
      default:
        return "text-sm px-3 py-1"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${getRatingColor(rating)} ${getSizeClass(size)} border`}>{rating}</Badge>
      {showLabel && <span className="text-sm text-gray-600">{getRatingLabel(rating)}</span>}
    </div>
  )
}
