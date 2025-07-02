"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { crazyToast } from "@/lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

type Payment = Database["payment"];
type Contract = Database["contract"];
interface MakePaymentButtonProps {
  contract: Contract;
  payments: Payment[];
  createPayment: (
    payment: Payment
  ) => Promise<{ data: Payment | null; error: PostgrestError | null }>;
  updateContract: (
    id: string,
    contract: Contract
  ) => Promise<{ data: Contract | null; error: PostgrestError | null }>;
}
export default function MakePaymentDialog({
  contract,
  createPayment,
  payments,
}: MakePaymentButtonProps) {
  const initialValues = {
    amountType: "installment",
    customAmount: "",
    method: "cash",
    notes: "",
  };
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialValues);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const totalAmount = contract.amount;
  const amountDue = totalAmount / contract.number_of_payments;
  const remainingPayments =
    contract.number_of_payments -
    payments.filter(
      (p) =>
        p.contract_id === contract.id && p.payment_verification === "verified"
    ).length;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (remainingPayments < 1) {
      return crazyToast(
        "تم دفع المبلغ لا يوجد مستحقات في انتظار التاكيد",
        "error"
      );
    }
    setLoading(true);
    const { error } = await createPayment({
      contract_id: contract.id!,
      amount_due: amountDue,
      amount_paid: amountDue,
      due_date: contract.due_date!,
      paid_date: format(new Date(), "yyyy-MM-dd"),
      status: "due",
      payment_method: form.method,
      payment_verification: "pending",
      notes: form.notes,
    });
    setLoading(false);
    if (error) {
      return crazyToast("حدث خطا أثناء تاكيد الدفع", "error");
    }
    setTimeout(() => setOpen(false), 1000);
    crazyToast("تم طلب تاكيد الدفع", "success");
    setForm(initialValues);
    queryClient.invalidateQueries({ queryKey: ["contracts"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              </SelectContent>
            </Select>
          </div>

          {form.amountType === "installment" && (
            <div className="text-sm text-gray-600">
              <p>
                عدد الدفعات المتبقية: <strong>{remainingPayments}</strong>
              </p>
              <p>
                قيمة الدفعة الحالية:{" "}
                <strong>{amountDue.toLocaleString()} ر.س</strong>
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
          <Button type="submit">
            {loading ? "جاري الدفع..." : "تأكيد الدفع"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
