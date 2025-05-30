"use client";

import { getOrderStats } from "@/lib/order-stats";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeOptions = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "all", label: "All time" },
];

export default function StatsDisplay() {
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getOrderStats>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const days = selectedPeriod === "all" ? undefined : parseInt(selectedPeriod);
      const newStats = await getOrderStats(days);
      setStats(newStats);
      setLoading(false);
    };

    fetchStats();
  }, [selectedPeriod]);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (!stats) {
    return <div>Failed to load statistics</div>;
  }

  const periodLabel = timeOptions.find(opt => opt.value === selectedPeriod)?.label;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Order Statistics</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Orders ({periodLabel})</h3>
          <p className="text-2xl font-semibold">{stats.totalOrders}</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Items ({periodLabel})</h3>
          <p className="text-2xl font-semibold">{stats.totalOrderedItems}</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Picked Up Orders ({periodLabel})</h3>
          <p className="text-2xl font-semibold">{stats.totalPickedUpOrders}</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Unpicked Orders ({periodLabel})</h3>
          <p className="text-2xl font-semibold">{stats.totalUnpickedOrders}</p>
        </div>
      </div>
    </div>
  );
} 