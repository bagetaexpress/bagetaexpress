"use server";

import {
  getCart,
  createCart,
  deleteCart,
} from "@/db/controllers/cart-controller";
import {
  getCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteCartItems,
} from "@/db/controllers/cartItem-controller";
import {
  getItemBySchool,
  getItemsFromCart,
} from "@/db/controllers/item-controller";
import { revalidatePath } from "next/cache";
import { getUser } from "./user-utils";
import { getDate } from "./utils";

async function addToCart(itemId: number): Promise<void> {
  const user = await getUser();
  if (user == null || user.id == null || user.schoolId == null) {
    throw new Error("User is not authenticated");
  }

  const { schoolStore, reservation } = await getItemBySchool({
    itemId,
    schoolId: user.schoolId,
  });

  if (
    getDate(schoolStore.orderClose) < getDate(new Date().toLocaleString()) &&
    !reservation
  ) {
    throw new Error("Objednávky boli uzavreté");
  }
  if (
    reservation &&
    getDate(schoolStore.reservationClose) < getDate(new Date().toLocaleString())
  ) {
    throw new Error("Rezervácie boli uzavreté");
  }

  if (
    reservation &&
    getDate(schoolStore.orderClose) >= getDate(new Date().toLocaleString()) &&
    reservation.remaining <= 0
  ) {
    throw new Error("Nemáte dostatok kreditov na rezerváciu");
  }

  const cartId = await getCartId();

  const orderItem = await getCartItem(cartId, itemId);
  if (orderItem == null) {
    await createCartItem(cartId, itemId, 1);
    return;
  }

  if (orderItem.quantity >= 5) {
    throw new Error("V košíku už máte maximálny počet kusov");
  }
  await updateCartItem(cartId, itemId, orderItem.quantity + 1);
}

async function getCartId(): Promise<string> {
  const user = await getUser();
  if (user == null) {
    throw new Error("User is not authenticated");
  }

  let cart = await getCart(user.id);
  if (cart == null) {
    await createCart(user.id);
    return user.id;
  }
  return cart.userId;
}

async function getCartItems(cartId?: string) {
  if (!cartId) {
    cartId = await getCartId();
  }

  return await getItemsFromCart(cartId);
}

async function saveUpdateCartItem(
  cartId: string,
  itemId: number,
  quantity: number,
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

async function deleteCartAndItems(cartId: string) {
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
