"use server";

import { eq, sql } from "drizzle-orm";
import {
  cartItem,
  item,
  order,
  orderItem,
  schoolStore,
  store,
} from "../schema";
import { db } from "@/db";

export type Item = {
  id: number;
  name: string;
  storeId: number;
  description: string;
  price: string;
};

async function getItemsBySchool(schoolId: number) {
  const items = await db
    .select({ item })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(store.id, schoolStore.storeId))
    .where(eq(schoolStore.schoolId, schoolId));
  return items.map((item) => item.item);
}

async function getItemById(id: number): Promise<Item | null> {
  const found = await db.select().from(item).where(eq(item.id, id));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function getItemsFromCart(cartId: number) {
  const items = await db
    .select({ item, quantity: cartItem.quantity })
    .from(item)
    .innerJoin(cartItem, eq(item.id, cartItem.itemId))
    .where(eq(cartItem.cartId, cartId));
  return items.map((item) => ({ item: item.item, quantity: item.quantity }));
}

async function getItemsFromOrder(orderId: number) {
  const items = await db
    .select({ item, quantity: orderItem.quantity })
    .from(item)
    .innerJoin(orderItem, eq(item.id, orderItem.itemId))
    .where(eq(orderItem.orderId, orderId));
  return items.map((item) => ({ item: item.item, quantity: item.quantity }));
}

async function getItemsStats(storeId: number) {
  const items = await db
    .select({
      item,
      ordered: sql`COUNT(case when 'ordered' = ${order.status} then 1 else null end)`,
      pickedup: sql`COUNT(case when 'pickedup' = ${order.status} then 1 else null end)`,
      unpicked: sql`COUNT(case when 'unpicked' = ${order.status} then 1 else null end)`,
    })
    .from(item)
    .leftJoin(orderItem, eq(item.id, orderItem.itemId))
    .leftJoin(order, eq(orderItem.orderId, order.id))
    .where(eq(item.storeId, storeId))
    .groupBy(item.id);

  return items as {
    item: Item;
    ordered: number;
    pickedup: number;
    unpicked: number;
  }[];
}

async function addItem(data: {
  name: string;
  storeId: number;
  description: string;
  price: string;
}) {
  const newItem = await db.insert(item).values(data);
  return newItem.insertId;
}

async function removeItem(id: number) {
  await db.delete(orderItem).where(eq(orderItem.itemId, id));
  await db.delete(item).where(eq(item.id, id));
}

async function updateItem(data: {
  id: number;
  name?: string;
  storeId?: number;
  description?: string;
  price?: string;
}) {
  await db.update(item).set(data).where(eq(item.id, data.id));
}

export {
  getItemsBySchool,
  getItemById,
  getItemsFromCart,
  getItemsFromOrder,
  getItemsStats,
  addItem,
  removeItem,
  updateItem,
};
