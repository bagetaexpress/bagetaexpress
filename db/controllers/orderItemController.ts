"use server"

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { orderItem } from "../schema";

export type OrderItem = {
  orderId: number;
  itemId: number;
  quantity: number;
};

async function createOrderItem(orderId: number, itemId: number, quantity: number) {
  await db.insert(orderItem).values({
    orderId,
    itemId,
    quantity,
  });
}

async function getOrderItemsByOrderId(orderId: number) {
  return await db.select().from(orderItem).where(eq(orderItem.orderId, orderId));
}

async function getOrderItemByOrderIdAndItemId(orderId: number, itemId: number): Promise<OrderItem | null> {
  const found = await db.select().from(orderItem)
    .where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function updateOrderItemQuantity(orderId: number, itemId: number, quantity: number) {
  await db.update(orderItem).set({
    quantity,
  }).where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
}

export {
  createOrderItem,
  getOrderItemsByOrderId,
  getOrderItemByOrderIdAndItemId,
  updateOrderItemQuantity,
}