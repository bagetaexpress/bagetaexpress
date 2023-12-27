"use server"

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { orderItem } from "../schema";
import { revalidatePath } from "next/cache";

export type CartItem = {
  orderId: number;
  itemId: number;
  quantity: number;
};

async function createCartItem(orderId: number, itemId: number, quantity: number) {
  await db.insert(orderItem).values({
    orderId,
    itemId,
    quantity,
  });
}

async function getCartItemsByCartId(orderId: number) {
  return await db.select().from(orderItem).where(eq(orderItem.orderId, orderId));
}

async function getCartItemByCartIdAndItemId(orderId: number, itemId: number): Promise<CartItem | null> {
  const found = await db.select().from(orderItem)
    .where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function updateCartItemQuantity(orderId: number, itemId: number, quantity: number) {
  await db.update(orderItem).set({
    quantity,
  }).where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
}

async function saveUpdateCartItemQuantity(orderId: number, itemId: number, quantity: number) {
  const found = await getCartItemByCartIdAndItemId(orderId, itemId);
  if (found === null) {
    throw new Error("Cart item not found");
  }
  if (found.quantity === quantity) {
    return;
  }
  if (quantity <= 0) {
    await db.delete(orderItem).where(and(eq(orderItem.orderId, orderId), eq(orderItem.itemId, itemId)));
  }else {
    await updateCartItemQuantity(orderId, itemId, quantity);
  }
  revalidatePath("/auth/cart", "page");
}

export {
  createCartItem,
  getCartItemsByCartId,
  getCartItemByCartIdAndItemId,
  updateCartItemQuantity,
  saveUpdateCartItemQuantity,
}