"use client";
import { User } from "@supabase/supabase-js";
import { CreditCard, FileText } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ContractsTab from "./contracts-tab";
import PaymentsTab from "./payments-tab";
interface Props {
  user: User | null;
}
export default function TabsContainer({ user }: Props) {
  const [activeTab, setActiveTab] = useState<"contracts" | "payments">(
    "contracts"
  );
  return (
    <Tabs
      dir="rtl"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as "contracts" | "payments")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="contracts" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          العقود
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          سجل السداد
        </TabsTrigger>
      </TabsList>

      {/* Contracts Tab */}
      <TabsContent value="contracts" className="space-y-6">
        <ContractsTab user={user} />
      </TabsContent>

      {/* Payments Tab */}
      <TabsContent value="payments" className="space-y-6">
        <PaymentsTab />
      </TabsContent>
    </Tabs>
  );
}
