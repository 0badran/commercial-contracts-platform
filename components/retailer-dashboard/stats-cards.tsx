"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContracts } from "@/hooks/use-contracts";
import { usePayments } from "@/hooks/use-payments";
import { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";

export default function StatsCards({ user }: { user: User | null }) {
  const { getCurrentUserContracts } = useContracts();
  const { data: contracts } = getCurrentUserContracts();
  const activeContracts = contracts?.filter((c) => c.status === "active");
  const pendingContracts = contracts?.filter((c) => c.status === "pending");
  const totalAmount = activeContracts?.reduce(
    (sum, contract) => sum + contract.amount,
    0
  );
  const { payments } = usePayments({ retailerId: user?.id });

  const totalPaid = payments
    .filter((p) => p.status === "paid" && p.payment_verification === "verified")
    .reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card className="card-hover bg-linear-to-br from-card to-card/80 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">العقود النشطة</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeContracts?.length}</div>
          <p className="text-xs text-muted-foreground">عقد نشط حالياً</p>
        </CardContent>
      </Card>

      <Card className="card-hover bg-linear-to-br from-card to-card/80 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            بانتظار الموافقة
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingContracts?.length}</div>
          <p className="text-xs text-muted-foreground">عقد بانتظار الموافقة</p>
        </CardContent>
      </Card>

      <Card className="card-hover bg-linear-to-br from-card to-card/80 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المبالغ</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAmount?.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">ريال سعودي</p>
        </CardContent>
      </Card>

      <Card className="card-hover bg-linear-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المدفوع</CardTitle>
          <CheckCircle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPaid.toLocaleString()}</div>
          <p className="text-xs opacity-80">ريال سعودي</p>
        </CardContent>
      </Card>

      <Card className="card-hover bg-linear-to-br from-red-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">متأخرات</CardTitle>
          <AlertCircle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overduePayments.length}</div>
          <p className="text-xs opacity-80">دفعة متأخرة</p>
        </CardContent>
      </Card>
    </div>
  );
}
