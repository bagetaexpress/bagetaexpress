"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDailyItemCounts } from "@/lib/order-stats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderStats {
  date: string;
  count: number;
}

export default function OrderStatsChart() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<OrderStats[]>([]);

  const fetchData = async (daysToShow: number) => {
    const stats = await getDailyItemCounts(daysToShow);
    setData(stats);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData(days);
  }, [days]);

  const handleDaysChange = (newDays: number) => {
    setDays(newDays);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Daily Order Items</h3>
        <Select value={days.toString()} onValueChange={(value) => handleDaysChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.getDate()}/${d.getMonth() + 1}\n${d.toLocaleDateString(undefined, { weekday: 'short' })}`;
              }}
              height={60}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value: number) => [`${value} items`, "Items"]}
            />
            <Bar
              dataKey="count"
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 