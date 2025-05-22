"use server";

import { orderRepository } from "@/repositories/order-repository";

export async function getDailyItemCounts(days: number = 7) {
    const result = await orderRepository.getDailyItemCounts(days);
    
    const dateMap = new Map<string, number>();
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dateMap.set(dateStr, 0);
    }
    
    for (const { date, count } of result) {
        dateMap.set(date, count);
    }
    
    return Array.from(dateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getOrderStats(days: number | undefined) {
    return await orderRepository.getOrderStats(days);
} 