import CustomAlert from "@/components/shared/custom-alert";
import SignoutButton from "@/components/shared/signout-button";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import CreditInfoTab from "@/components/supplier-dashboard/credit-info-tab";
import PaymentsVerificationTab from "@/components/supplier-dashboard/payments-verification-tab";
import PendingContractsTab from "@/components/supplier-dashboard/pending-contracts-tab";
import ContractsTab from "@/components/supplier-dashboard/supplier-contracts-tab";
import RiskAssessmentTab from "@/components/supplier-dashboard/risk-assessment-tab";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getContracts from "@/services/get-contracts";
import getUser from "@/services/get-user";
import { AlertCircle } from "lucide-react";

import {
  Building2,
  Clock,
  CreditCard,
  FileBarChart,
  XCircle,
} from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";

export default async function SupplierDashboard() {
  const { user, error: userError } = await getUser();
  const { contracts, error: contractError } = await getContracts();
  if (userError) {
    redirect("/", RedirectType.replace);
  }

  const currentSupplierId = user?.id;
  const currentSupplier = user?.user_metadata as Database["user"];

  if (contractError) {
    return <CustomAlert message="حدث خطأ ما!" Icon={XCircle} variant="error" />;
  }
  const getPendingContracts = () => {
    return contracts.filter(
      (contract) =>
        contract.supplier_id === currentSupplierId &&
        contract.status === "pending"
    );
  };

  const pendingContracts = getPendingContracts();
  const pendingCount = pendingContracts.length;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-md shadow-xs border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  لوحة تحكم المورد
                </h1>
                <p className="text-sm text-gray-600">
                  مرحباً بك {currentSupplier?.full_name.split(" ")[0]}
                </p>
              </div>
            </div>
            <SignoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs dir="rtl" defaultValue="retailers">
          <TabsList className="mb-6">
            <TabsTrigger value="retailers" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              التجار والعقود
            </TabsTrigger>

            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              طلبات العقود
              {pendingCount > 0 && (
                <Badge className="ml-2 bg-blue-500 text-white">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="risk" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              تقييم المخاطر
            </TabsTrigger>

            <TabsTrigger value="credit" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              المعلومات الائتمانية
            </TabsTrigger>

            <TabsTrigger value="payments" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              مراجعة الدفعات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="retailers">
            <ContractsTab />
          </TabsContent>

          <TabsContent value="pending">
            <PendingContractsTab />
          </TabsContent>

          <TabsContent value="risk">
            <RiskAssessmentTab />
          </TabsContent>

          <TabsContent value="credit">
            <CreditInfoTab />
          </TabsContent>

          <TabsContent value="payments">
            <Suspense fallback={<TableSkeleton />}>
              <PaymentsVerificationTab />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </main>
  );
}
