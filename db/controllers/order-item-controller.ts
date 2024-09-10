"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { OrderItem, orderItem } from "../schema";

async function createOrderItem(
  orderId: OrderItem["orderId"],
  itemId: OrderItem["itemId"],
  quantity: OrderItem["quantity"],
) {
  await db.insert(orderItem).values({
    orderId,
    itemId,
    quantity,
  });
}

async function createOrderItems(
  orderId: OrderItem["orderId"],
  items: {
    itemId: OrderItem["itemId"];
    quantity: OrderItem["quantity"];
  }[],
) {
  await db.insert(orderItem).values(
    items.map((item) => ({
      orderId,
      itemId: item.itemId,
      quantity: item.quantity,
    })),
  );
}

async function deleteOrderItem(
  orderId: OrderItem["orderId"],
  itemId: OrderItem["itemId"],
) {
  await db
    .delete(orderItem)
    .where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
}

async function deleteOrderItems(orderId: OrderItem["orderId"]) {
  await db.delete(orderItem).where(eq(orderItem.orderId, orderId));
}

async function getOrderItems(orderId: OrderItem["orderId"]) {
  return await db
    .select()
    .from(orderItem)
    .where(eq(orderItem.orderId, orderId));
}

async function getOrderItem(
  orderId: OrderItem["orderId"],
  itemId: OrderItem["itemId"],
): Promise<OrderItem | null> {
  const found = await db
    .select()
    .from(orderItem)
    .where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function updateOrderItem(
  orderId: OrderItem["orderId"],
  itemId: OrderItem["itemId"],
  quantity: OrderItem["quantity"],
) {
  await db
    .update(orderItem)
    .set({
      quantity,
    })
    .where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
}

export {
  createOrderItem,
  createOrderItems,
  deleteOrderItem,
  deleteOrderItems,
  getOrderItems,
  getOrderItem,
  updateOrderItem,
};
