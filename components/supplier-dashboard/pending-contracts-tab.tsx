"use client";

import { Button } from "@/components/ui/button";
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
import { useUsers } from "@/hooks/use-users";
import { crazyToast } from "@/lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import EmptyState from "../shared/empty-state";
import CustomAlert from "../shared/custom-alert";
import TableSkeleton from "../skeletons/table-skeleton";
import revalidatePage from "@/services/revalidate-page";
import { PATHS } from "@/lib/constants";

export default function PendingContractsTab() {
  const { getUserById } = useUsers();
  const { updateContract, refetch, getCurrentUserContracts, loading } =
    useContracts();
  const { data, error } = getCurrentUserContracts();

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <CustomAlert message={error.message} variant="error" />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="لا يوجد عقود حاليا."
        description="لم يتم اضافة اي عقد بعد"
        icon={Clock}
      />
    );
  }
  async function handleContractStatus(
    contractId: string,
    status: Database["contract"]["status"]
  ) {
    const { error } = await updateContract(contractId, { status });
    revalidatePage(PATHS.dashboards.supplier);
    console.log({ error });

    if (error) {
      return crazyToast(
        `حدث خطأ أثناء تحديث حالة العقد: ${error.code}`,
        "error"
      );
    }
    refetch();
    crazyToast(
      `تم ${status === "active" ? "قبول" : "رفض"} العقد بنجاح`,
      "success"
    );
  }

  return (
    <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          طلبات العقود الجديدة
        </CardTitle>
        <CardDescription>العقود التي تنتظر موافقتك</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاجر</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>شروط الدفع</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((contract) => {
                if (contract.status !== "pending") return null;
                return (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      {getUserById(contract.retailer_id)?.full_name}
                    </TableCell>
                    <TableCell>
                      {contract.amount.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell>{contract.payment_terms}</TableCell>
                    <TableCell>
                      <div className="flex gap-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() =>
                            handleContractStatus(
                              contract.id as string,
                              "active"
                            )
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                          قبول
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() =>
                            handleContractStatus(
                              contract.id as string,
                              "rejected"
                            )
                          }
                        >
                          <XCircle className="h-4 w-4" />
                          رفض
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد طلبات عقود جديدة
            </h3>
            <p className="text-gray-600">
              ستظهر هنا طلبات العقود الجديدة من التجار
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
