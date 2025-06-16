"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle, Clock, DollarSign, FileText, Store, XCircle } from "lucide-react"
import { systemStats, allContracts } from "@/data/users"

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التجار</CardTitle>
            <Store className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalRetailers}</div>
            <p className="text-xs opacity-80">تاجر مسجل</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموردين</CardTitle>
            <Building2 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalSuppliers}</div>
            <p className="text-xs opacity-80">مورد مسجل</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العقود</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalContracts}</div>
            <p className="text-xs opacity-80">عقد في النظام</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalValue.toLocaleString()}</div>
            <p className="text-xs opacity-80">ريال سعودي</p>
          </CardContent>
        </Card>
      </div>

      {/* Contract Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>حالة العقود</CardTitle>
            <CardDescription>توزيع العقود حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>العقود النشطة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{systemStats.activeContracts}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {((systemStats.activeContracts / systemStats.totalContracts) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>بانتظار الموافقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{systemStats.pendingContracts}</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {((systemStats.pendingContracts / systemStats.totalContracts) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>العقود المرفوضة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{systemStats.rejectedContracts}</span>
                  <Badge className="bg-red-100 text-red-800">
                    {((systemStats.rejectedContracts / systemStats.totalContracts) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأنشطة الحديثة</CardTitle>
            <CardDescription>آخر العمليات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allContracts.slice(0, 5).map((contract) => (
                <div key={contract.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{contract.retailerName}</p>
                    <p className="text-xs text-gray-600">عقد مع {contract.supplierName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{contract.amount.toLocaleString()} ر.س</p>
                    <Badge
                      className={
                        contract.status === "نشط"
                          ? "bg-green-100 text-green-800"
                          : contract.status === "بانتظار الموافقة"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {contract.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
