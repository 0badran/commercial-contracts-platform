"use client";

import RiskIcon from "@/components/shared/risk-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useContracts } from "@/hooks/use-contracts";
import { useCreditInfo } from "@/hooks/use-credit-info";
import { getCreditRatingColor } from "@/lib/utils";
import {
  CreditCard,
  Eye,
  EyeOff,
  FileBarChart,
  FileText,
  Search,
} from "lucide-react";
import { useState } from "react";
import EmptyState from "../shared/empty-state";
import SearchUsersInput from "../shared/search-users-input";
import StatusBadge from "../shared/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUsers } from "@/hooks/use-users";

export default function RetailersContractsTab() {
  const [filteredRetailers, setFilteredRetailers] = useState<
    Database["user"][]
  >([]);

  const [selectedRetailer, setSelectedRetailer] = useState<
    Database["user"] | null
  >(null);

  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);

  const [decisionData, setDecisionData] = useState({
    retailerId: "",
    retailerName: "",
    decision: "approve" as "approve" | "reject" | "moreInfo",
    notes: "",
    facilityAmount: "",
  });

  // Retailer credit info
  const { creditInfo } = useCreditInfo(selectedRetailer?.id as string);

  const { getUsersContractedWithCurrentUser } = useUsers();
  const { getCurrentUserContracts } = useContracts();

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

  const handleOpenDecisionDialog = (
    retailerId: string,
    retailerName: string
  ) => {
    setDecisionData({
      retailerId,
      retailerName,
      decision: "approve",
      notes: "",
      facilityAmount: "",
    });
    setIsDecisionDialogOpen(true);
  };

  const handleSubmitDecision = () => {
    console.log("Decision submitted:", decisionData);
    setIsDecisionDialogOpen(false);
    alert(
      `تم حفظ القرار بنجاح: ${
        decisionData.decision === "approve"
          ? "منح تسهيلات"
          : decisionData.decision === "reject"
          ? "رفض"
          : "طلب بيانات إضافية"
      }`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <SearchUsersInput
          title="قائمة التجار"
          des="ابحث عن التاجر لعرض عقوده الحالية"
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

      {/* Contracts Section */}
      <div className="lg:col-span-2">
        {selectedRetailer ? (
          <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    عقود{" "}
                    {
                      filteredRetailers.find(
                        (r) => r.id === selectedRetailer.id
                      )?.full_name
                    }
                  </CardTitle>
                  <CardDescription>العقود الحالية مع الموردين</CardDescription>
                </div>
                <Button
                  onClick={() =>
                    handleOpenDecisionDialog(
                      selectedRetailer.id as string,
                      selectedRetailer.full_name
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
                    <TableHead>المبلغ</TableHead>
                    <TableHead>تاريخ البداية</TableHead>
                    <TableHead>تاريخ الانتهاء</TableHead>
                    <TableHead>شروط الدفع</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts?.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        {contract.amount.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell>{contract.start_date}</TableCell>
                      <TableCell>{contract.end_date}</TableCell>
                      <TableCell>{contract.payment_terms}</TableCell>
                      <TableCell>
                        <StatusBadge status={contract.status!} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {contracts?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد عقود لهذا التاجر</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  اختر تاجراً لعرض عقوده
                </h3>
                <p className="text-gray-600">
                  اختر تاجراً من القائمة لعرض عقوده الحالية مع الموردين
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        open={isDecisionDialogOpen}
        onOpenChange={setIsDecisionDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>اتخاذ قرار بشأن التاجر</DialogTitle>
            <DialogDescription>
              {decisionData.retailerName} - اتخذ قراراً بشأن منح التسهيلات أو
              طلب بيانات إضافية
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
                  type="number"
                  placeholder="أدخل قيمة التسهيلات"
                  value={decisionData.facilityAmount}
                  onChange={(e) =>
                    setDecisionData({
                      ...decisionData,
                      facilityAmount: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>ملاحظات</span>
              </div>
              <Textarea
                placeholder="أدخل ملاحظات إضافية حول القرار"
                value={decisionData.notes}
                onChange={(e) =>
                  setDecisionData({ ...decisionData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDecisionDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmitDecision}>حفظ القرار</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
