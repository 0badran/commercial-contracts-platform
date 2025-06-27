import StatsCards from "@/components/retailer-dashboard/stats-cards";
import TabsContainer from "@/components/retailer-dashboard/tabs-container";
import SignoutButton from "@/components/shared/signout-button";
import StatsCardSkelton from "@/components/skeletons/stats-card-skelton";
import getUser from "@/services/get-user";
import { Store } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function RetailerDashboard() {
  const { user, error } = await getUser();
  if (error) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-md shadow-xs border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  لوحة تحكم التاجر
                </h1>
                <p className="text-sm text-gray-600">
                  إدارة عقودك التجارية والمدفوعات
                </p>
              </div>
            </div>
            <SignoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <Suspense fallback={<StatsCardSkelton />}>
          <StatsCards user={user} />
        </Suspense>

        {/* Main Content */}
        <Suspense fallback={<StatsCardSkelton />}>
          <TabsContainer />
        </Suspense>
      </main>
    </div>
  );
}
