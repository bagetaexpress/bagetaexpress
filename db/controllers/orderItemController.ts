"use server"

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { orderItem } from "../schema";
import { revalidatePath } from "next/cache";

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

async function createOrderItems(orderId: number, items: {itemId: number, quantity: number}[]) {
  await db.insert(orderItem).values(items.map(item => ({
    orderId,
    itemId: item.itemId,
    quantity: item.quantity,
  })));
}

async function deleteOrderItem(orderId: number, itemId: number) {
  await db.delete(orderItem)
  .where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
}

async function deleteOrderItems(orderId: number) {
  await db.delete(orderItem).where(eq(orderItem.orderId, orderId));
}

async function getOrderItems(orderId: number) {
  return await db.select().from(orderItem).where(eq(orderItem.orderId, orderId));
}

async function getOrderItem(orderId: number, itemId: number): Promise<OrderItem | null> {
  const found = await db.select().from(orderItem)
    .where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function updateOrderItem(orderId: number, itemId: number, quantity: number) {
  await db.update(orderItem).set({
    quantity,
  }).where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
}

export {
  createOrderItem,
  createOrderItems,
  deleteOrderItem,
  deleteOrderItems,
  getOrderItems,
  getOrderItem,
  updateOrderItem,
}