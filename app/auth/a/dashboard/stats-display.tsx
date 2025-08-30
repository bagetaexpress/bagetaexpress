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

      <div className="rounded-lg bg-muted-foreground overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {[
            { label: "Total Orders", value: stats.totalOrders },
            { label: "Total Items", value: stats.totalOrderedItems },
            { label: "Picked Up Orders", value: stats.totalPickedUpOrders },
            { label: "Unpicked Orders", value: stats.totalUnpickedOrders },
          ].map((item, index) => (
            <div
              key={item.label}
              className="p-2 sm:p-4 text-center bg-muted"
            >
              <h3 className="text-sm font-medium text-gray-500 truncate">{item.label}</h3>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 