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
import { useUsers } from "@/hooks/use-users";
import { crazyToast, emptyCell } from "@/lib/utils";
import { Copy } from "lucide-react";
import CustomAlert from "../shared/custom-alert";
import EmptyState from "../shared/empty-state";
import StatusBadge from "../shared/status-badge";
import ContractTabSkelton from "../skeletons/contract-tab-skelton";
import { Button } from "../ui/button";
import CreateContractDialog from "./create-contract-dialog";
import EditContractDialog from "./edit-contract-dialog";
import MakePaymentDialog from "./make-payment-dialog";
import { usePayments } from "@/hooks/use-payments";
import Link from "next/link";
import { PATHS } from "@/lib/constants";

export default function ContractsTab() {
  const { getUserById, loading, error: userError } = useUsers();
  const { createPayment, payments } = usePayments({});

  const {
    createContract,
    loading: contractsLoading,
    error: contractsError,
    updateContract,
    deleteContract,
    refetch,
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
          <CreateContractDialog
            refetch={refetch}
            createContract={createContract}
          />
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
                  <TableHead>الاجراءات</TableHead>
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
                    <TableCell className="flex items-center gap-2">
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
                          default:
                            return (
                              <div className="*:text-xs flex gap-x-1">
                                <MakePaymentDialog
                                  createPayment={createPayment}
                                  contract={contract}
                                  payments={payments}
                                  updateContract={updateContract}
                                  getUserById={getUserById}
                                />
                                <Button size={"sm"} variant={"outline"}>
                                  <Link
                                    href={`${PATHS.dashboards.retailer}/printing?supplierId=${contract.supplier_id}`}
                                  >
                                    تجهيز تقرير
                                  </Link>
                                </Button>
                              </div>
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
