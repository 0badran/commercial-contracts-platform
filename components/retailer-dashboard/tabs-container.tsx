"use client";
import { FileText, History } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ContractsTab from "./retailer-contracts-tab";
import PaymentsHistoryTab from "./payments-history-tab";

export default function TabsContainer() {
  const [activeTab, setActiveTab] = useState<"contracts" | "payments-history">(
    "contracts"
  );

  return (
    <Tabs
      dir="rtl"
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as "contracts" | "payments-history")
      }
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="contracts" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          العقود
        </TabsTrigger>
        <TabsTrigger
          value="payments-history"
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          سجل السداد
        </TabsTrigger>
      </TabsList>

      {/* Contracts Tab */}
      <TabsContent value="contracts" className="space-y-6">
        <ContractsTab />
      </TabsContent>

      {/* Payments History Tab */}
      <TabsContent value="payments-history" className="space-y-6">
        <PaymentsHistoryTab />
      </TabsContent>
    </Tabs>
  );
}
