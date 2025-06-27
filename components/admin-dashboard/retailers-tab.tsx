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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Eye, Plus, Search } from "lucide-react";
import { retailers } from "@/data/users";

export default function RetailersTab() {
  const [isAddingRetailer, setIsAddingRetailer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRetailer, setNewRetailer] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const filteredRetailers = retailers.filter(
    (retailer) =>
      retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRetailer = () => {
    // In real app, this would make an API call
    setNewRetailer({
      name: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
    });
    setIsAddingRetailer(false);
  };

  const getCreditRatingColor = (rating: string) => {
    switch (rating) {
      case "A":
        return "bg-green-100 text-green-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "E":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة التجار</h2>
          <p className="text-gray-600">عرض وإدارة جميع التجار المسجلين</p>
        </div>
        <Dialog open={isAddingRetailer} onOpenChange={setIsAddingRetailer}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة تاجر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إضافة تاجر جديد</DialogTitle>
              <DialogDescription>أدخل بيانات التاجر الجديد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="retailer-name">اسم المتجر</Label>
                <Input
                  id="retailer-name"
                  value={newRetailer.name}
                  onChange={(e) =>
                    setNewRetailer({ ...newRetailer, name: e.target.value })
                  }
                  placeholder="أدخل اسم المتجر"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-name">اسم المالك</Label>
                <Input
                  id="owner-name"
                  value={newRetailer.ownerName}
                  onChange={(e) =>
                    setNewRetailer({
                      ...newRetailer,
                      ownerName: e.target.value,
                    })
                  }
                  placeholder="أدخل اسم المالك"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={newRetailer.email}
                  onChange={(e) =>
                    setNewRetailer({ ...newRetailer, email: e.target.value })
                  }
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newRetailer.phone}
                  onChange={(e) =>
                    setNewRetailer({ ...newRetailer, phone: e.target.value })
                  }
                  placeholder="05xxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Textarea
                  id="address"
                  value={newRetailer.address}
                  onChange={(e) =>
                    setNewRetailer({ ...newRetailer, address: e.target.value })
                  }
                  placeholder="أدخل العنوان الكامل"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingRetailer(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleAddRetailer}>إضافة التاجر</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="البحث في التجار..."
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
                <TableHead>اسم المتجر</TableHead>
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
              {filteredRetailers.map((retailer) => (
                <TableRow key={retailer.id}>
                  <TableCell className="font-medium">{retailer.name}</TableCell>
                  <TableCell>{retailer.ownerName}</TableCell>
                  <TableCell>{retailer.email}</TableCell>
                  <TableCell>{retailer.phone}</TableCell>
                  <TableCell>{retailer.totalContracts}</TableCell>
                  <TableCell>
                    <Badge
                      className={getCreditRatingColor(retailer.creditRating)}
                    >
                      {retailer.creditRating}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      {retailer.status}
                    </Badge>
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
