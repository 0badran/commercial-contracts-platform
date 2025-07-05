"use client";
import CustomAlert from "@/components/shared/custom-alert";
import StatusBadge from "@/components/shared/status-badge";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { emptyCell, isUUID, translateRole } from "@/lib/utils";
import { Printer } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Printing() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { getUserById } = useUsers();
  const { getCurrentUserContracts, error, loading } = useContracts();

  if (loading) {
    return <TableSkeleton />;
  }
  if (error) {
    return <CustomAlert message="حدث خطا حاول مره اخري" variant="error" />;
  }
  if (!isUUID(userId!)) {
    return (
      <CustomAlert message="معرف غير صالح: INVALID_ID" variant="warning" />
    );
  }
  const user = getUserById(userId!);
  if (!user) {
    return (
      <CustomAlert message="المورد او التاجر غير موجود!" variant="error" />
    );
  }

  const { data } = getCurrentUserContracts();
  const contracts = data.filter(
    (c) =>
      c[`${user.user_type as "supplier" | "retailer"}_id`] === userId &&
      (c.status === "active" || c.status === "completed")
  );
  let activeTotalAmount: number = 0;
  let completeTotalAmount: number = 0;
  for (const c of contracts) {
    if (c.status === "active") {
      activeTotalAmount += c.amount;
    }
    if (c.status === "completed") {
      completeTotalAmount += c.amount;
    }
  }

  return (
    <Card className="container mt-10">
      <CardHeader>
        <section className="flex justify-between items-center flex-wrap gap-2">
          <div className="">
            <p>
              اسم {translateRole(user.user_type)}: {user?.full_name}
            </p>
            <p>اجمالي العقود النشطه: {activeTotalAmount}</p>
            <p>اجمالي العقود المكتمله: {completeTotalAmount}</p>
            <p>عدد العقود: {contracts.length}</p>
            <p>اجمالي العقود: {activeTotalAmount + completeTotalAmount}</p>
          </div>
          <div className="">
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="Logo"
              className="mx-auto"
            />
            جميع العقود النشطه والمكتملة مع {translateRole(user.user_type)}
          </div>
          <Button variant={"outline"} onClick={window.print}>
            <Printer />
            طباعة تقرير
          </Button>
        </section>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="*:text-start">
              <TableHead>المبلغ</TableHead>
              <TableHead>عدد الدفعات</TableHead>
              <TableHead>تاريخ بداية العقد</TableHead>
              <TableHead>تاريخ نهاية العقد</TableHead>
              <TableHead>تاريخ الدفعه القادمة</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id} className="h-10">
                <TableCell>{contract.amount.toLocaleString()} ر.س</TableCell>
                <TableCell>{contract.number_of_payments}</TableCell>
                <TableCell>{contract.start_date || emptyCell}</TableCell>
                <TableCell>{contract.end_date || emptyCell}</TableCell>
                <TableCell>{contract.due_date || emptyCell}</TableCell>
                <TableCell>
                  <StatusBadge status={contract.status!} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
