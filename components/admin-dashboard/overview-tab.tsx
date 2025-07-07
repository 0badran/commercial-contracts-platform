"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContracts } from "@/hooks/use-contracts";
import { useUsers } from "@/hooks/use-users";
import { translateContractStatus } from "@/lib/utils";
import {
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Store,
  X,
  XCircle,
} from "lucide-react";
import CustomAlert from "../shared/custom-alert";
import StatsCardSkelton from "../skeletons/stats-card-skelton";
import TableSkeleton from "../skeletons/table-skeleton";

export default function OverviewTab() {
  const {
    getUsersByType,
    getUserById,
    loading: userLoading,
    error: userError,
  } = useUsers();
  const {
    contracts,
    loading: contractLoading,
    error: contractError,
  } = useContracts();
  if (contractLoading || userLoading) {
    return (
      <div className="space-y-6">
        <StatsCardSkelton />
        <TableSkeleton />
      </div>
    );
  }

  if (userError || contractError) {
    return (
      <CustomAlert
        message="حدث خطا حاول الخروج والدخول مجددا"
        Icon={X}
        variant="error"
      />
    );
  }
  const totalRetailers = getUsersByType("retailer").length;
  const totalSuppliers = getUsersByType("supplier").length;
  const totalContracts = contracts.length;
  const totalValue = contracts.reduce((n, c) => c.amount + n, 0);
  const activeContracts = contracts.filter((c) => c.status === "active").length;
  const rejectedContracts = contracts.filter(
    (c) => c.status === "rejected"
  ).length;
  const pendingContracts = contracts.filter(
    (c) => c.status === "pending"
  ).length;
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover bg-linear-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التجار</CardTitle>
            <Store className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRetailers}</div>
            <p className="text-xs opacity-80">تاجر مسجل</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-linear-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الموردين
            </CardTitle>
            <Building2 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs opacity-80">مورد مسجل</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-linear-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العقود</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs opacity-80">عقد في النظام</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-linear-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              القيمة الإجمالية
            </CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalValue.toLocaleString()}
            </div>
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
                  <span className="font-bold">{activeContracts}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {((activeContracts / totalContracts) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>بانتظار الموافقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{pendingContracts}</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {((pendingContracts / totalContracts) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>العقود المرفوضة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{rejectedContracts}</span>
                  <Badge className="bg-red-100 text-red-800">
                    {((rejectedContracts / totalContracts) * 100).toFixed(1)}%
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
              {contracts.slice(0, 5).map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {getUserById(contract.retailer_id)?.full_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      عقد مع {getUserById(contract.supplier_id)?.full_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {contract.amount.toLocaleString()} ر.س
                    </p>
                    <Badge
                      className={
                        contract.status === "active"
                          ? "bg-green-100 text-green-800"
                          : contract.status === "pending"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {translateContractStatus(contract.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
