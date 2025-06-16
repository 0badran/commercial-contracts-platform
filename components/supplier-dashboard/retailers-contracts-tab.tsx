"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, TrendingUp, TrendingDown, Minus, Eye, FileText, FileBarChart, CreditCard } from "lucide-react"
import { retailers } from "@/data/users"

interface RetailersContractsTabProps {
  contracts: any[]
  setContracts: (contracts: any[]) => void
  currentSupplierId: number
}

export default function RetailersContractsTab({
  contracts,
  setContracts,
  currentSupplierId,
}: RetailersContractsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"name" | "registerNumber">("name")
  const [selectedRetailer, setSelectedRetailer] = useState<number | null>(null)
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false)
  const [decisionData, setDecisionData] = useState({
    retailerId: 0,
    retailerName: "",
    decision: "" as "approve" | "reject" | "moreInfo",
    notes: "",
    facilityAmount: "",
  })

  // Filter retailers based on search term and type
  const filteredRetailers = retailers.filter((retailer) => {
    if (searchType === "name") {
      return retailer.name.toLowerCase().includes(searchTerm.toLowerCase())
    } else {
      const registerNumber = `CR-${retailer.id}${retailer.id}${retailer.id}${retailer.id}`
      return registerNumber.includes(searchTerm)
    }
  })

  const getRetailerContracts = (retailerId: number) => {
    return contracts.filter((contract) => contract.retailerId === retailerId)
  }

  const handleOpenDecisionDialog = (retailerId: number, retailerName: string) => {
    setDecisionData({
      retailerId,
      retailerName,
      decision: "approve",
      notes: "",
      facilityAmount: "",
    })
    setIsDecisionDialogOpen(true)
  }

  const handleSubmitDecision = () => {
    console.log("Decision submitted:", decisionData)
    setIsDecisionDialogOpen(false)
    alert(
      `تم حفظ القرار بنجاح: ${
        decisionData.decision === "approve"
          ? "منح تسهيلات"
          : decisionData.decision === "reject"
            ? "رفض"
            : "طلب بيانات إضافية"
      }`,
    )
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>
      case "بانتظار الموافقة":
        return <Badge className="bg-blue-100 text-blue-800">بانتظار الموافقة</Badge>
      case "مرفوض":
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Retailers List */}
      <div className="lg:col-span-1">
        <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>قائمة التجار</CardTitle>
            <CardDescription>ابحث عن التاجر لعرض عقوده الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Select value={searchType} onValueChange={(value) => setSearchType(value as "name" | "registerNumber")}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="نوع البحث" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">الاسم</SelectItem>
                    <SelectItem value="registerNumber">رقم السجل</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={searchType === "name" ? "ابحث عن التاجر..." : "أدخل رقم السجل التجاري..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                        <p className="text-xs text-gray-500">
                          رقم السجل: CR-{retailer.id}
                          {retailer.id}
                          {retailer.id}
                          {retailer.id}
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

                {filteredRetailers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>لم يتم العثور على نتائج</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Details */}
      <div className="lg:col-span-2">
        {selectedRetailer ? (
          <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    عقود {retailers.find((r) => r.id === selectedRetailer)?.name}
                  </CardTitle>
                  <CardDescription>العقود الحالية مع الموردين</CardDescription>
                </div>
                <Button
                  onClick={() =>
                    handleOpenDecisionDialog(
                      selectedRetailer,
                      retailers.find((r) => r.id === selectedRetailer)?.name || "",
                    )
                  }
                  className="flex items-center gap-1"
                >
                  <FileBarChart className="h-4 w-4" />
                  اتخاذ قرار
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المورد</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>تاريخ البداية</TableHead>
                    <TableHead>تاريخ الانتهاء</TableHead>
                    <TableHead>شروط الدفع</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRetailerContracts(selectedRetailer).map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.supplierName}</TableCell>
                      <TableCell>{contract.amount.toLocaleString()} ر.س</TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell>{contract.paymentTerms}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {getRetailerContracts(selectedRetailer).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد عقود لهذا التاجر</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">اختر تاجراً لعرض عقوده</h3>
                <p className="text-gray-600">اختر تاجراً من القائمة لعرض عقوده الحالية مع الموردين</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Decision Dialog */}
      <Dialog open={isDecisionDialogOpen} onOpenChange={setIsDecisionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>اتخاذ قرار بشأن التاجر</DialogTitle>
            <DialogDescription>
              {decisionData.retailerName} - اتخذ قراراً بشأن منح التسهيلات أو طلب بيانات إضافية
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>القرار</span>
              </div>
              <Select
                value={decisionData.decision}
                onValueChange={(value) =>
                  setDecisionData({
                    ...decisionData,
                    decision: value as "approve" | "reject" | "moreInfo",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القرار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">منح تسهيلات</SelectItem>
                  <SelectItem value="reject">رفض</SelectItem>
                  <SelectItem value="moreInfo">طلب بيانات إضافية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {decisionData.decision === "approve" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>قيمة التسهيلات (ر.س)</span>
                </div>
                <Input
                  id="facilityAmount"
                  type="number"
                  placeholder="أدخل قيمة التسهيلات"
                  value={decisionData.facilityAmount}
                  onChange={(e) => setDecisionData({ ...decisionData, facilityAmount: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>ملاحظات</span>
              </div>
              <Textarea
                id="notes"
                placeholder="أدخل ملاحظات إضافية حول القرار"
                value={decisionData.notes}
                onChange={(e) => setDecisionData({ ...decisionData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDecisionDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmitDecision}>حفظ القرار</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
