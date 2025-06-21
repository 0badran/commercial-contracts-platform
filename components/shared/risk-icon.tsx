import { Minus, TrendingDown, TrendingUp } from "lucide-react";

export default function RiskIcon({
  risk,
}: {
  risk: Database["credit_info"]["risk_level"];
}) {
  switch (risk) {
    case "very-low":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "low":
      return <TrendingUp className="h-4 w-4 text-blue-600" />;
    case "medium":
      return <Minus className="h-4 w-4 text-yellow-600" />;
    case "high":
      return <TrendingDown className="h-4 w-4 text-orange-600" />;
    case "very-high":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
}
