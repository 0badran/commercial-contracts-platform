"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, CreditCard, EyeOff, XCircle } from "lucide-react";
import { useState } from "react";

import { useContracts } from "@/hooks/use-contracts";
import { useCreditInfo } from "@/hooks/use-credit-info";
import { useUsers } from "@/hooks/use-users";
import { getCreditRatingColor, translateRiskLevel } from "@/lib/utils";
import CustomAlert from "../shared/custom-alert";
import EmptyState from "../shared/empty-state";
import RiskIcon from "../shared/risk-icon";
import SearchUsersInput from "../shared/search-users-input";
import TableSkeleton from "../skeletons/table-skeleton";

export default function CreditInfoTab() {
  const { getUsersContractedWithCurrentUser, loading } = useUsers();
  const { getCurrentUserContracts } = useContracts();
  const [selectedRetailer, setSelectedRetailer] = useState<
    Database["user"] | null
  >(null);

  const { data: contracts, error: contractsError } = getCurrentUserContracts();
  const { data: retailers, error } = getUsersContractedWithCurrentUser(
    contracts!
  );

  const { getCreditById } = useCreditInfo();
  const creditInfo = getCreditById(selectedRetailer?.id || "");

  if (loading) {
    return <TableSkeleton />;
  }
  if (error || contractsError) {
    return (
      <CustomAlert
        message={`حدث خطأ لم يتم تعريف المستخدم: ${
          error?.message || contractsError?.message
        }`}
        variant="error"
      />
    );
  }
  // Check the supplier's have contracts
  if (retailers?.length < 1) {
    return (
      <EmptyState
        title="لا يوجد تجار بعد"
        description="تفاصيل العقود فارغه"
        icon={EyeOff}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <SearchUsersInput
          title="قائمة التجار"
          des="ابحث عن التاجر لعرض عقوده الحالية"
          userType="retailer"
          users={retailers}
          getCreditById={getCreditById}
          setSelectedRetailer={setSelectedRetailer}
        />
      </div>

      <div className="lg:col-span-2">
        {selectedRetailer && creditInfo ? (
          <>
            <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
              <CardHeader>
                <CardTitle>
                  التفاصيل الائتمانية لـ {selectedRetailer.full_name}
                </CardTitle>
                <CardDescription>
                  نظرة عامة على أداء السداد والتصنيف
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm">التصنيف الائتماني</div>
                    <Badge
                      className={getCreditRatingColor(creditInfo.credit_rating)}
                    >
                      {creditInfo.credit_rating}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-sm">مستوى المخاطرة</div>
                    <div className="flex justify-center items-center gap-1">
                      <RiskIcon risk={creditInfo.risk_level} />
                      <span className="text-xs font-medium">
                        {translateRiskLevel(creditInfo.risk_level)}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm">إجمالي العقود</div>
                    <div className="font-semibold">
                      {creditInfo.total_contracts}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm">إجمالي الالتزامات</div>
                    <div className="font-semibold">
                      {creditInfo?.total_commitments?.toLocaleString()} ر.س
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
              <CardHeader>
                <CardTitle>سجل السداد الشهري</CardTitle>
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
                    {creditInfo.monthly_history?.map(
                      (month: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{month.month}</TableCell>
                          <TableCell>
                            {month.due.toLocaleString()} ر.س
                          </TableCell>
                          <TableCell>
                            {month.paid.toLocaleString()} ر.س
                          </TableCell>
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
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  اختر تاجراً لعرض معلوماته الائتمانية
                </h3>
                <p className="text-gray-600">
                  اختر تاجراً من القائمة لعرض تقريره الائتماني
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
