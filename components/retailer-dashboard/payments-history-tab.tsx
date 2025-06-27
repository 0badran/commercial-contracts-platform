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
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { isUUID } from "@/lib/utils";
import EmptyState from "../shared/empty-state";

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          مدفوع
        </Badge>
      );
    case "due":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          مستحق
        </Badge>
      );
    case "overdue":
      return (
        <Badge className="bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          متأخر
        </Badge>
      );
    case "partial":
      return (
        <Badge className="bg-orange-100 text-orange-800">
          <XCircle className="h-3 w-3 mr-1" />
          جزئي
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

  const { payments } = usePayments(
    contractId
      ? { contractId }
      : {
          retailerId: currentUser?.id,
        }
  );

  if (payments.length === 0) {
    return (
      <EmptyState
        title="لا يوجد مدفوعات بعد"
        description="لم يتم عمل اية معامله"
      />
    );
  }
  const upcomingPayments = payments.filter((p) => {
    const dueDate = new Date(p.due_date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return p.status === "paid" && dueDate >= today && dueDate <= nextWeek;
  });

  const overduePayments = payments.filter((p) => {
    const dueDate = new Date(p.due_date);
    const today = new Date();
    return (
      p.status === "due" &&
      p.payment_verification === "verified" &&
      dueDate < today
    );
  });

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
          <CardContent>
            <div className="space-y-2">
              {upcomingPayments.map((payment) => {
                const contract = contracts.find(
                  (c) => c.id === payment.contract_id
                );
                return (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {
                        getUserById(contract?.supplier_id as string)
                          ?.commercial_name
                      }
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {payment.amount_paid?.toLocaleString()} ر.س
                      </span>
                      <span className="text-xs text-gray-600">
                        {payment.due_date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
          <CardContent>
            <div className="space-y-2">
              {overduePayments.map((payment) => {
                const contract = contracts.find(
                  (c) => c.id === payment.contract_id
                );
                return (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {
                        getUserById(contract?.supplier_id as string)
                          ?.commercial_name
                      }
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {payment.amount_due?.toLocaleString()} ر.س
                      </span>
                      <span className="text-xs text-red-600">
                        متأخر منذ {payment.due_date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
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
              <Input type="text" placeholder="ادخل معرف العقد" ref={inputRef} />
              <p className="text-red-500 text-xs">{error}</p>
            </div>
          </div>
          <div className="">
            <CardTitle>سجل السداد</CardTitle>
            <CardDescription>{`جميع المدفوعات والدفعات المستحقة`}</CardDescription>
            {contractId && (
              <Button variant={"ghost"} onClick={() => setContractId("")}>
                إلغاء
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
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
    </div>
  );
}
