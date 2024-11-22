"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "./user-utils";
import { getDate } from "./utils";
import cartRepository from "@/repositories/cart-repository";
import { Cart } from "@/db/schema";
import itemRepository from "@/repositories/item-repository";

async function addToCart(itemId: number): Promise<void> {
  const user = await getUser();
  if (user == null || user.id == null || user.schoolId == null) {
    throw new Error("User is not authenticated");
  }

  const res = await itemRepository.getSingle({
    id: itemId,
    schoolId: user.schoolId,
  });
  if (res == null) {
    throw new Error("Item not found");
  }
  const { schoolStore, reservation } = res;

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
    throw new Error("Nie je dostatok kusov na rezerváciu");
  }

  await cartRepository.addItemToCart({
    userId: user.id,
    itemId,
  });
}

async function getCart(): Promise<Cart> {
  const user = await getUser();
  if (user == null) {
    throw new Error("User is not authenticated");
  }

  let foundCart = await cartRepository.getSingle({ userId: user.id });
  if (!foundCart) {
    foundCart = await cartRepository.createSingle({ userId: user.id });
  }

  return foundCart;
}

async function getCartItems(cartId?: string) {
  if (!cartId) {
    cartId = (await getCart()).userId;
  }

  return await itemRepository.getManyCart({ cartId });
}

async function saveUpdateCartItem(
  cartId: string,
  itemId: number,
  quantity: number,
) {
  await cartRepository.updateCartItemSingle({
    userId: cartId,
    itemId,
    quantity,
  });
  revalidatePath("/auth/c/cart", "page");
}

async function deleteCartAndItems(cartId: string) {
  await cartRepository.deleteSingle({ userId: cartId });
}

export {
  addToCart,
  getCartItems,
  deleteCartAndItems,
  getCart,
  saveUpdateCartItem,
};
