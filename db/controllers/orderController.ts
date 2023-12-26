"use server"

import { db } from "@/db";
import { order } from "../schema";
import { and, eq } from "drizzle-orm";

type OrderStatus = "cart" | "ordered" | "pickedup" | "unpicked" | "cancelled";

export type Order = {
  id: number;
  userId: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

async function getCartByUserId(userId: number): Promise<Order | null> {
  const cart = await db.select().from(order)
    .where(and(eq(order.userId, userId), eq(order.status, "cart")));
  if (cart.length === 0) {
    return null;
  }
  return cart[0];
}

async function createOrder(userId: number, status: OrderStatus): Promise<number> {
  const newOrder = await db.insert(order).values({
    userId,
    status,
  });
  return parseInt(newOrder.insertId);
}

export {
  getCartByUserId,
  createOrder,
}