"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Building2, FileText, Shield, Store } from "lucide-react"
import OverviewTab from "@/components/admin-dashboard/overview-tab"
import RetailersTab from "@/components/admin-dashboard/retailers-tab"
import SuppliersTab from "@/components/admin-dashboard/suppliers-tab"
import ContractsTab from "@/components/admin-dashboard/contracts-tab"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "retailers" | "suppliers" | "contracts">("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-md shadow-xs border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المدير</h1>
                <p className="text-sm text-gray-600">إدارة شاملة لجميع عمليات المنصة</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="retailers" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              التجار
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              الموردين
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              العقود
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="retailers" className="space-y-6">
            <RetailersTab />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <SuppliersTab />
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <ContractsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
