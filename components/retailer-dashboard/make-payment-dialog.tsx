"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { crazyToast } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
interface MakePaymentButtonProps {
  contract: Database["contract"];
  setContract?: (contract: Database["contract"]) => void;
  payments: Database["payment"][];
  createPayment: (payment: Database["payment"]) => Promise<any>;
}
export default function MakePaymentDialog({
  contract,
  payments,
  setContract,
  createPayment,
}: MakePaymentButtonProps) {
  const [form, setForm] = useState({
    amountType: "installment",
    customAmount: "",
    method: "cash",
    notes: "",
  });

  const totalDue = contract.amount;
  const paidSoFar = payments.reduce((sum, p) => sum + p.amount_paid!, 0);
  const remainingAmount = totalDue - paidSoFar;
  const installmentAmount = totalDue / contract.number_of_payments;
  const remainingInstallments = Math.ceil(remainingAmount / installmentAmount);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setContract?.(contract);
    e.preventDefault();

    const amount_paid =
      form.amountType === "installment"
        ? installmentAmount
        : Number(form.customAmount);

    if (amount_paid > remainingAmount) {
      crazyToast("المبلغ المدفوع أكبر من المتبقي في العقد", "error");
      return;
    }

    const due_date = new Date();
    const paid_date = new Date();

    await createPayment({
      contract_id: contract.id!,
      amount_due: installmentAmount,
      amount_paid,
      due_date: format(due_date, "yyyy-MM-dd"),
      paid_date: format(paid_date, "yyyy-MM-dd"),
      status:
        amount_paid === installmentAmount
          ? "paid"
          : amount_paid > 0
          ? "partial"
          : "due",
      payment_method: form.method,
      notes: form.notes,
    });

    setForm({
      amountType: "installment",
      customAmount: "",
      method: "cash",
      notes: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">سداد دفعة</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>سداد دفعة للعقد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">نوع الدفع</label>
            <Select
              value={form.amountType}
              onValueChange={(v) => setForm({ ...form, amountType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="installment">تسديد دفعة</SelectItem>
                <SelectItem value="custom">مبلغ آخر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.amountType === "installment" && (
            <div className="text-sm text-gray-600">
              <p>
                عدد الدفعات المتبقية: <strong>{remainingInstallments}</strong>
              </p>
              <p>
                قيمة الدفعة الحالية:{" "}
                <strong>{installmentAmount.toLocaleString()} ر.س</strong>
              </p>
            </div>
          )}

          {form.amountType === "custom" && (
            <div>
              <label className="text-sm font-medium">المبلغ</label>
              <Input
                type="number"
                value={form.customAmount}
                onChange={(e) =>
                  setForm({ ...form, customAmount: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                المبلغ المتبقي: {remainingAmount.toLocaleString()} ر.س
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">طريقة الدفع</label>
            <Select
              value={form.method}
              onValueChange={(v) => setForm({ ...form, method: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">نقداً</SelectItem>
                <SelectItem value="transfer">تحويل بنكي</SelectItem>
                <SelectItem value="cheque">شيك</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">ملاحظات</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <Button type="submit">تأكيد الدفع</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
