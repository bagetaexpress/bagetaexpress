"use server";

import { eq, sql } from "drizzle-orm";
import {
  allergen,
  cartItem,
  ingredient,
  item,
  itemAllergen,
  itemIngredient,
  order,
  orderItem,
  schoolStore,
  store,
} from "../schema";
import { db } from "@/db";
import { deleteFile } from "@/lib/upladthingServer";

export type Item = {
  id: number;
  name: string;
  storeId: number;
  imageUrl: string;
  description: string;
  price: string;
};

export type ExtendedItem = {
  item: Item;
  allergens?: { id: number; name: string }[];
  ingredients?: { id: number; name: string }[];
};

async function getAllergensByItem(itemId: number) {
  const allergens = await db
    .select({ allergen })
    .from(allergen)
    .innerJoin(itemAllergen, eq(allergen.id, itemAllergen.allergenId))
    .where(eq(itemAllergen.itemId, itemId));

  return allergens.map(({ allergen }) => ({
    id: allergen.number,
    name: allergen.name,
  }));
}

async function getIngredientsByItem(itemId: number) {
  const ingredients = await db
    .select({ ingredient })
    .from(ingredient)
    .innerJoin(itemIngredient, eq(ingredient.id, itemIngredient.ingredientId))
    .where(eq(itemIngredient.itemId, itemId));

  return ingredients.map(({ ingredient }) => ({
    id: ingredient.id,
    name: ingredient.name,
  }));
}

async function getItemsBySchool(schoolId: number): Promise<ExtendedItem[]> {
  const items: ExtendedItem[] = await db
    .select({ item })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(store.id, schoolStore.storeId))
    .where(eq(schoolStore.schoolId, schoolId));

  for (const res of items) {
    res.allergens = await getAllergensByItem(res.item.id);
    res.ingredients = await getIngredientsByItem(res.item.id);
  }

  return items;
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

export type ItemStats = {
  item: Item & {
    allergens: { id: number; name: string }[];
    ingredients: { id: number; name: string }[];
  };
  ordered: number;
  pickedup: number;
  unpicked: number;
};
async function getItemsStats(storeId: number): Promise<ItemStats[]> {
  const items = (await db
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
    .groupBy(item.id)) as ItemStats[];

  for (const res of items) {
    res.item.allergens = await getAllergensByItem(res.item.id);
    res.item.ingredients = await getIngredientsByItem(res.item.id);
  }

  return items;
}

async function addItem(data: {
  name: string;
  storeId: number;
  description: string;
  imageUrl: string;
  price: string;
}) {
  const newItem = await db.insert(item).values(data);
  return parseInt(newItem.insertId);
}

async function removeItem(id: number) {
  await db.delete(orderItem).where(eq(orderItem.itemId, id));
  await db.delete(cartItem).where(eq(cartItem.itemId, id));
  await db.delete(itemAllergen).where(eq(itemAllergen.itemId, id));
  await db.delete(itemIngredient).where(eq(itemIngredient.itemId, id));
  await db.delete(item).where(eq(item.id, id));
}

async function updateItem(data: {
  id: number;
  name?: string;
  storeId?: number;
  imageUrl?: string;
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
