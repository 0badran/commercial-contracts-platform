import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CreditRatingChartProps {
  data: {
    rating: "A" | "B" | "C" | "D" | "E";
    count: number;
    percentage: number;
  }[];
}

export function CreditRatingChart({ data }: CreditRatingChartProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "A":
        return "bg-green-500";
      case "B":
        return "bg-blue-500";
      case "C":
        return "bg-yellow-500";
      case "D":
        return "bg-orange-500";
      case "E":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case "A":
        return "ممتاز";
      case "B":
        return "جيد";
      case "C":
        return "متوسط";
      case "D":
        return "مقبول";
      case "E":
        return "ضعيف";
      default:
        return "غير محدد";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">توزيع التصنيف الائتماني</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.rating}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded ${getRatingColor(item.rating)}`}
                ></div>
                <span className="font-medium">{item.rating}</span>
                <span className="text-sm text-gray-600">
                  ({getRatingLabel(item.rating)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.count}</span>
                <Badge variant="outline">{item.percentage.toFixed(1)}%</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Bar Chart */}
        <div className="mt-6 space-y-2">
          {data.map((item) => (
            <div key={item.rating} className="flex items-center gap-2">
              <span className="w-4 text-sm font-medium">{item.rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getRatingColor(item.rating)}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 w-12">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
