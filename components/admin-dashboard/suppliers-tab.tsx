"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Edit, Eye, Plus, Search } from "lucide-react";
import { useState } from "react";
import CustomAlert from "../shared/custom-alert";
import SignupForm from "../shared/signup-form";
import TableSkeleton from "../skeletons/table-skeleton";
import {
  Dialog,
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
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
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
