"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  FileBarChart,
  ThumbsUp,
  ThumbsDown,
  Info,
  BarChart3,
  PieChart,
  LineChart,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { retailers } from "@/data/users"

interface RiskAssessmentTabProps {
  contracts: any[]
  onOpenDecisionDialog: (retailerId: number, retailerName: string) => void
}

export default function RiskAssessmentTab({ contracts, onOpenDecisionDialog }: RiskAssessmentTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRetailer, setSelectedRetailer] = useState<number | null>(null)

  const filteredRetailers = retailers.filter((retailer) =>
    retailer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCreditRatingColor = (rating: string) => {
    switch (rating) {
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

  const getRiskIcon = (risk: string) => {
    if (risk === "منخفض جداً") return <TrendingUp className="h-4 w-4 text-green-600" />
    if (risk === "منخفض") return <TrendingUp className="h-4 w-4 text-blue-600" />
    if (risk === "متوسط") return <Minus className="h-4 w-4 text-yellow-600" />
    if (risk === "مرتفع") return <TrendingDown className="h-4 w-4 text-orange-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getRetailerContracts = (retailerId: number) => {
    return contracts.filter((contract) => contract.retailerId === retailerId)
  }

  const calculateRetailerRiskStats = (retailerId: number) => {
    const retailerContracts = getRetailerContracts(retailerId)
    const activeContracts = retailerContracts.filter((c) => c.status === "نشط")
    const totalValue = activeContracts.reduce((sum, c) => sum + c.amount, 0)
    const avgContractValue = activeContracts.length > 0 ? totalValue / activeContracts.length : 0

    const paymentHistory = Math.random() > 0.3 ? "جيد" : Math.random() > 0.5 ? "متوسط" : "ضعيف"
    const marketStability = Math.random() > 0.4 ? "مستقر" : "متقلب"
    const growthRate = (Math.random() * 20 - 5).toFixed(1) + "%"

    return {
      totalValue,
      avgContractValue,
      activeContractsCount: activeContracts.length,
      paymentHistory,
      marketStability,
      growthRate,
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Retailers Risk List */}
      <div className="lg:col-span-1">
        <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>تقييم مخاطر التجار</CardTitle>
            <CardDescription>اختر تاجراً لعرض تقييم المخاطر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن التاجر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2">
                {filteredRetailers.map((retailer) => (
                  <div
                    key={retailer.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedRetailer === retailer.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-border/80 hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedRetailer(retailer.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{retailer.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {retailer.totalContracts} عقود • {retailer.totalAmount.toLocaleString()} ر.س
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getCreditRatingColor(retailer.creditRating)}>{retailer.creditRating}</Badge>
                        <div className="flex items-center gap-1">
                          {getRiskIcon(retailer.riskLevel)}
                          <span className="text-xs">{retailer.riskLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <div className="lg:col-span-2">
        {selectedRetailer ? (
          <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileBarChart className="h-5 w-5" />
                    تحليل مخاطر {retailers.find((r) => r.id === selectedRetailer)?.name}
                  </CardTitle>
                  <CardDescription>تقييم المخاطر بناءً على بيانات العقود والأداء</CardDescription>
                </div>
                <Button
                  onClick={() =>
                    onOpenDecisionDialog(selectedRetailer, retailers.find((r) => r.id === selectedRetailer)?.name || "")
                  }
                  className="flex items-center gap-1"
                >
                  <FileBarChart className="h-4 w-4" />
                  اتخاذ قرار
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const retailer = retailers.find((r) => r.id === selectedRetailer)
                const riskStats = calculateRetailerRiskStats(selectedRetailer)

                if (!retailer) return null

                return (
                  <div className="space-y-6">
                    {/* Risk Score */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-blue-800">التصنيف الائتماني</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge className={`${getCreditRatingColor(retailer.creditRating)} text-lg px-3 py-1`}>
                              {retailer.creditRating}
                            </Badge>
                            <div className="text-right">
                              <p className="text-xs text-blue-800">مستوى المخاطر</p>
                              <div className="flex items-center gap-1 text-sm font-medium">
                                {getRiskIcon(retailer.riskLevel)}
                                {retailer.riskLevel}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-green-800">العقود النشطة</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-green-800">{riskStats.activeContractsCount}</div>
                            <div className="text-right">
                              <p className="text-xs text-green-800">إجمالي القيمة</p>
                              <p className="text-sm font-medium">{riskStats.totalValue.toLocaleString()} ر.س</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-purple-800">متوسط قيمة العقد</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-purple-800">
                              {riskStats.avgContractValue.toLocaleString()} ر.س
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-purple-800">معدل النمو</p>
                              <p className="text-sm font-medium">{riskStats.growthRate}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Risk Factors */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">عوامل تقييم المخاطر</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                                <span>تاريخ السداد</span>
                              </div>
                              <Badge
                                className={
                                  riskStats.paymentHistory === "جيد"
                                    ? "bg-green-100 text-green-800"
                                    : riskStats.paymentHistory === "متوسط"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {riskStats.paymentHistory}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <LineChart className="h-4 w-4 text-blue-600" />
                                <span>استقرار السوق</span>
                              </div>
                              <Badge
                                className={
                                  riskStats.marketStability === "مستقر"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {riskStats.marketStability}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-blue-600" />
                                <span>معدل النمو</span>
                              </div>
                              <Badge
                                className={
                                  Number.parseFloat(riskStats.growthRate) > 5
                                    ? "bg-green-100 text-green-800"
                                    : Number.parseFloat(riskStats.growthRate) > 0
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {riskStats.growthRate}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <PieChart className="h-24 w-24 mx-auto text-blue-600 opacity-70" />
                              <p className="mt-2 text-sm text-gray-600">توزيع المخاطر</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">التوصيات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {retailer.creditRating === "A" && (
                            <div className="flex items-start gap-2">
                              <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5" />
                              <div>
                                <p className="font-medium">يمكن منح تسهيلات ائتمانية كبيرة</p>
                                <p className="text-sm text-gray-600">
                                  التاجر يتمتع بتصنيف ائتماني ممتاز وتاريخ سداد ممتاز، يمكن منحه أقصى تسهيلات متاحة.
                                </p>
                              </div>
                            </div>
                          )}

                          {retailer.creditRating === "B" && (
                            <div className="flex items-start gap-2">
                              <ThumbsUp className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <p className="font-medium">يمكن منح تسهيلات ائتمانية جيدة</p>
                                <p className="text-sm text-gray-600">
                                  التاجر يتمتع بتصنيف ائتماني جيد، يمكن منحه تسهيلات مناسبة مع مراقبة دورية.
                                </p>
                              </div>
                            </div>
                          )}

                          {retailer.creditRating === "C" && (
                            <div className="flex items-start gap-2">
                              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <div>
                                <p className="font-medium">يمكن منح تسهيلات محدودة</p>
                                <p className="text-sm text-gray-600">
                                  التاجر يتمتع بتصنيف ائتماني متوسط، يمكن منحه تسهيلات محدودة مع مراقبة مشددة.
                                </p>
                              </div>
                            </div>
                          )}

                          {retailer.creditRating === "D" && (
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                              <div>
                                <p className="font-medium">تسهيلات محدودة جداً مع ضمانات</p>
                                <p className="text-sm text-gray-600">
                                  التاجر يتمتع بتصنيف ائتماني مقبول، ينصح بتسهيلات محدودة مع ضمانات إضافية.
                                </p>
                              </div>
                            </div>
                          )}

                          {retailer.creditRating === "E" && (
                            <div className="flex items-start gap-2">
                              <ThumbsDown className="h-5 w-5 text-red-600 mt-0.5" />
                              <div>
                                <p className="font-medium">غير مستحسن منح تسهيلات</p>
                                <p className="text-sm text-gray-600">
                                  التاجر يتمتع بتصنيف ائتماني ضعيف، ينصح بعدم منح تسهيلات أو طلب ضمانات كاملة.
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium">توصيات إضافية</p>
                              <p className="text-sm text-gray-600">
                                مراجعة أداء العقود الحالية بشكل دوري وتقييم المخاطر بناءً على تحديثات السوق.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        ) : (
          <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileBarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">اختر تاجراً لعرض تقييم المخاطر</h3>
                <p className="text-gray-600">اختر تاجراً من القائمة لعرض تحليل المخاطر والتوصيات</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
