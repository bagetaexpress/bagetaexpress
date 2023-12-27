"use server"

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { cartItem } from "../schema";
import { revalidatePath } from "next/cache";

export type ItemItem = {
  cartId: number;
  itemId: number;
  quantity: number;
};

async function createItemItem(cartId: number, itemId: number, quantity: number) {
  await db.insert(cartItem).values({
    cartId,
    itemId,
    quantity,
  });
}

async function getItemItemsByItemId(cartId: number) {
  return await db.select().from(cartItem).where(eq(cartItem.cartId, cartId));
}

async function getItemItemByItemIdAndItemId(cartId: number, itemId: number): Promise<ItemItem | null> {
  const found = await db.select().from(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function updateItemItemQuantity(cartId: number, itemId: number, quantity: number) {
  await db.update(cartItem).set({
    quantity,
  }).where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
}

async function saveUpdateItemItemQuantity(cartId: number, itemId: number, quantity: number) {
  const found = await getItemItemByItemIdAndItemId(cartId, itemId);
  if (found === null) {
    throw new Error("Item item not found");
  }
  if (found.quantity === quantity) {
    return;
  }
  if (quantity <= 0) {
    await db.delete(cartItem).where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
  }else {
    await updateItemItemQuantity(cartId, itemId, quantity);
  }
  revalidatePath("/auth/cart", "page");
}

export {
  createItemItem,
  getItemItemsByItemId,
  getItemItemByItemIdAndItemId,
  updateItemItemQuantity,
  saveUpdateItemItemQuantity,
}