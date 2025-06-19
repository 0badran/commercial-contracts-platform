"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"
import { retailers } from "@/data/users"
import { getCreditInfo, updateCreditRating } from "@/data/credit-data"

export default function CreditInfoTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRetailer, setSelectedRetailer] = useState<number | null>(null)

  const filteredRetailers = retailers.filter((retailer) =>
    retailer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const creditInfo = selectedRetailer ? getCreditInfo(selectedRetailer) : null

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Credit Info List */}
      <div className="lg:col-span-1">
        <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
          <CardHeader>
            <CardTitle>المعلومات الائتمانية</CardTitle>
            <CardDescription>اختر تاجراً لعرض معلوماته الائتمانية</CardDescription>
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
                {filteredRetailers.map((retailer) => {
                  const creditInfo = getCreditInfo(retailer.id)
                  return (
                    <div
                      key={retailer.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedRetailer === retailer.id
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border hover:border-border/80 hover:bg-accent/50"
                      }`}
                      onClick={() => setSelectedRetailer(retailer.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">{retailer.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {creditInfo?.totalContracts || 0} عقود •{" "}
                            {(creditInfo?.totalCommitments || 0).toLocaleString()} ر.س
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getCreditRatingColor(creditInfo?.creditRating || "C")}>
                            {creditInfo?.creditRating || "غير محدد"}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getRiskIcon(creditInfo?.riskLevel || "متوسط")}
                            <span className="text-xs">{creditInfo?.riskLevel || "متوسط"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Details */}
      <div className="lg:col-span-2">
        {selectedRetailer ? (
          <div className="space-y-6">
            {(() => {
              const retailer = retailers.find((r) => r.id === selectedRetailer)
              const creditInfo = getCreditInfo(selectedRetailer)

              if (!retailer || !creditInfo) {
                return (
                  <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات ائتمانية</h3>
                        <p className="text-gray-600">لم يتم العثور على بيانات ائتمانية لهذا التاجر</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              }

              return (
                <>
                  {/* Credit Overview */}
                  <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            المعلومات الائتمانية - {retailer.name}
                          </CardTitle>
                          <CardDescription>نظرة شاملة على الوضع الائتماني والأداء المالي</CardDescription>
                        </div>
                        <Button
                          onClick={() => {
                            const updated = updateCreditRating(selectedRetailer)
                            if (updated) {
                              alert(`تم تحديث التصنيف الائتماني إلى: ${updated.creditRating}`)
                            }
                          }}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <BarChart3 className="h-4 w-4" />
                          تحديث التصنيف
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-linear-to-br from-blue-50 to-blue-100">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-blue-800">التصنيف الائتماني</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <Badge className={`${getCreditRatingColor(creditInfo.creditRating)} text-2xl px-4 py-2`}>
                                {creditInfo.creditRating}
                              </Badge>
                              <p className="text-xs text-blue-800 mt-2">{creditInfo.riskLevel}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-green-50 to-green-100">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-green-800">إجمالي العقود</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-800">{creditInfo.totalContracts}</div>
                              <p className="text-xs text-green-800">نشط: {creditInfo.activeContracts}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-purple-50 to-purple-100">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-purple-800">إجمالي الالتزامات</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <div className="text-xl font-bold text-purple-800">
                                {creditInfo.totalCommitments.toLocaleString()}
                              </div>
                              <p className="text-xs text-purple-800">ريال سعودي</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-orange-50 to-orange-100">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-orange-800">نقاط السداد</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-800">{creditInfo.paymentScore}</div>
                              <p className="text-xs text-orange-800">من 100</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Performance */}
                  <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base">أداء السداد</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>المبلغ المدفوع</span>
                            <span className="font-bold text-green-600">
                              {creditInfo.paidAmount.toLocaleString()} ر.س
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>المبلغ المتأخر</span>
                            <span className="font-bold text-red-600">
                              {creditInfo.overdueAmount.toLocaleString()} ر.س
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>آخر دفعة</span>
                            <span className="text-sm">{creditInfo.lastPaymentDate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>متوسط التأخير</span>
                            <span className="text-sm">{creditInfo.averagePaymentDelay} يوم</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>معدل نجاح العقود</span>
                            <Badge
                              className={
                                creditInfo.contractSuccessRate >= 80
                                  ? "bg-green-100 text-green-800"
                                  : creditInfo.contractSuccessRate >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {creditInfo.contractSuccessRate}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>نسبة السداد</span>
                            <Badge
                              className={
                                (creditInfo.paidAmount / creditInfo.totalCommitments) * 100 >= 80
                                  ? "bg-green-100 text-green-800"
                                  : (creditInfo.paidAmount / creditInfo.totalCommitments) * 100 >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {((creditInfo.paidAmount / creditInfo.totalCommitments) * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto">
                              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                              <div
                                className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent"
                                style={{
                                  transform: `rotate(${(creditInfo.paymentScore / 100) * 360}deg)`,
                                }}
                              ></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold">{creditInfo.paymentScore}</span>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">نقاط الأداء</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Payment History */}
                  <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base">سجل السداد الشهري</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الشهر</TableHead>
                            <TableHead>المبلغ المستحق</TableHead>
                            <TableHead>المبلغ المدفوع</TableHead>
                            <TableHead>نسبة السداد</TableHead>
                            <TableHead>في الوقت المحدد</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {creditInfo.monthlyPaymentHistory.map((month, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{month.month}</TableCell>
                              <TableCell>{month.due.toLocaleString()} ر.س</TableCell>
                              <TableCell>{month.paid.toLocaleString()} ر.س</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    (month.paid / month.due) * 100 >= 100
                                      ? "bg-green-100 text-green-800"
                                      : (month.paid / month.due) * 100 >= 80
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {((month.paid / month.due) * 100).toFixed(1)}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {month.onTime ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Credit Rating Explanation */}
                  <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base">شرح التصنيف الائتماني</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">معايير التقييم:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>نقاط السداد (40%)</span>
                              <span>{creditInfo.paymentScore}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span>معدل نجاح العقود (30%)</span>
                              <span>{creditInfo.contractSuccessRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>متوسط التأخير (20%)</span>
                              <span>{creditInfo.averagePaymentDelay} يوم</span>
                            </div>
                            <div className="flex justify-between">
                              <span>حجم الالتزامات (10%)</span>
                              <span>{creditInfo.totalCommitments.toLocaleString()} ر.س</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div>
                            <h4 className="font-medium mb-3">مقياس التصنيف:</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span>A</span>
                                <Badge className="bg-green-100 text-green-800">ممتاز</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>B</span>
                                <Badge className="bg-blue-100 text-blue-800">جيد</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>C</span>
                                <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>D</span>
                                <Badge className="bg-orange-100 text-orange-800">مقبول</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>E</span>
                                <Badge className="bg-red-100 text-red-800">ضعيف</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            })()}
          </div>
        ) : (
          <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">اختر تاجراً لعرض معلوماته الائتمانية</h3>
                <p className="text-gray-600">اختر تاجراً من القائمة لعرض تقريره الائتماني الشامل</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
