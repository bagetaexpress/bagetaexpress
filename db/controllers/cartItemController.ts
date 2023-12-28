"use server"

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { cartItem } from "../schema";

export type CartItem = {
  cartId: number;
  itemId: number;
  quantity: number;
};

async function createCartItem(cartId: number, itemId: number, quantity: number) {
  await db.insert(cartItem).values({
    cartId,
    itemId,
    quantity,
  });
}

async function getCartItemsByCartId(cartId: number) {
  return await db.select().from(cartItem).where(eq(cartItem.cartId, cartId));
}

async function getCartItem(cartId: number, itemId: number): Promise<CartItem | null> {
  const found = await db.select().from(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function updateCartItem(cartId: number, itemId: number, quantity: number) {
  await db.update(cartItem).set({
    quantity,
  }).where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
}

async function deleteCartItem(cartId: number, itemId: number) {
  await db.delete(cartItem)
  .where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
}

async function deleteCartItems(cartId: number) {
  await db.delete(cartItem).where(eq(cartItem.cartId, cartId));
}

export {
  deleteCartItem,
  deleteCartItems,
  createCartItem,
  getCartItemsByCartId,
  getCartItem,
  updateCartItem,
}