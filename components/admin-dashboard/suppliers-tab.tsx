"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, Plus, Search, TrendingUp } from "lucide-react";
import { suppliers } from "@/data/suppliers";

export default function SuppliersTab() {
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    category: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = () => {
    // In real app, this would make an API call
    setNewSupplier({
      name: "",
      category: "",
      contactPerson: "",
      email: "",
      phone: "",
    });
    setIsAddingSupplier(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة الموردين</h2>
          <p className="text-gray-600">عرض وإدارة جميع الموردين المسجلين</p>
        </div>
        <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مورد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إضافة مورد جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المورد الجديد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-name">اسم الشركة</Label>
                <Input
                  id="supplier-name"
                  value={newSupplier.name}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                  placeholder="أدخل اسم الشركة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select
                  value={newSupplier.category}
                  onValueChange={(value) =>
                    setNewSupplier({ ...newSupplier, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مواد غذائية">مواد غذائية</SelectItem>
                    <SelectItem value="أجهزة كهربائية">
                      أجهزة كهربائية
                    </SelectItem>
                    <SelectItem value="ملابس">ملابس</SelectItem>
                    <SelectItem value="مواد بناء">مواد بناء</SelectItem>
                    <SelectItem value="أثاث">أثاث</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-person">الشخص المسؤول</Label>
                <Input
                  id="contact-person"
                  value={newSupplier.contactPerson}
                  onChange={(e) =>
                    setNewSupplier({
                      ...newSupplier,
                      contactPerson: e.target.value,
                    })
                  }
                  placeholder="أدخل اسم الشخص المسؤول"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-email">البريد الإلكتروني</Label>
                <Input
                  id="supplier-email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, email: e.target.value })
                  }
                  placeholder="example@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-phone">رقم الهاتف</Label>
                <Input
                  id="supplier-phone"
                  value={newSupplier.phone}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, phone: e.target.value })
                  }
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingSupplier(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleAddSupplier}>إضافة المورد</Button>
            </div>
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
                <TableHead>اسم الشركة</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>الشخص المسؤول</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{supplier.category}</Badge>
                  </TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{supplier.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
