"use server"

import { getCart } from "@/db/controllers/cartController";
import { createOrderItems, deleteOrderItems } from "@/db/controllers/orderItemController";
import { getCartItems } from "./cartUtils";
import { createOrder, getOrderByPin } from "@/db/controllers/orderController";
import { getCustomer } from "@/db/controllers/customerController";

function generatePin(length: number): string {
  const chars = "0123456789";
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)];
  }
  return pin;
}

async function createUniqueOrder(): Promise<number> {
  let pin: string;
  let orderId: number;
  let found: any;

  do {
    pin = generatePin(4);
    orderId = await createOrder(1, pin);
    found = await getOrderByPin(pin, 1);
  } while (found != null)

  return orderId;
}

async function createOrderFromCart(userId: number): Promise<number> {
  const customer = await getCustomer(userId);  
  if (!customer) {
    throw new Error("Customer not found");
  }

  const cart = await getCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItems = await getCartItems(cart.userId);
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderId = await createUniqueOrder();

  try {
    await createOrderItems(
      orderId, 
      cartItems.map(cartItem => 
        ({ itemId: cartItem.item.id, quantity: cartItem.quantity })
      ));
  } catch (e) {
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
  createOrderFromCart,
  deleteOrder
}