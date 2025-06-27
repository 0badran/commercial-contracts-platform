"use client";

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
import CustomAlert from "../shared/custom-alert";
import StatusBadge from "../shared/status-badge";
import ContractTabSkelton from "../skeletons/contract-tab-skelton";
import CreateContractDialog from "./create-contract-dialog";
import MakePaymentDialog from "./make-payment-dialog";
import { useState } from "react";
import { usePayments } from "@/hooks/use-payments";
import EditContractDialog from "./edit-contract-dialog";
import { Button } from "../ui/button";
import { useUsers } from "@/hooks/use-users";
import { crazyToast, emptyCell } from "@/lib/utils";
import { Copy } from "lucide-react";
import EmptyState from "../shared/empty-state";

export default function ContractsTab() {
  const [contract, setContract] = useState<Database["contract"] | null>(null);
  const { createPayment, payments } = usePayments({ contractId: contract?.id });
  const { getUserById, loading, error: userError } = useUsers();
  const {
    createContract,
    loading: contractsLoading,
    error: contractsError,
    updateContract,
    deleteContract,
    contracts,
  } = useContracts();

  return (
    <Card className="bg-card/50 backdrop-blur-xs border-border/50 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>عقودي التجارية</CardTitle>
            <CardDescription>جميع العقود المسجلة في النظام</CardDescription>
          </div>
          <CreateContractDialog createContract={createContract} />
        </div>
      </CardHeader>
      <CardContent>
        {(() => {
          if (contractsLoading || loading) {
            return <ContractTabSkelton />;
          }
          if (contractsError || userError) {
            return (
              <CustomAlert
                message="حدوث خطأ أثناء تحميل العقود"
                variant="error"
              />
            );
          }
          if (!contracts.length) {
            return (
              <EmptyState
                title="لم يتم اضافه اية عقود"
                description="اضف عقد الان"
              />
            );
          }
          return (
            <Table>
              <TableHeader>
                <TableRow className="*:text-start">
                  <TableHead>المعرف</TableHead>
                  <TableHead>المورد</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>عدد الدفعات</TableHead>
                  <TableHead>تاريخ بداية العقد</TableHead>
                  <TableHead>تاريخ نهاية العقد</TableHead>
                  <TableHead>تاريخ الدفعه القادمة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>أجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id} className="hover:bg-transparent">
                    <TableCell className="font-medium flex gap-0.5">
                      <p>{contract.id?.slice(0, 6)}...</p>
                      <Copy
                        onClick={() => {
                          navigator.clipboard.writeText(contract.id!);
                          crazyToast("تم نسخ المعرف", "success");
                        }}
                        size={16}
                        className="hover:text-slate-400 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell>
                      {getUserById(contract.supplier_id)?.full_name}
                    </TableCell>
                    <TableCell>
                      {contract.amount.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell>{contract.number_of_payments}</TableCell>
                    <TableCell>{contract.start_date || emptyCell}</TableCell>
                    <TableCell>{contract.end_date || emptyCell}</TableCell>
                    <TableCell>{contract.due_date || emptyCell}</TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status!} />
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      {(() => {
                        switch (contract.status) {
                          case "pending":
                            return (
                              <>
                                <EditContractDialog
                                  contract={contract}
                                  onUpdate={(updated) =>
                                    updateContract(contract.id!, updated)
                                  }
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteContract(contract.id!)}
                                >
                                  حذف
                                </Button>
                              </>
                            );
                          case "active":
                            return (
                              <MakePaymentDialog
                                createPayment={createPayment}
                                setContract={setContract}
                                contract={contract}
                                payments={payments}
                              />
                            );
                          default:
                            return (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteContract(contract.id!)}
                              >
                                حذف
                              </Button>
                            );
                        }
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        })()}
      </CardContent>
    </Card>
  );
}
