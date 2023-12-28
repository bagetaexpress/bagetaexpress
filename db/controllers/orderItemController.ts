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

async function saveUpdateOrderItemQuantity(orderId: number, itemId: number, quantity: number) {
  const found = await getOrderItemByOrderIdAndItemId(orderId, itemId);
  if (found === null) {
    throw new Error("Order item not found");
  }
  if (found.quantity === quantity) {
    return;
  }
  if (quantity <= 0) {
    await db.delete(orderItem).where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
  }else {
    await updateOrderItemQuantity(orderId, itemId, quantity);
  }
  revalidatePath("/auth/cart", "page");
}

export {
  createOrderItem,
  getOrderItemsByOrderId,
  getOrderItemByOrderIdAndItemId,
  updateOrderItemQuantity,
  saveUpdateOrderItemQuantity,
}