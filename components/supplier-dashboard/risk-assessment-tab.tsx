"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getCreditRatingColor } from "@/lib/utils";
import { EyeOff, FileBarChart, Info } from "lucide-react";
import { useState } from "react";
import EmptyState from "../shared/empty-state";
import RiskIcon from "../shared/risk-icon";
import SearchUsersInput from "../shared/search-users-input";

type Rating = Database["credit_info"]["credit_rating"];
type Risk = Database["credit_info"]["risk_level"];
type Contracts = Database["contract"][];
export default function RiskAssessmentTab({
  initialContracts,
}: {
  initialContracts: Contracts;
}) {
  const [filteredRetailers, setFilteredRetailers] = useState<
    Database["user"][]
  >([]);

  const [selectedRetailer, setSelectedRetailer] = useState<
    Database["user"] | null
  >(null);

  // Create the calculated state when the specified Retailer changes
  const [riskData, setRiskData] = useState<null | {
    creditRating: Rating;
    riskLevel: Risk;
    totalContracts: number;
    activeContracts: number;
    totalCommitments: number;
  }>(null);
  // Retailer credit info
  const { creditInfo } = useCreditInfo(selectedRetailer?.id as string);

  const { getUsersContractedWithCurrentUser } = useUsers();
  const { getCurrentUserContracts } = useContracts(initialContracts);

  const { data: contracts } = getCurrentUserContracts();

  // Check the supplier's have contracts
  if (!contracts) {
    return (
      <EmptyState
        title="لا يوجد تجار بعد"
        description="تفاصيل العقود فارغه"
        icon={EyeOff}
      />
    );
  }
  const retailers = getUsersContractedWithCurrentUser(contracts);

  if (retailers) {
    setFilteredRetailers(retailers);
  }

  if (creditInfo) {
    setRiskData({
      creditRating: creditInfo.credit_rating!,
      riskLevel: creditInfo.risk_level!,
      totalContracts: creditInfo.total_contracts!,
      activeContracts: creditInfo.active_contracts!,
      totalCommitments: creditInfo.total_commitments!,
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List of Retailers */}
      <div className="lg:col-span-1">
        <SearchUsersInput
          title="قائمة التجار"
          des="ابحث عن التاجر لعرض عقوده الحالية"
          userType="retailer"
          users={filteredRetailers}
          setUsers={setFilteredRetailers}
        />
        <div className="mt-4 space-y-2">
          {filteredRetailers.map((retailer) => {
            return (
              <div
                key={retailer.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedRetailer?.id === retailer.id
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setSelectedRetailer(retailer)}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-sm">
                      {retailer.full_name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {creditInfo?.total_contracts ?? 0} عقود •{" "}
                      {(creditInfo?.total_commitments ?? 0).toLocaleString()}{" "}
                      ر.س
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={getCreditRatingColor(
                        creditInfo?.credit_rating ?? "C"
                      )}
                    >
                      {creditInfo?.credit_rating ?? "C"}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs">
                      <RiskIcon risk={creditInfo?.risk_level} />
                      {creditInfo?.risk_level ?? "متوسط"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* تفاصيل التقييم */}
      <div className="lg:col-span-2">
        {riskData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileBarChart />
                    {selectedRetailer?.full_name}
                  </CardTitle>
                  <CardDescription>
                    بيانات التقييم الائتماني ومستوى المخاطر
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    /* اتخاذ قرار */
                  }}
                >
                  اتخاذ قرار
                </Button>
              </div>
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
                      <span className="text-sm">{riskData.riskLevel}</span>
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
