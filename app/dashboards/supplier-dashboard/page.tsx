"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Clock, FileBarChart, CreditCard } from "lucide-react"
import { suppliers } from "@/data/suppliers"
import { allContracts } from "@/data/users"
import RetailersContractsTab from "@/components/supplier-dashboard/retailers-contracts-tab"
import PendingContractsTab from "@/components/supplier-dashboard/pending-contracts-tab"
import RiskAssessmentTab from "@/components/supplier-dashboard/risk-assessment-tab"
import CreditInfoTab from "@/components/supplier-dashboard/credit-info-tab"

// Find the current supplier (for demo purposes, we'll use the first one)
const currentSupplier = suppliers[0]

export default function SupplierDashboard() {
  const [contracts, setContracts] = useState(allContracts)
  const [activeTab, setActiveTab] = useState<"retailers" | "pending" | "risk" | "credit">("retailers")

  const getPendingContracts = () => {
    return contracts.filter(
      (contract) => contract.supplierId === currentSupplier.id && contract.status === "بانتظار الموافقة",
    )
  }

  const pendingContracts = getPendingContracts()
  const pendingCount = pendingContracts.length

  const handleOpenDecisionDialog = (retailerId: number, retailerName: string) => {
    // This will be handled by individual tab components
    console.log("Opening decision dialog for:", retailerId, retailerName)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المورد</h1>
                <p className="text-sm text-gray-600">مرحباً بك {currentSupplier.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "retailers" | "pending" | "risk" | "credit")}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="retailers" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                التجار والعقود
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                طلبات العقود
                {pendingCount > 0 && <Badge className="ml-2 bg-blue-500 text-white">{pendingCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" />
                تقييم المخاطر
              </TabsTrigger>
              <TabsTrigger value="credit" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                المعلومات الائتمانية
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="retailers">
            <RetailersContractsTab
              contracts={contracts}
              setContracts={setContracts}
              currentSupplierId={currentSupplier.id}
            />
          </TabsContent>

          <TabsContent value="pending">
            <PendingContractsTab
              contracts={contracts}
              setContracts={setContracts}
              currentSupplierId={currentSupplier.id}
            />
          </TabsContent>

          <TabsContent value="risk">
            <RiskAssessmentTab contracts={contracts} onOpenDecisionDialog={handleOpenDecisionDialog} />
          </TabsContent>

          <TabsContent value="credit">
            <CreditInfoTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
