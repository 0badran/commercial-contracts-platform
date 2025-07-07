"use client";

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
import { useContracts } from "@/hooks/use-contracts";
import { useCreditInfo } from "@/hooks/use-credit-info";
import { useUsers } from "@/hooks/use-users";
import { Eye, EyeOff, FileText, Printer } from "lucide-react";
import { Suspense, useState } from "react";
import CustomAlert from "../shared/custom-alert";
import EmptyState from "../shared/empty-state";
import SearchUsersInput from "./search-users-input";
import StatusBadge from "../shared/status-badge";
import TableSkeleton from "../skeletons/table-skeleton";
import { emptyCell } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { PATHS } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

export default function ContractsTab() {
  const { getUsersContractedWithCurrentUser, loading, getUserById } =
    useUsers();

  const searchParams = useSearchParams();
  const retailerId = searchParams.get("retailerId");
  const initialRetailer = getUserById(retailerId!) || null;
  const [selectedRetailer, setSelectedRetailer] = useState<
    Database["user"] | null
  >(initialRetailer);

  const { getCurrentUserContracts } = useContracts();

  const { data, error: contractsError } = getCurrentUserContracts();
  const contracts = data.filter((c) => c.status !== "pending");
  const { data: retailers, error } = getUsersContractedWithCurrentUser(
    contracts!
  );

  const { getCreditById } = useCreditInfo();

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
      <div className="lg:col-span-1">
        <Suspense fallback={<TableSkeleton />}>
          <SearchUsersInput
            title="قائمة التجار"
            des="ابحث عن التاجر لعرض عقوده الحالية"
            userType="retailer"
            users={retailers}
            getCreditById={getCreditById}
            setSelectedRetailer={setSelectedRetailer}
          />
        </Suspense>
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
                    عقود {selectedRetailer.full_name}
                  </CardTitle>
                  <CardDescription>العقود الحالية مع الموردين</CardDescription>
                </div>
                <Button size={"sm"} variant={"outline"}>
                  <Link
                    className="flex gap-1 items-center"
                    href={`${PATHS.dashboards.supplier}/printing?userId=${selectedRetailer.id}`}
                  >
                    <Printer />
                    تجهيز تقرير
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>شروط الدفع</TableHead>
                    <TableHead>تاريخ بداية العقد</TableHead>
                    <TableHead>تاريخ نهاية العقد</TableHead>
                    <TableHead>تاريخ الدفعه القادمة</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) =>
                    contract.retailer_id !== selectedRetailer.id ? null : (
                      <TableRow key={contract.id}>
                        <TableCell>
                          {contract.amount.toLocaleString()} ر.س
                        </TableCell>
                        <TableCell>{contract.payment_terms}</TableCell>
                        <TableCell>
                          {contract.start_date || emptyCell}
                        </TableCell>
                        <TableCell>{contract.end_date || emptyCell}</TableCell>
                        <TableCell>{contract.due_date || emptyCell}</TableCell>
                        <TableCell>
                          <StatusBadge status={contract.status!} />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
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
    </div>
  );
}
