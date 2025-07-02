"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { emptyCell } from "@/lib/utils";
import { Edit, Eye, Plus, Search } from "lucide-react";
import { useState } from "react";
import CustomAlert from "../shared/custom-alert";
import SignupForm from "../shared/signup-form";
import TableSkeleton from "../skeletons/table-skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function SuppliersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const { getUsersByType, loading, error } = useUsers();
  const [userId, setUserId] = useState<string | null>(null);

  const {
    getContractsByUserId,
    loading: contractLoading,
    error: contractError,
  } = useContracts();

  if (loading || contractLoading) {
    return <TableSkeleton />;
  }
  if (error || contractError) {
    return (
      <CustomAlert message="فشل في احضار الموردين والعقود" variant="error" />
    );
  }
  const suppliers = getUsersByType("supplier");
  const filteredSuppliers = suppliers.filter(
    (retailer) =>
      retailer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.commercial_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة الموردين</h2>
          <p className="text-gray-600">عرض وإدارة جميع الموردين المسجلين</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مورد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="w-sm md:w-lg overflow-y-scroll max-h-[98vh]">
            <DialogHeader>
              <DialogTitle>
                {userId ? "تعديل بيانات المورد" : "إضافة مورد جديد"}
              </DialogTitle>
              <DialogDescription>أدخل بيانات المورد</DialogDescription>
            </DialogHeader>
            <SignupForm userType="supplier" userId={userId} />
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="البحث في الموردين..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المورد</TableHead>
                <TableHead>المالك</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>العقود</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => {
                const userContracts = getContractsByUserId(supplier.id!).data;
                const isActive = userContracts.find(
                  (c) => c.status === "active"
                );
                return (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      {supplier.commercial_name}
                    </TableCell>
                    <TableCell>{supplier.full_name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{userContracts.length}</TableCell>
                    <TableCell>{supplier.business_type}</TableCell>
                    <TableCell>
                      {isActive ? (
                        <Badge className="bg-green-100 text-green-800">
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          غير نشط
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* See button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-sm md:w-lg overflow-y-scroll max-h-[98vh]">
                            <DialogHeader>
                              <DialogTitle>بيانات المورد</DialogTitle>
                              <DialogDescription>
                                كارت تقيم المورد
                              </DialogDescription>
                            </DialogHeader>
                            {(() => {
                              const { data } = getContractsByUserId(
                                supplier.id!
                              );
                              const activeContracts = data.filter(
                                (item) => item.status === "active"
                              );
                              const pendingContracts = data.filter(
                                (item) => item.status === "pending"
                              );
                              const totalDues = activeContracts.reduce(
                                (n, item) => n + item.amount,
                                0
                              );
                              return (
                                <main>
                                  <section className="grid grid-cols-2 md:grid-cols-3 items-center gap-2">
                                    <Card className="bg-gradient-to-br h-full from-green-50 to-green-100">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-green-800">
                                          إجمالي العقود
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-green-800">
                                            {data.length}
                                          </div>
                                          <p className="text-xs text-green-800">
                                            نشط:{" "}
                                            {activeContracts.length ||
                                              emptyCell}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br h-full from-orange-50 to-orange-100">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-orange-800">
                                          اجمالي المستحقات
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-orange-800">
                                            {totalDues}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br h-full from-blue-50 to-blue-100">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-blue-800">
                                          قيد المراجعه
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="text-center">
                                          <p className="text-2xl font-bold text-blue-800 mt-2">
                                            {pendingContracts.length}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </section>
                                </main>
                              );
                            })()}
                            <DialogClose asChild>
                              <Button variant={"outline"}>إلغاء</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => {
                            setUserId(supplier.id!);
                            setOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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
