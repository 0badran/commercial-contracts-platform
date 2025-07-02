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
import {
  getCreditRatingColor,
  translateMonthToArabic,
  translateRiskLevel,
} from "@/lib/utils";
import CustomAlert from "../shared/custom-alert";
import EmptyState from "../shared/empty-state";
import TableSkeleton from "../skeletons/table-skeleton";
import SearchUsersInput from "./search-users-input";

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

  const { getCreditById, creditInfo } = useCreditInfo();
  const retailerRate = getCreditById(selectedRetailer?.id || "");

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

  if (creditInfo.length === 0) {
    return (
      <EmptyState
        title="لا يوجد تقيم بعد"
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
        {(() => {
          if (selectedRetailer && retailerRate) {
            const paidAmount = Number(retailerRate.paid_amount);
            const overdueAmount = Number(retailerRate.overdue_amount);

            const contractSuccessRate = retailerRate.contract_success_rate;
            const totalCommitments = Number(retailerRate.total_commitments);
            const paymentScore = Number(retailerRate.payment_score);
            const totalContracts = contracts.filter(
              (c) => c.retailer_id === selectedRetailer.id
            ).length;
            return (
              <>
                {/* Credit Overview */}
                <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      المعلومات الائتمانية - {selectedRetailer.full_name}
                    </CardTitle>
                    <CardDescription>
                      نظرة شاملة على الوضع الائتماني والأداء المالي
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-blue-800">
                            التصنيف الائتماني
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <Badge
                              className={`${getCreditRatingColor(
                                retailerRate.credit_rating
                              )} text-2xl px-4 py-2`}
                            >
                              {retailerRate.credit_rating}
                            </Badge>
                            <p className="text-xs text-blue-800 mt-2">
                              {translateRiskLevel(retailerRate.risk_level)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-green-800">
                            إجمالي العقود
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-800">
                              {totalContracts}
                            </div>
                            <p className="text-xs text-green-800">
                              نشط: {retailerRate.active_contracts}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-purple-800">
                            إجمالي الالتزامات
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-800">
                              {totalCommitments.toLocaleString()}
                            </div>
                            <p className="text-xs text-purple-800">
                              ريال سعودي
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-orange-800">
                            نقاط السداد
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-800">
                              {paymentScore}
                            </div>
                            <p className="text-xs text-orange-800">من 100</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Performance */}
                <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">أداء السداد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>المبلغ المدفوع</span>
                          <span className="font-bold text-green-600">
                            {paidAmount.toLocaleString()} ر.س
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>المبلغ المتأخر</span>
                          <span className="font-bold text-red-600">
                            {overdueAmount.toLocaleString()} ر.س
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>آخر دفعة</span>
                          <span className="text-sm">
                            {retailerRate.last_payment_date}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>معدل نجاح العقود</span>
                          {contractSuccessRate !== null ? (
                            <Badge
                              className={
                                contractSuccessRate >= 80
                                  ? "bg-green-100 text-green-800"
                                  : contractSuccessRate >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {(contractSuccessRate === null
                                ? 50
                                : contractSuccessRate
                              ).toFixed(1)}
                              %
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              {(50).toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span>متوسط التأخير</span>
                          <span className="text-sm">
                            {retailerRate.average_delay} يوم
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-center w-[100px] h-[100px] rounded-full"
                        style={{
                          background: `
														radial-gradient(closest-side, white 79%, transparent 80% 100%),
														conic-gradient(#2b7fff ${paymentScore}%, #eee 0)
    											`,
                        }}
                      >
                        <span className="text-sm font-bold text-blue-500">
                          {paymentScore}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Payment History */}
                <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">
                      سجل السداد الشهري
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>شهر الاستحقاق</TableHead>
                          <TableHead>المبلغ المستحق</TableHead>
                          <TableHead>المبلغ المدفوع</TableHead>
                          <TableHead>نسبة السداد</TableHead>
                          <TableHead>في الوقت المحدد</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {retailerRate.monthly_history?.map((month, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {translateMonthToArabic(month.month)}
                            </TableCell>
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
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            );
          }
          return (
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
          );
        })()}
      </div>
    </div>
  );
}

//             {/* Credit Rating Explanation */}
// <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
//   <CardHeader>
//     <CardTitle className="text-base">
//       شرح التصنيف الائتماني
//     </CardTitle>
//   </CardHeader>
//   <CardContent>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <h4 className="font-medium mb-3">معايير التقييم:</h4>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>نقاط السداد (40%)</span>
//             <span>{creditInfo.paymentScore}/100</span>
//           </div>
//           <div className="flex justify-between">
//             <span>معدل نجاح العقود (30%)</span>
//             <span>{creditInfo.contractSuccessRate}%</span>
//           </div>
//           <div className="flex justify-between">
//             <span>متوسط التأخير (20%)</span>
//             <span>{creditInfo.averagePaymentDelay} يوم</span>
//           </div>
//           <div className="flex justify-between">
//             <span>حجم الالتزامات (10%)</span>
//             <span>
//               {creditInfo.totalCommitments.toLocaleString()} ر.س
//             </span>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div>
//           <h4 className="font-medium mb-3">مقياس التصنيف:</h4>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between items-center">
//               <span>A</span>
//               <Badge className="bg-green-100 text-green-800">
//                 ممتاز
//               </Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span>B</span>
//               <Badge className="bg-blue-100 text-blue-800">
//                 جيد
//               </Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span>C</span>
//               <Badge className="bg-yellow-100 text-yellow-800">
//                 متوسط
//               </Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span>D</span>
//               <Badge className="bg-orange-100 text-orange-800">
//                 مقبول
//               </Badge>
//             </div>
//             <div className="flex justify-between items-center">
//               <span>E</span>
//               <Badge className="bg-red-100 text-red-800">
//                 ضعيف
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </CardContent>
// </Card>
