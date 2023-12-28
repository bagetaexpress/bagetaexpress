"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCart, createCart } from "@/db/controllers/cartController";
import { getCartItem, createCartItem, updateCartItem, getCartItemsByCartId, deleteCartItem } from "@/db/controllers/cartItemController";
import { getItemById, getItemsFromCart } from "@/db/controllers/itemController";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function addToCart(
  itemId:number, quantity:number = 1
): Promise<void> {
  const cartId = await getCartId();

  const orderItem = await getCartItem(cartId, itemId);
  if (orderItem === null) {
    // create new order item
    await createCartItem(cartId, itemId, quantity);
    return;
  }
  // update quantity
  await updateCartItem(cartId, itemId, orderItem.quantity + quantity);
}

async function getCartId(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (session === null) {
    throw new Error("User is not authenticated");
  }
  const userId = session.user.id;

  let cartId: number;
  let cart = await getCart(userId);
  if (cart === null) {
    cartId = await createCart(userId);
  }else {
    cartId = cart.userId;
  }

  return cartId;
}

async function getCartItems(cartId?: number) {
  if (!cartId) {
    cartId = await getCartId();
  }

  return await getItemsFromCart(cartId);
}

async function saveUpdateCartItem(cartId: number, itemId: number, quantity: number) {
  const found = await getCartItem(cartId, itemId);
  if (found === null) {
    throw new Error("Item item not found");
  }
  if (found.quantity === quantity) {
    return;
  }
  if (quantity <= 0) {
    await deleteCartItem(cartId, itemId);
  }else {
    await updateCartItem(cartId, itemId, quantity);
  }
  revalidatePath("/auth/cart", "page");
}

export {
  addToCart,
  getCartItems,
  getCartId,
  saveUpdateCartItem
}