"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditContractDialog({
  contract,
  onUpdate,
}: {
  contract: Database["contract"];
  onUpdate: (updates: Partial<Database["contract"]>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: contract.amount,
    number_of_payments: contract.number_of_payments,
    payment_terms: contract.payment_terms || "",
  });

  const handleSubmit = () => {
    onUpdate(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          تعديل
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل العقد</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label>قيمة العقد</label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label>عدد الدفعات</label>
            <Input
              type="number"
              value={form.number_of_payments}
              onChange={(e) =>
                setForm({ ...form, number_of_payments: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label>شروط السداد</label>
            <Input
              value={form.payment_terms}
              onChange={(e) =>
                setForm({ ...form, payment_terms: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSubmit}>حفظ التعديلات</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
