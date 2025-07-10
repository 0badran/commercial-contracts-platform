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
import { useContracts } from "@/hooks/use-contracts";
import { usePayments } from "@/hooks/use-payments";
import { useUsers } from "@/hooks/use-users";
import { isUUID } from "@/lib/utils";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import { useRef, useState } from "react";
import EmptyState from "../shared/empty-state";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 me-1" />
          مدفوع
        </Badge>
      );
    case "due":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 me-1" />
          مستحق
        </Badge>
      );
    case "overdue":
      return (
        <Badge className="bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 me-1" />
          متأخر
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getVerificationBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-100 text-green-800">تم التحقق</Badge>;
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      );
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function PaymentsHistoryTab() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [contractId, setContractId] = useState<string>("");
  const [error, setError] = useState("");
  const { contracts, getContractById } = useContracts();
  const { getUserById, currentUser } = useUsers();

  const { payments, getPaymentsByContractId } = usePayments(
    // If there contract id display all contract's payments else display all user payments
    contractId
      ? { contractId }
      : {
          retailerId: currentUser?.id,
        }
  );

  // All active contracts have one week to paid
  const upcomingPayments = contracts.filter((c) => {
    if (c.status !== "active") return false;
    const dueDate = new Date(c.due_date!);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= nextWeek;
  });

  // All overdue contracts
  const overduePayments = contracts.filter((c) => c.status === "overdue");

  return (
    <div className="space-y-6">
      {/* Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              دفعات مستحقة خلال الأسبوع القادم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-50 scroll-auto">
            {upcomingPayments.map((contract, i) => {
              const contractPayments = getPaymentsByContractId(contract.id!);
              const amountPaid = contractPayments.reduce(
                (sum, payment) => sum + (payment.amount_paid || 0),
                0
              );

              return (
                <>
                  <div
                    key={contract.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      شركة:{" "}
                      {
                        getUserById(contract?.supplier_id as string)
                          ?.commercial_name
                      }
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        المدفوع حتي الان وتاريخ الاستحقاق القادم:{" "}
                        {amountPaid.toLocaleString()} ر.س
                      </span>
                      <span className="text-xs text-gray-600">
                        {contract.due_date}
                      </span>
                    </div>
                  </div>
                  {i > 0 && <hr />}
                </>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Overdue Payments Alert */}
      {overduePayments.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              دفعات متأخرة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-50 scroll-auto">
            {overduePayments.map((contract, i) => {
              const amountDue = contract.amount / contract.number_of_payments;
              return (
                <>
                  <div
                    key={contract.id}
                    className="flex justify-between font-medium items-center"
                  >
                    <span className="text-sm">
                      لصالح شركة:{" "}
                      {
                        getUserById(contract?.supplier_id as string)
                          ?.commercial_name
                      }
                    </span>
                    <div className="flex items-center gap-2">
                      <span>
                        المبلغ المستحق وتاريخهُ: {amountDue.toLocaleString()}{" "}
                        ر.س
                      </span>
                      -
                      <span className="text-xs text-red-600">
                        متأخر منذ {contract.due_date}
                      </span>
                    </div>
                  </div>
                  {i > 0 && <hr />}
                </>
              );
            })}
          </CardContent>
        </Card>
      )}

      {payments.length === 0 ? (
        <EmptyState
          title="لا يوجد مدفوعات بعد"
          description="لم يتم عمل اية معامله"
        />
      ) : (
        // Payment history
        <Card className="bg-card/50 backdrop-blur-xs border-border/50 shadow-lg">
          <CardHeader className="justify-between md:flex-row">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const contractId = inputRef.current?.value;
                  if (!isUUID(contractId!)) {
                    setTimeout(() => setError(""), 5000);
                    return setError("معرف عقد غير صحيح");
                  }
                  setContractId(contractId!);
                }}
              >
                عرض سجل السداد
              </Button>
              <div>
                <Input
                  type="text"
                  placeholder="ادخل معرف العقد"
                  ref={inputRef}
                />
                <p className="text-red-500 text-xs">{error}</p>
              </div>
            </div>
            <div className="">
              <CardTitle>سجل السداد</CardTitle>
              <CardDescription>{`جميع المدفوعات والدفعات المستحقة`}</CardDescription>
              {contractId && (
                <Button
                  className="mr-auto block mt-2"
                  variant={"outline"}
                  onClick={() => {
                    setContractId("");
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  إلغاء
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table className="max-h-100 overflow-y-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>المورد</TableHead>
                  <TableHead>المبلغ المستحق</TableHead>
                  <TableHead>المبلغ المدفوع</TableHead>
                  <TableHead>تاريخ الاستحقاق</TableHead>
                  <TableHead>تاريخ الدفع</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التحقق من الدفع</TableHead>
                  <TableHead>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const contract = getContractById(payment.contract_id);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {getUserById(contract!.supplier_id)?.full_name}
                      </TableCell>
                      <TableCell>
                        {payment.amount_due.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell>
                        {payment.amount_paid
                          ? `${payment.amount_paid.toLocaleString()} ر.س`
                          : "-"}
                      </TableCell>
                      <TableCell>{payment.due_date}</TableCell>
                      <TableCell>{payment.paid_date || "-"}</TableCell>
                      <TableCell>{payment.payment_method || "-"}</TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(payment.status || "-")}
                      </TableCell>
                      <TableCell>
                        {getVerificationBadge(payment.payment_verification!)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {payment.notes || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
