"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { CartItem, cartItem } from "../schema";

async function createCartItem(
  cartId: CartItem["cartId"],
  itemId: CartItem["itemId"],
  quantity: CartItem["quantity"],
) {
  await db.insert(cartItem).values({
    cartId,
    itemId,
    quantity,
  });
}

async function getCartItemsByCartId(cartId: CartItem["cartId"]) {
  return await db.select().from(cartItem).where(eq(cartItem.cartId, cartId));
}

async function getCartItem(
  cartId: CartItem["cartId"],
  itemId: CartItem["itemId"],
): Promise<CartItem | null> {
  const found = await db
    .select()
    .from(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function updateCartItem(
  cartId: CartItem["cartId"],
  itemId: CartItem["itemId"],
  quantity: CartItem["quantity"],
) {
  await db
    .update(cartItem)
    .set({
      quantity,
    })
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
}

async function deleteCartItem(
  cartId: CartItem["cartId"],
  itemId: CartItem["itemId"],
) {
  await db
    .delete(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.itemId, itemId)));
}

async function deleteCartItems(cartId: CartItem["cartId"]) {
  await db.delete(cartItem).where(eq(cartItem.cartId, cartId));
}

export {
  deleteCartItem,
  deleteCartItems,
  createCartItem,
  getCartItemsByCartId,
  getCartItem,
  updateCartItem,
};
