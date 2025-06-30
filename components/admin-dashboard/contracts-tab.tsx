"use client";

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
import { Edit, Eye, Search } from "lucide-react";
import { useState } from "react";
import CustomAlert from "../shared/custom-alert";
import StatusBadge from "../shared/status-badge";
import TableSkeleton from "../skeletons/table-skeleton";
import { emptyCell } from "@/lib/utils";

export default function ContractsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const { getUserById, error: userError, loading: userLoading } = useUsers();
  const { contracts, loading, error } = useContracts();

  if (loading || userLoading) {
    return <TableSkeleton />;
  }
  if (error || userError) {
    return <CustomAlert message="فشل في تحمل العقود" />;
  }
  const filteredContracts = contracts.filter(
    (contract) =>
      getUserById(contract.retailer_id)
        ?.commercial_name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getUserById(contract.supplier_id)
        ?.commercial_name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة العقود</h2>
          <p className="text-gray-600">عرض ومراقبة جميع العقود في النظام</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="البحث في العقود..."
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
                <TableHead>التاجر</TableHead>
                <TableHead>المورد</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>تاريخ البداية</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>شروط الدفع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => {
                const retailer = getUserById(contract.retailer_id);
                const supplier = getUserById(contract.supplier_id);
                return (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      {retailer?.commercial_name}
                    </TableCell>
                    <TableCell>{supplier?.commercial_name}</TableCell>
                    <TableCell>
                      {contract.amount.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell>{contract.start_date || emptyCell}</TableCell>
                    <TableCell>{contract.end_date || emptyCell}</TableCell>
                    <TableCell>{contract.payment_terms}</TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status!} />
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
