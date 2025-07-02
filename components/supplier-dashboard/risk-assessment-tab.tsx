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
import { useCreditInfo } from "@/hooks/use-credit-info";
import { useUsers } from "@/hooks/use-users";
import { getCreditRatingColor, translateRiskLevel } from "@/lib/utils";
import {
  AlertCircle,
  BarChart3,
  CreditCard,
  EyeOff,
  FileBarChart,
  Info,
  PieChart,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import CustomAlert from "../shared/custom-alert";
import EmptyState from "../shared/empty-state";
import RiskIcon from "../shared/risk-icon";
import TableSkeleton from "../skeletons/table-skeleton";
import SearchUsersInput from "./search-users-input";

export default function RiskAssessmentTab() {
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
  const onTime =
    (retailerRate &&
      retailerRate.monthly_history?.filter((h) => h.onTime).length) ||
    0;
  const notOnTime =
    (retailerRate &&
      retailerRate.monthly_history?.filter((h) => !h.onTime).length) ||
    0;

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
      {/* List of Retailers */}
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

      {/* تفاصيل التقييم */}
      <div className="lg:col-span-2">
        {retailerRate && selectedRetailer ? (
          <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart className="h-5 w-5" />
                تحليل مخاطر{" "}
                {retailers.find((r) => r.id === selectedRetailer.id)?.full_name}
              </CardTitle>
              <CardDescription>
                تقييم المخاطر بناءً على بيانات العقود والأداء
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const growthRate =
                  retailerRate.contract_success_rate === null
                    ? (50 / 100) * 5
                    : (Math.min(retailerRate.contract_success_rate, 100) /
                        100) *
                      5;
                return (
                  <div className="space-y-6">
                    {/* Risk Score */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-blue-800">
                            التصنيف الائتماني
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge
                              className={`${getCreditRatingColor(
                                retailerRate?.credit_rating
                              )} text-lg px-3 py-1`}
                            >
                              {retailerRate.credit_rating}
                            </Badge>
                            <div className="text-right">
                              <p className="text-xs text-blue-800">
                                مستوى المخاطر
                              </p>
                              <div className="flex items-center gap-1 text-sm font-medium">
                                <RiskIcon risk={retailerRate.risk_level} />
                                {translateRiskLevel(retailerRate.risk_level)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-green-800">
                            العقود النشطة
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-green-800">
                              {retailerRate.active_contracts}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-green-800">
                                إجمالي القيمة
                              </p>
                              <p className="text-sm font-medium">
                                {retailerRate.total_commitments?.toLocaleString()}{" "}
                                ر.س
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-purple-800">
                            متوسط التأخير في الدفع
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-purple-800">
                              {retailerRate.average_delay?.toLocaleString()} ر.س
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-purple-800">
                                معدل النمو
                              </p>
                              <p className="text-sm font-medium">
                                {growthRate}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Risk Factors */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          عوامل تقييم المخاطر
                        </CardTitle>
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
                                  onTime > notOnTime
                                    ? "bg-green-100 text-green-800"
                                    : onTime === notOnTime
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {onTime > notOnTime
                                  ? "جيد"
                                  : onTime === notOnTime
                                  ? "متوسط"
                                  : "مقبول"}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-blue-600" />
                                <span>معدل النمو</span>
                              </div>
                              <Badge
                                className={
                                  growthRate > 3
                                    ? "bg-green-100 text-green-800"
                                    : growthRate > 1.5
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {growthRate}/5
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <PieChart className="h-24 w-24 mx-auto text-blue-600 opacity-70" />
                              <p className="mt-2 text-sm text-gray-600">
                                توزيع المخاطر
                              </p>
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
                          {(() => {
                            switch (retailerRate.credit_rating) {
                              case "A":
                                return (
                                  <div className="flex items-start gap-2">
                                    <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                      <p className="font-medium">
                                        يمكن منح تسهيلات ائتمانية
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        التاجر يتمتع بتصنيف ائتماني مرتفع وتاريخ
                                        سداد جيد، يمكن منحه تسهيلات إضافية.
                                      </p>
                                    </div>
                                  </div>
                                );
                              case "B":
                                return (
                                  <div className="flex items-start gap-2">
                                    <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                      <p className="font-medium">
                                        يمكن منح تسهيلات ائتمانية
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        التاجر يتمتع بتصنيف ائتماني مرتفع وتاريخ
                                        سداد جيد، يمكن منحه تسهيلات إضافية.
                                      </p>
                                    </div>
                                  </div>
                                );
                              case "C":
                                return (
                                  <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                      <p className="font-medium">
                                        يمكن منح تسهيلات محدودة
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        التاجر يتمتع بتصنيف ائتماني متوسط، يمكن
                                        منحه تسهيلات محدودة مع مراقبة الأداء.
                                      </p>
                                    </div>
                                  </div>
                                );
                              case "D":
                                return (
                                  <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                      <p className="font-medium">
                                        يمكن منح تسهيلات محدودة
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        التاجر يتمتع بتصنيف ائتماني متوسط، يمكن
                                        منحه تسهيلات محدودة مع مراقبة الأداء.
                                      </p>
                                    </div>
                                  </div>
                                );
                              default:
                                return (
                                  <div className="flex items-start gap-2">
                                    <ThumbsDown className="h-5 w-5 text-red-600 mt-0.5" />
                                    <div>
                                      <p className="font-medium">
                                        غير مستحسن منح تسهيلات
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        التاجر يتمتع بتصنيف ائتماني منخفض، ينصح
                                        بعدم منح تسهيلات إضافية.
                                      </p>
                                    </div>
                                  </div>
                                );
                            }
                          })()}

                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium">توصيات إضافية</p>
                              <p className="text-sm text-gray-600">
                                مراجعة أداء العقود الحالية بشكل دوري وتقييم
                                المخاطر بناءً على تحديثات السوق.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        ) : (
          <Card className="flex items-center justify-center h-64">
            <div className="text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>اختر تاجراً لعرض تقييم المخاطر</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
