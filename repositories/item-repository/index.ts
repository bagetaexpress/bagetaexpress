import "server-only";
import {
  InferInsertModel,
  eq,
  sql,
  and,
  desc,
  or,
  isNotNull,
  getTableColumns,
  SQL,
} from "drizzle-orm";
import {
  Allergen,
  Cart,
  CartItem,
  Ingredient,
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
} from "@/db/schema";
import { db } from "@/db";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";

export type ExtendedItem = {
  item: Item;
  store: Store;
  schoolStore: SchoolStore;
  reservation: Reservation | null;
  quantity: number;
};

export type CartExtendedItem = ExtendedItem & {
  cartItem: CartItem;
};

export type ItemWithQuantity = {
  item: Item;
  quantity: number;
};

export type ItemStats = {
  item: Item;
  pickedup: number;
};

async function getSingle({
  id,
  schoolId,
}: {
  id: Item["id"];
  schoolId?: School["id"];
}): Promise<ExtendedItem | null> {
  const [found] = await db
    .select({
      item,
      store,
      reservation,
      schoolStore,
      quantity: sql<number>`0`,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .where(
      and(
        schoolId ? eq(schoolStore.schoolId, schoolId) : undefined,
        eq(item.id, id),
        eq(item.deleted, false),
      ),
    );

  return found;
}

async function updateSingle({
  data: updatedItem,
  allergenIds,
  ingredientIds,
}: {
  data: Pick<Item, "id"> & Partial<Item>;
  allergenIds?: Allergen["id"][];
  ingredientIds?: Ingredient["id"][];
}): Promise<void> {
  await db.transaction(async (tx) => {
    if (allergenIds) {
      await tx
        .delete(itemAllergen)
        .where(eq(itemAllergen.itemId, updatedItem.id));
      await tx
        .insert(itemAllergen)
        .values(
          allergenIds.map((id) => ({ itemId: updatedItem.id, allergenId: id })),
        );
    }

    if (ingredientIds) {
      await tx
        .delete(itemIngredient)
        .where(eq(itemIngredient.itemId, updatedItem.id));
      await tx.insert(itemIngredient).values(
        ingredientIds.map((id) => ({
          itemId: updatedItem.id,
          ingredientId: id,
        })),
      );
    }
  });

  await db.update(item).set(updatedItem).where(eq(item.id, updatedItem.id));
}

async function createSingle({
  data,
  allergenIds,
  ingredientIds,
}: {
  data: InferInsertModel<typeof item>;
  allergenIds: Allergen["id"][];
  ingredientIds: Ingredient["id"][];
}): Promise<void> {
  await db.transaction(async (tx) => {
    const [newItem] = await tx.insert(item).values([data]).returning();

    await tx
      .insert(itemAllergen)
      .values(
        allergenIds.map((id) => ({ itemId: newItem.id, allergenId: id })),
      );
    await tx
      .insert(itemIngredient)
      .values(
        ingredientIds.map((id) => ({ itemId: newItem.id, ingredientId: id })),
      );
  });
}

async function deleteSingle(itemId: Item["id"]) {
  await db.delete(orderItem).where(eq(orderItem.itemId, itemId));
  await db.delete(cartItem).where(eq(cartItem.itemId, itemId));
  await db.delete(itemAllergen).where(eq(itemAllergen.itemId, itemId));
  await db.delete(itemIngredient).where(eq(itemIngredient.itemId, itemId));
  await db.delete(item).where(eq(item.id, itemId));
}

async function getMany({
  storeId,
  orderStatus,
  orderId,
  schoolId,
  orderBy,
  isReservation,
  isDeleted,
}: {
  storeId?: Store["id"];
  orderStatus?: Order["status"][];
  orderId?: Order["id"];
  schoolId?: School["id"];
  orderBy?: "asc" | "desc";
  isReservation?: boolean;
  isDeleted?: boolean;
}): Promise<ExtendedItem[]> {
  const filters = [
    isDeleted ? eq(item.deleted, isDeleted) : undefined,
    isReservation !== undefined
      ? eq(orderItem.isReservation, isReservation)
      : undefined,
  ];

  let baseQuery = db
    .select({
      item,
      store,
      reservation,
      schoolStore,
      quantity: sql<number>`SUM(${orderItem.quantity}) as quantity`,
    })
    .from(item)
    .innerJoin(
      store,
      and(
        eq(item.storeId, store.id),
        storeId ? eq(item.storeId, storeId) : undefined,
      ),
    )
    .innerJoin(
      schoolStore,
      and(
        eq(item.storeId, schoolStore.storeId),
        schoolId ? eq(schoolStore.schoolId, schoolId) : undefined,
      ),
    )
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .$dynamic();

  if (orderStatus !== undefined || orderId !== undefined) {
    baseQuery = baseQuery.innerJoin(orderItem, eq(item.id, orderItem.itemId));
    baseQuery = baseQuery.innerJoin(
      order,
      and(
        eq(order.id, orderItem.orderId),
        orderId ? eq(order.id, orderId) : undefined,
        orderStatus
          ? or(...orderStatus.map((s) => eq(order.status, s)))
          : undefined,
      ),
    );
  } else {
    baseQuery = baseQuery.leftJoin(orderItem, eq(item.id, orderItem.itemId));
  }

  baseQuery = baseQuery.where(and(...filters)).groupBy(item.id);

  if (orderBy === "asc") {
    baseQuery = baseQuery.orderBy(sql<number>`quantity`);
  } else if (orderBy === "desc") {
    baseQuery = baseQuery.orderBy(desc(sql<number>`quantity`));
  }

  return await baseQuery.execute();
}

async function getSummary({
  storeId,
  schoolId,
  isReservation = false,
}: {
  storeId: Store["id"];
  schoolId?: School["id"];
  isReservation?: boolean;
}): Promise<ExtendedItem[]> {
  const oi = db
    .select()
    .from(orderItem)
    .innerJoin(
      order,
      and(eq(orderItem.orderId, order.id), eq(order.status, "ordered")),
    )
    .innerJoin(
      customer,
      and(
        eq(order.userId, customer.userId),
        schoolId ? eq(customer.schoolId, schoolId) : undefined,
      ),
    )
    .where(eq(orderItem.isReservation, isReservation))
    .as("oi");

  const items = await db
    .select({
      item,
      store,
      reservation,
      schoolStore,
      quantity: sql<number>`SUM(oi.quantity)`,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .leftJoin(oi, and(eq(item.id, oi.order_item.itemId)))
    .where(
      and(
        eq(item.storeId, storeId),
        or(isNotNull(oi.order_item.quantity), isNotNull(reservation.quantity)),
      ),
    )
    .groupBy(item.id);

  return items;
}

async function getManyWithQuantity({
  schoolId,
  storeId,
  orderStatus,
  orderId,
  pin,
  isReservation,
  orderPin,
  groupBy,
}: {
  schoolId?: School["id"];
  storeId?: Store["id"];
  orderStatus?: Order["status"][];
  orderId?: Order["id"];
  pin?: Order["pin"];
  isReservation?: boolean;
  orderPin?: Order["pin"];
  groupBy?: (SQLiteColumn | SQL)[];
}): Promise<ItemWithQuantity[]> {
  const filters = [
    schoolId ? eq(customer.schoolId, schoolId) : undefined,
    storeId ? eq(item.storeId, storeId) : undefined,
    orderStatus
      ? or(...orderStatus.map((s) => eq(order.status, s)))
      : undefined,
    orderId ? eq(order.id, orderId) : undefined,
    pin ? eq(order.pin, pin) : undefined,
    isReservation ? eq(orderItem.isReservation, isReservation) : undefined,
    orderPin ? eq(order.pin, orderPin) : undefined,
    eq(item.deleted, false),
  ];

  let baseQuery = db
    .select({
      item,
      quantity: groupBy
        ? sql<number>`SUM(${orderItem.quantity})`
        : orderItem.quantity,
    })
    .from(item)
    .innerJoin(orderItem, eq(item.id, orderItem.itemId))
    .innerJoin(order, eq(order.id, orderItem.orderId))
    .$dynamic();

  if (schoolId) {
    baseQuery = baseQuery.innerJoin(
      customer,
      eq(order.userId, customer.userId),
    );
  }

  if (groupBy) {
    baseQuery = baseQuery.groupBy(...groupBy);
  }

  return await baseQuery.where(and(...filters));
}

async function getManyCart({
  cartId,
}: {
  cartId: Cart["userId"];
}): Promise<CartExtendedItem[]> {
  return await db
    .select({
      item,
      store,
      cartItem,
      reservation,
      schoolStore,
      quantity: cartItem.quantity,
    })
    .from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(item.storeId, schoolStore.storeId))
    .innerJoin(cartItem, eq(item.id, cartItem.itemId))
    .leftJoin(reservation, eq(reservation.itemId, item.id))
    .where(eq(cartItem.cartId, cartId));
}

async function getStats({
  storeId,
}: {
  storeId: Item["storeId"];
}): Promise<ItemStats[]> {
  const items = await db
    .select({
      item,
      pickedup: sql<number>`SUM(${orderItem.quantity})`,
    })
    .from(item)
    .leftJoin(orderItem, eq(item.id, orderItem.itemId))
    .leftJoin(order, eq(orderItem.orderId, order.id))
    .where(and(eq(item.storeId, storeId), eq(item.deleted, false)))
    .groupBy(item.id);

  return items;
}

export const itemRepository = {
  getSingle,
  getMany,
  getSummary,
  getManyWithQuantity,
  getManyCart,
  createSingle,
  deleteSingle,
  updateSingle,
  getStats,
};

export default itemRepository;
