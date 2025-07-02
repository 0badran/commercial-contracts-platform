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
import { useCreditInfo } from "@/hooks/use-credit-info";
import { useUsers } from "@/hooks/use-users";
import {
  emptyCell,
  getCreditRatingColor,
  translateRiskLevel,
} from "@/lib/utils";
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
import StatusBadge from "../shared/status-badge";

export default function RetailersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const { getUsersByType, loading, error } = useUsers();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    getContractsByUserId,
    loading: contractLoading,
    error: contractError,
  } = useContracts();
  const { getCreditByIdForAdmin } = useCreditInfo();

  if (loading || contractLoading) {
    return <TableSkeleton />;
  }
  if (error || contractError) {
    return (
      <CustomAlert message="فشل في احضار التجار والعقود" variant="error" />
    );
  }
  const retailers = getUsersByType("retailer");
  const filteredRetailers = retailers.filter(
    (retailer) =>
      retailer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.commercial_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة التجار</h2>
          <p className="text-gray-600">عرض وإدارة جميع التجار المسجلين</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة تاجر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="w-sm md:w-lg overflow-y-scroll max-h-[98vh]">
            <DialogHeader>
              <DialogTitle>
                {userId ? "تعديل بيانات التاجر" : "إضافة تاجر جديد"}
              </DialogTitle>
              <DialogDescription>أدخل بيانات التاجر</DialogDescription>
            </DialogHeader>
            <SignupForm userType="retailer" userId={userId} />
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              إلغاء
            </Button>
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
              {filteredRetailers.map((retailer) => {
                const userContracts = getContractsByUserId(retailer.id!).data;
                const isActive = userContracts.find(
                  (c) => c.status === "active"
                );
                const creditInfo = getCreditByIdForAdmin(retailer.id!);
                return (
                  <TableRow key={retailer.id}>
                    <TableCell className="font-medium">
                      {retailer.commercial_name}
                    </TableCell>
                    <TableCell>{retailer.full_name}</TableCell>
                    <TableCell>{retailer.email}</TableCell>
                    <TableCell>{retailer.phone}</TableCell>
                    <TableCell>{userContracts.length}</TableCell>
                    <TableCell>
                      <Badge
                        className={getCreditRatingColor(
                          creditInfo?.credit_rating
                        )}
                      >
                        {creditInfo?.credit_rating || emptyCell}
                      </Badge>
                    </TableCell>
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
                              <DialogTitle>بيانات التاجر</DialogTitle>
                              <DialogDescription>
                                كارت تقيم التاجر
                              </DialogDescription>
                            </DialogHeader>
                            {(() => {
                              const { data } = getContractsByUserId(
                                retailer.id!
                              );

                              return (
                                <main>
                                  <section className="grid grid-cols-2 md:grid-cols-3 items-center gap-2">
                                    <Card className="bg-gradient-to-br from-green-50 to-green-100">
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
                                            {creditInfo?.active_contracts ||
                                              emptyCell}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-orange-800">
                                          نقاط السداد
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-orange-800">
                                            {creditInfo?.payment_score || 50}
                                          </div>
                                          <p className="text-xs text-orange-800">
                                            من 100
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-nowrap text-blue-800">
                                          التصنيف الائتماني
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="text-center">
                                          <StatusBadge
                                            type="credit"
                                            status={
                                              creditInfo?.credit_rating || "C"
                                            }
                                          />
                                          <p className="text-xs text-blue-800 mt-2">
                                            {translateRiskLevel(
                                              creditInfo?.risk_level || "medium"
                                            )}
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

                        {/* Edit button */}
                        <Button
                          onClick={() => {
                            setUserId(retailer.id!);
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
