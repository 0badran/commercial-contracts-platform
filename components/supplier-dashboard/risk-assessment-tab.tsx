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
import { EyeOff, FileBarChart, Info } from "lucide-react";
import { useEffect, useState } from "react";
import CustomAlert from "../shared/custom-alert";
import EmptyState from "../shared/empty-state";
import RiskIcon from "../shared/risk-icon";
import SearchUsersInput from "../shared/search-users-input";
import TableSkeleton from "../skeletons/table-skeleton";

type Rating = Database["credit_info"]["credit_rating"];
type Risk = Database["credit_info"]["risk_level"];

export default function RiskAssessmentTab() {
  // Create the calculated state when the specified Retailer changes
  const [riskData, setRiskData] = useState<null | {
    creditRating: Rating;
    riskLevel: Risk;
    totalContracts: number;
    activeContracts: number;
    totalCommitments: number;
  }>(null);
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

  useEffect(() => {
    if (creditInfo) {
      setRiskData({
        creditRating: creditInfo.credit_rating!,
        riskLevel: creditInfo.risk_level!,
        totalContracts: creditInfo.total_contracts!,
        activeContracts: creditInfo.active_contracts!,
        totalCommitments: creditInfo.total_commitments!,
      });
    }
  }, [creditInfo]);

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
  if (retailers.length < 1) {
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
        {riskData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart />
                {selectedRetailer?.full_name}
              </CardTitle>
              <CardDescription>
                بيانات التقييم الائتماني ومستوى المخاطر
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* التصنيف الائتماني */}
                <Card>
                  <CardHeader>
                    <CardTitle>التصنيف الائتماني</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <Badge
                      className={`${getCreditRatingColor(
                        riskData.creditRating
                      )} text-lg px-3 py-1`}
                    >
                      {riskData.creditRating}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <RiskIcon risk={creditInfo?.risk_level} />
                      <span className="text-sm">
                        {translateRiskLevel(riskData.riskLevel)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* العقود */}
                <Card>
                  <CardHeader>
                    <CardTitle>العقود النشطة</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <span className="text-2xl font-bold">
                      {riskData.activeContracts}
                    </span>
                    <div className="text-right">
                      <p className="text-xs">إجمالي العقود</p>
                      <p className="font-medium">{riskData.totalContracts}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* إجمالي الالتزامات */}
                <Card>
                  <CardHeader>
                    <CardTitle>إجمالي الالتزامات</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <span className="text-xl font-bold">
                      {riskData.totalCommitments.toLocaleString()} ر.س
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {!riskData && (
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
