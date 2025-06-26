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
import { useUsers } from "@/hooks/use-users";
import { crazyToast } from "@/lib/utils";
import updateContractStatus from "@/services/update-contract-status";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface PendingContractsTabProps {
  pendingContracts: Database["contract"][];
}

export default function PendingContractsTab({
  pendingContracts,
}: PendingContractsTabProps) {
  const { getUserById } = useUsers();

  async function handleContractStatus(
    contractId: string,
    status: Database["contract"]["status"]
  ) {
    const { error } = await updateContractStatus(contractId, status);
    if (error) {
      crazyToast("حدث خطأ أثناء تحديث حالة العقد", "error");
    }
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
        {pendingContracts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاجر</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>تاريخ البداية</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>شروط الدفع</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    {getUserById(contract.retailer_id)?.full_name}
                  </TableCell>
                  <TableCell>{contract.amount.toLocaleString()} ر.س</TableCell>
                  <TableCell>{contract.start_date}</TableCell>
                  <TableCell>{contract.end_date}</TableCell>
                  <TableCell>{contract.payment_terms}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() =>
                          handleContractStatus(contract.id as string, "active")
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
              ))}
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
