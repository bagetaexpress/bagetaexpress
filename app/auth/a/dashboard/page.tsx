import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import OrderStatsChart from "@/components/admin/order-stats-chart";
import { Suspense } from "react";
import StatsDisplay from "./stats-display";

export default async function AdminDashboard() {
  const user = await getUser();
  
  if (!user?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="space-y-6 px-2 lg:px-0">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <Suspense fallback={<div>Loading statistics...</div>}>
          <StatsDisplay />
          <OrderStatsChart />
      </Suspense>
    </div>
  );
} 