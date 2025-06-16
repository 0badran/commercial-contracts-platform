"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useContracts } from "@/lib/hooks/use-contracts";
import { useUsers } from "@/lib/hooks/use-users";
import { User } from "@supabase/supabase-js";
import { Plus, Search, Store } from "lucide-react";
import { FormEvent, useState } from "react";
import CustomAlert from "../shared/custom-alert";
import Spinner from "../shared/spinner";
import ContractTabSkelton from "../skelton/contract-tab-skelton";

interface ContractsTabProps {
  user: User | null;
}

const getStatusBadge = (status: Database["contract"]["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
    case "pending":
      return (
        <Badge className="bg-blue-100 text-blue-800">بانتظار الموافقة</Badge>
      );
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
    case "completed":
      return <Badge variant="secondary">منتهي</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function ContractsTab({ user }: ContractsTabProps) {
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [messages, setMessages] = useState<{
    message: string;
    stats: "error" | "success";
  } | null>(null);
  const [newContract, setNewContract] = useState({
    supplierId: "",
    amount: "",
    startDate: "",
    endDate: "",
    paymentTerms: "",
    description: "",
    numberOfPayments: "",
  });

  const filteredSuppliers = (suppliers: Database["user"][]) =>
    suppliers.filter(
      (supplier) =>
        supplier.commercial_name
          .toLowerCase()
          .includes(supplierSearch.toLowerCase()) ||
        supplier.business_type
          .toLowerCase()
          .includes(supplierSearch.toLowerCase())
    );

  const {
    createContract,
    loading: contractsLoading,
    error: contractsError,
    contracts,
  } = useContracts();

  const {
    getUsersByType,
    loading: suppliersLoading,
    error: suppliersError,
  } = useUsers();

  const suppliers = getUsersByType("supplier");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const amount = Number(newContract.amount);
    const numberOfPayments = Number(newContract.numberOfPayments);

    const { error } = await createContract({
      supplier_id: selectedSupplierId,
      retailer_id: user?.id as string,
      amount,
      start_date: newContract.startDate,
      end_date: newContract.endDate,
      payment_terms: newContract.paymentTerms,
      description: newContract.description,
      number_of_payments: numberOfPayments,
    });
    if (error) {
      setMessages({ message: "حدث خطأ أثناء إضافة العقد.", stats: "error" });
      return;
    }
    setMessages({
      message: "تم إضافة العقد بنجاح.",
      stats: "success",
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>عقودي التجارية</CardTitle>
            <CardDescription>جميع العقود المسجلة في النظام</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة عقد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              {messages && (
                <CustomAlert
                  message={messages.message}
                  variant={messages.stats}
                />
              )}
              <DialogHeader>
                <DialogTitle>إضافة عقد جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل العقد الجديد مع المورد
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="supplier">اختر المورد</label>
                    <Select
                      value={selectedSupplierId}
                      onValueChange={setSelectedSupplierId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="ابحث عن المورد..."
                              value={supplierSearch}
                              onChange={(e) =>
                                setSupplierSearch(e.target.value)
                              }
                              className="pl-10"
                            />
                          </div>
                        </div>
                        {(() => {
                          if (suppliersLoading) {
                            return (
                              <CustomAlert
                                message="جاري تحميل الموردين..."
                                variant="success"
                              />
                            );
                          }
                          if (suppliersError) {
                            return (
                              <CustomAlert
                                message="حدوث خطأ أثناء تحميل الموردين"
                                variant="error"
                              />
                            );
                          }
                          if (!getUsersByType("supplier").length) {
                            return (
                              <CustomAlert message="لا يوجد موردين مسجلين" />
                            );
                          }
                          return filteredSuppliers(suppliers).map(
                            (supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <span>{supplier.commercial_name}</span>
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({supplier.business_type})
                                    </span>
                                  </div>
                                  <div className="flex items-center ml-auto">
                                    <Store className="h-3 w-3 text-yellow-500 mr-1" />
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          );
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="amount">إجمالي قيمة العقد (ر.س)</label>
                      <Input
                        id="amount"
                        type="number"
                        value={newContract.amount}
                        onChange={(e) =>
                          setNewContract({
                            ...newContract,
                            amount: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="numberOfPayments">عدد الدفعات</label>
                      <Input
                        id="numberOfPayments"
                        type="number"
                        value={newContract.numberOfPayments}
                        onChange={(e) =>
                          setNewContract({
                            ...newContract,
                            numberOfPayments: e.target.value,
                          })
                        }
                        placeholder="مثال: 6"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="startDate">تاريخ بداية العقد</label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newContract.startDate}
                        onChange={(e) =>
                          setNewContract({
                            ...newContract,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="endDate">تاريخ انتهاء العقد</label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newContract.endDate}
                        onChange={(e) =>
                          setNewContract({
                            ...newContract,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="paymentTerms">شروط الدفع</label>
                    <Select
                      value={newContract.paymentTerms}
                      onValueChange={(value) =>
                        setNewContract({ ...newContract, paymentTerms: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر شروط الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="كل 15 يوم">كل 15 يوم</SelectItem>
                        <SelectItem value="كل 30 يوم">كل 30 يوم</SelectItem>
                        <SelectItem value="كل 45 يوم">كل 45 يوم</SelectItem>
                        <SelectItem value="كل 60 يوم">كل 60 يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description">وصف العقد</label>
                    <Textarea
                      id="description"
                      value={newContract.description}
                      onChange={(e) =>
                        setNewContract({
                          ...newContract,
                          description: e.target.value,
                        })
                      }
                      placeholder="وصف مختصر للعقد والخدمات المقدمة"
                    />
                  </div>

                  {/* Payment Preview */}
                  {newContract.amount &&
                  newContract.numberOfPayments &&
                  !isNaN(Number(newContract.amount)) &&
                  !isNaN(Number(newContract.numberOfPayments)) &&
                  Number(newContract.numberOfPayments) > 0 ? (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        معاينة الدفعات
                      </h4>
                      <div className="text-sm text-blue-800">
                        <p>
                          قيمة كل دفعة:{" "}
                          <span className="font-bold">
                            {(
                              Number(newContract.amount) /
                              Number(newContract.numberOfPayments)
                            ).toLocaleString()}{" "}
                            ر.س
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">إلغاء</Button>
                  </DialogClose>
                  <Button disabled={contractsLoading} type="submit">
                    {contractsLoading ? <Spinner /> : null}
                    إضافة العقد
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {(() => {
          if (contractsLoading) {
            return <ContractTabSkelton />;
          }
          if (contractsError) {
            return (
              <CustomAlert
                message="حدوث خطأ أثناء تحميل العقود"
                variant="error"
              />
            );
          }
          if (!contracts.length) {
            return (
              <CustomAlert message="لا يوجد عقود مسجله" variant="primary" />
            );
          }
          return (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المورد</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>عدد الدفعات</TableHead>
                  <TableHead>تاريخ البداية</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      {contract.payment_terms}
                    </TableCell>
                    <TableCell>
                      {contract.amount.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell>{contract.number_of_payments}</TableCell>
                    <TableCell>{contract.start_date}</TableCell>
                    <TableCell>{contract.end_date}</TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
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
