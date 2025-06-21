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
import { CheckCircle, CreditCard, EyeOff, Search, XCircle } from "lucide-react";
import { useState } from "react";

import { useContracts } from "@/hooks/use-contracts";
import { useCreditInfo } from "@/hooks/use-credit-info";
import { useUsers } from "@/hooks/use-users";
import { getCreditRatingColor } from "@/lib/utils";
import EmptyState from "../shared/empty-state";
import RiskIcon from "../shared/risk-icon";
import SearchUsersInput from "../shared/search-users-input";
type Contracts = Database["contract"][];

export default function CreditInfoTab({
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <SearchUsersInput
          title="اختر تاجراً لعرض معلوماته الائتمانية"
          des="اختر تاجراً من القائمة لعرض تقريره الائتماني الشامل"
          userType="retailer"
          users={filteredRetailers}
          setUsers={setFilteredRetailers}
        />

        <div className="space-y-2">
          {filteredRetailers.map((retailer) => (
            <div
              key={retailer.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRetailer?.id === retailer.id
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border hover:border-border/80 hover:bg-accent/50"
              }`}
              onClick={() => setSelectedRetailer(retailer)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{retailer.full_name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    عقود {creditInfo?.total_contracts} •{" "}
                    {creditInfo?.paid_amount!.toLocaleString()} ر.س
                  </p>
                  <p className="text-xs text-gray-500">
                    رقم السجل: CR-{retailer.commercial_identity_number}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    className={getCreditRatingColor(creditInfo?.credit_rating)}
                  >
                    {creditInfo?.credit_rating}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <RiskIcon risk={creditInfo?.risk_level} />
                    <span className="text-xs">{creditInfo?.risk_level}</span>
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
                        {creditInfo.risk_level}
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
