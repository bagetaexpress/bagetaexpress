"use server"

import { getCart } from "@/db/controllers/cartController";
import getCartItems from "./cart/getCartItems";
import { createOrderItems, deleteOrderItems } from "@/db/controllers/orderItemController";

async function createOrder(userId: number): Promise<number> {
  const cart = await getCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItems = await getCartItems(cart.userId);
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderId = await createOrder(userId);

  try {
    await createOrderItems(
      orderId, 
      cartItems.map(cartItem => 
        ({ itemId: cartItem.item.id, quantity: cartItem.quantity })
      ));
  } catch (e) {
    await deleteOrderItems(orderId);
    await deleteOrder(orderId);
    throw new Error("Failed to create order items");
  }

  return orderId;
}

async function deleteOrder(orderId: number): Promise<void> {
  await deleteOrderItems(orderId);
  await deleteOrder(orderId);
}

export {
  createOrder,
}