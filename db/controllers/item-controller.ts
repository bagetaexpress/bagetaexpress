"use server";

import { InferInsertModel, eq, sql, and, desc } from "drizzle-orm";
import {
  Cart,
  CartItem,
  Item,
  Order,
  Reservation,
  School,
  SchoolStore,
  Store,
  allergen,
  cartItem,
  customer,
  ingredient,
  item,
  itemAllergen,
  itemIngredient,
  order,
  orderItem,
  reservation,
  schoolStore,
  store,
} from "../schema";
import { db } from "@/db";

export type ExtendedItem = {
  item: Item;
  store: Store;
  schoolStore: SchoolStore;
  reservation: Reservation | null;
};

async function getAllergensByItem(itemId: Item["id"]) {
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

async function getIngredientsByItem(itemId: Item["id"]) {
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

async function getItemBySchool({
  itemId,
  schoolId,
}: {
  itemId: Item["id"];
  schoolId: School["id"];
}): Promise<ExtendedItem> {
  const [found] = await db
    .select({
      item,
      store,
      reservation,
      schoolStore,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .where(
      and(
        eq(schoolStore.schoolId, schoolId),
        eq(item.id, itemId),
        eq(item.deleted, false),
      ),
    )
    .limit(1);

  if (!found) {
    throw new Error("Item not found");
  }

  return found;
}

async function getItemsBySchool(
  schoolId: School["id"],
): Promise<ExtendedItem[]> {
  const items = await db
    .select({
      item,
      store,
      reservation,
      schoolStore,
      sold: sql<number>`SUM(${orderItem.quantity}) as sold`,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .leftJoin(orderItem, eq(item.id, orderItem.itemId))
    .where(and(eq(schoolStore.schoolId, schoolId), eq(item.deleted, false)))
    .groupBy(item.id)
    .orderBy(desc(sql<number>`sold`));

  return items;
}

async function getExtendedItemById(
  itemId: Item["id"],
): Promise<ExtendedItem | null> {
  const [found] = await db
    .select({
      item,
      store,
      reservation,
      schoolStore,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .where(and(eq(item.id, itemId), eq(item.deleted, false)));

  return found;
}

async function getItemById(itemId: Item["id"]): Promise<Item | null> {
  const found = await db.select().from(item).where(eq(item.id, itemId));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

export type CartExtendedItem = ExtendedItem & {
  cartItem: CartItem;
};

async function getItemsFromCart(
  cartId: Cart["userId"],
): Promise<CartExtendedItem[]> {
  return await db
    .select({
      item,
      store,
      cartItem,
      reservation,
      schoolStore,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .innerJoin(cartItem, eq(item.id, cartItem.itemId))
    .where(eq(cartItem.cartId, cartId));
}

async function getItemsFromOrder(orderId: Order["id"]) {
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
async function getItemsStats(storeId: Item["storeId"]): Promise<ItemStats[]> {
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
    .where(and(eq(item.storeId, storeId), eq(item.deleted, false)))
    .groupBy(item.id)) as ItemStats[];

  for (const res of items) {
    res.item.allergens = await getAllergensByItem(res.item.id);
    res.item.ingredients = await getIngredientsByItem(res.item.id);
  }

  return items;
}

async function addItem(
  data: InferInsertModel<typeof item>,
): Promise<Item["id"]> {
  const res = await db.insert(item).values(data).returning();
  return res[0].id;
}

async function removeItem(itemId: Item["id"]) {
  await db.delete(orderItem).where(eq(orderItem.itemId, itemId));
  await db.delete(cartItem).where(eq(cartItem.itemId, itemId));
  await db.delete(itemAllergen).where(eq(itemAllergen.itemId, itemId));
  await db.delete(itemIngredient).where(eq(itemIngredient.itemId, itemId));
  await db.delete(item).where(eq(item.id, itemId));
}

async function updateItem(
  data: {
    id: number;
  } & Partial<Item>,
) {
  await db.update(item).set(data).where(eq(item.id, data.id));
}

async function getOrderItemsByStore(
  storeId: Store["id"],
  orderStatus: Order["status"] = "ordered",
) {
  const items = await db
    .select({
      item,
      quantity: sql<number>`SUM(order_item.quantity)`,
    })
    .from(item)
    .innerJoin(orderItem, eq(item.id, orderItem.itemId))
    .innerJoin(order, eq(orderItem.orderId, order.id))
    .where(and(eq(order.status, orderStatus), eq(item.storeId, storeId)))
    .groupBy(item.id);

  return items;
}

async function getOrderItemsByStoreAndSchool(
  storeId: Store["id"],
  schoolId: School["id"],
  orderStatus: Order["status"] = "ordered",
): Promise<Array<ExtendedItem & { quantity: number }>> {
  const items: Array<ExtendedItem & { quantity: number }> = await db
    .select({
      item,
      store,
      reservation,
      schoolStore,
      quantity: sql<number>`SUM(order_item.quantity)`,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .innerJoin(orderItem, eq(item.id, orderItem.itemId))
    .innerJoin(order, eq(orderItem.orderId, order.id))
    .innerJoin(customer, eq(order.userId, customer.userId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .where(
      and(
        eq(item.storeId, storeId),
        eq(order.status, orderStatus),
        eq(customer.schoolId, schoolId),
      ),
    )
    .groupBy(item.id);

  return items;
}

export {
  getOrderItemsByStoreAndSchool,
  getOrderItemsByStore,
  getItemBySchool,
  getItemsBySchool,
  getItemById,
  getExtendedItemById,
  getItemsFromCart,
  getItemsFromOrder,
  getItemsStats,
  addItem,
  removeItem,
  updateItem,
};
