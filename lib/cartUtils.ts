"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getCart,
  createCart,
  deleteCart,
} from "@/db/controllers/cartController";
import {
  getCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteCartItems,
} from "@/db/controllers/cartItemController";
import { getItemsFromCart } from "@/db/controllers/itemController";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function addToCart(itemId: number, quantity: number = 1): Promise<void> {
  const cartId = await getCartId();

  const orderItem = await getCartItem(cartId, itemId);
  if (orderItem == null) {
    // create new cart item
    await createCartItem(cartId, itemId, quantity);
    return;
  }
  // update quantity
  await updateCartItem(cartId, itemId, orderItem.quantity + quantity);
}

async function getCartId(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (session == null) {
    throw new Error("User is not authenticated");
  }
  const userId = session.user.id;

  let cart = await getCart(userId);
  if (cart == null) {
    await createCart(userId);
    return userId;
  }
  return cart.userId;
}

async function getCartItems(cartId?: number) {
  if (!cartId) {
    cartId = await getCartId();
  }

  return await getItemsFromCart(cartId);
}

async function saveUpdateCartItem(
  cartId: number,
  itemId: number,
  quantity: number
) {
  const found = await getCartItem(cartId, itemId);
  if (found === null) {
    throw new Error("Item item not found");
  }
  if (found.quantity === quantity) {
    return;
  }
  if (quantity <= 0) {
    await deleteCartItem(cartId, itemId);
  } else {
    await updateCartItem(cartId, itemId, quantity);
  }
  revalidatePath("/auth/c/cart", "page");
}

async function deleteCartAndItems(cartId: number) {
  await deleteCartItems(cartId);
  await deleteCart(cartId);
}

export {
  addToCart,
  getCartItems,
  deleteCartAndItems,
  getCartId,
  saveUpdateCartItem,
};
