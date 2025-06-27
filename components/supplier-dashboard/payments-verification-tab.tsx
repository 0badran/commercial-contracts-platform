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
import { usePayments } from "@/hooks/use-payments";
import { useUsers } from "@/hooks/use-users";
import { crazyToast } from "@/lib/utils";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import TableSkeleton from "../skeletons/table-skeleton";

export default function PaymentsVerificationTab() {
  const { getUserById, currentUser } = useUsers();

  const {
    loading: paymentLoading,
    payments,
    refetch,
    updatePayment,
    error: paymentError,
  } = usePayments({
    supplierId: currentUser?.id,
  });
  const {
    getContractById,
    loading: contractsLoading,
    error: contractsError,
  } = useContracts();

  if (paymentLoading || contractsLoading) {
    return <TableSkeleton />;
  }
  if (paymentError || contractsError) {
    crazyToast("حدث خطأ أثناء تحميل البيانات", "error");
  }
  const pendingPayments = payments.filter(
    (p) => p.payment_verification === "pending"
  );

  async function handlePaymentVerification(
    paymentId: string,
    status: "verified" | "rejected"
  ) {
    const { error } = await updatePayment(paymentId, {
      payment_verification: status,
    });
    if (error) {
      crazyToast(
        `حدث خطأ أثناء ${status === "verified" ? "تأكيد" : "رفض"} الدفعة`,
        "error"
      );
    } else {
      crazyToast(
        `تم ${status === "verified" ? "تأكيد" : "رفض"} الدفعة بنجاح`,
        "success"
      );
      refetch();
    }
  }

  return (
    <Card className="card-hover bg-card/50 backdrop-blur-xs border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          مراجعة الدفعات
        </CardTitle>
        <CardDescription>
          الدفعات التي تحتاج إلى تأكيد من المورد
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingPayments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاجر</TableHead>
                <TableHead>المبلغ المدفوع</TableHead>
                <TableHead>تاريخ السداد</TableHead>
                <TableHead>طريقة الدفع</TableHead>
                <TableHead>ملاحظات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPayments.map((payment) => {
                const contract = getContractById(payment.contract_id);
                const retailer = getUserById(contract!.retailer_id);
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{retailer?.full_name}</TableCell>
                    <TableCell>
                      {payment.amount_paid?.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell>{payment.paid_date || "-"}</TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell>{payment.notes || "-"}</TableCell>
                    <TableCell className="space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() =>
                          handlePaymentVerification(payment.id!, "verified")
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        تأكيد
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() =>
                          handlePaymentVerification(payment.id!, "rejected")
                        }
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        رفض
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد دفعات قيد المراجعة
            </h3>
            <p className="text-gray-600">
              ستظهر هنا الدفعات التي قام التاجر بسدادها ولم يتم التحقق منها بعد.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
