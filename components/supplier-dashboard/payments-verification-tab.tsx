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
import { crazyToast, emptyCell } from "@/lib/utils";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import TableSkeleton from "../skeletons/table-skeleton";
import revalidatePage from "@/services/revalidate-page";
import { PATHS } from "@/lib/constants";
import { format } from "date-fns";

export default function PaymentsVerificationTab() {
  const { getUserById, currentUser } = useUsers();

  const {
    loading: paymentLoading,
    payments,
    refetch: paymentsRefetch,
    updatePayment,
    error: paymentError,
  } = usePayments({
    supplierId: currentUser?.id,
  });
  const {
    getContractById,
    loading: contractsLoading,
    error: contractsError,
    updateContract,
    refetch: contractsRefetch,
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
    status: "verified" | "rejected",
    contract: Database["contract"] | null
  ) {
    // Calculate overdue paid
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(contract?.due_date || new Date());
    dueDate.setHours(0, 0, 0, 0);
    const isOverdue = today > dueDate;

    const { error } = await updatePayment(paymentId, {
      payment_verification: status,
      status: status === "verified" ? (isOverdue ? "overdue" : "paid") : "due",
    });

    if (error) {
      return crazyToast(
        `حدث خطأ أثناء ${status === "verified" ? "تأكيد" : "رفض"} الدفعة`,
        "error"
      );
    }
    crazyToast(
      `تم ${status === "verified" ? "تأكيد" : "رفض"} الدفعة بنجاح`,
      "success"
    );

    // If payment success update contract
    if (status === "verified") {
      contractsRefetch();
      const paymentTerms = contract!.payment_terms;
      const newDueDate = new Date(contract?.due_date || new Date());
      newDueDate.setDate(newDueDate.getDate() + paymentTerms);
      const paymentCount = payments.filter(
        (p) =>
          p.contract_id === contract!.id &&
          p.payment_verification === "verified"
      ).length;
      const isPaid = paymentCount > Number(contract?.number_of_payments || 0);
      const updates: Database["contract"] = {};
      if (isPaid) {
        updates.status = "completed";
        updates.paid_date = format(today, "yyyy-MM-dd");
      } else {
        updates.due_date = format(newDueDate, "yyyy-MM-dd");
      }
      const { data, error } = await updateContract(contract?.id || "", updates);
      console.log({ data, error });
    }
    paymentsRefetch();
    revalidatePage(PATHS.dashboards.supplier);
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
                    <TableCell>{payment.paid_date}</TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell>{payment.notes || emptyCell}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() =>
                          handlePaymentVerification(
                            payment.id!,
                            "verified",
                            contract
                          )
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
                          handlePaymentVerification(
                            payment.id!,
                            "rejected",
                            contract
                          )
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
