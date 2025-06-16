"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface PendingContractsTabProps {
  contracts: any[]
  setContracts: (contracts: any[]) => void
  currentSupplierId: number
}

export default function PendingContractsTab({ contracts, setContracts, currentSupplierId }: PendingContractsTabProps) {
  const getPendingContracts = () => {
    return contracts.filter(
      (contract) => contract.supplierId === currentSupplierId && contract.status === "بانتظار الموافقة",
    )
  }

  const handleApproveContract = (contractId: number) => {
    setContracts(contracts.map((contract) => (contract.id === contractId ? { ...contract, status: "نشط" } : contract)))
  }

  const handleRejectContract = (contractId: number) => {
    setContracts(
      contracts.map((contract) => (contract.id === contractId ? { ...contract, status: "مرفوض" } : contract)),
    )
  }

  const pendingContracts = getPendingContracts()

  return (
    <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          طلبات العقود الجديدة
        </CardTitle>
        <CardDescription>العقود التي تنتظر موافقتك</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingContracts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاجر</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>تاريخ البداية</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>شروط الدفع</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.retailerName}</TableCell>
                  <TableCell>{contract.amount.toLocaleString()} ر.س</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell>{contract.paymentTerms}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleApproveContract(contract.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        قبول
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectContract(contract.id)}
                      >
                        <XCircle className="h-4 w-4" />
                        رفض
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات عقود جديدة</h3>
            <p className="text-gray-600">ستظهر هنا طلبات العقود الجديدة من التجار</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
