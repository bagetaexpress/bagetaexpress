"use server";

import * as cartCtrl from "@/db/controllers/cartController";
import * as orderItemCtrl from "@/db/controllers/orderItemController";
import * as orderCtrl from "@/db/controllers/orderController";
import * as customerCtrl from "@/db/controllers/customerController";
import { deleteCartAndItems, getCartItems } from "./cartUtils";

function generatePin(length: number): string {
  const chars = "0123456789";
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)];
  }
  return pin;
}

async function createUniqueOrder(
  schoolId: number,
  userId: string,
<<<<<<< Updated upstream
  discount: number
=======
>>>>>>> Stashed changes
): Promise<number> {
  let pin: string;
  let foundOrdered, foundUnpicked;

  do {
    pin = generatePin(4);
    foundOrdered = await orderCtrl.getOrderByPin(pin, schoolId, "ordered");
    foundUnpicked = await orderCtrl.getOrderByPin(pin, schoolId, "unpicked");
  } while (foundOrdered != null && foundUnpicked != null);

  await orderCtrl.createOrder(userId, pin, "ordered", discount);
  const order = await orderCtrl.getOrdersByUserId(userId, "ordered");
  if (order.length === 0) {
    throw new Error("Order not found");
  }

  return order[0].id;
}

async function createOrderFromCart(
  userId: string,
  discount: number
): Promise<number> {
  const customer = await customerCtrl.getCustomer(userId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  const existingOrder = await orderCtrl.getOrdersByUserId(userId, "ordered");
  if (existingOrder.length > 0) {
    throw new Error("Order already exists");
  }

  const cart = await cartCtrl.getCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItems = await getCartItems(cart.userId);
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderId = await createUniqueOrder(customer.schoolId, userId, discount);

  try {
    await orderItemCtrl.createOrderItems(
      orderId,
      cartItems.map((cartItem) => ({
        itemId: cartItem.item.id,
        quantity: cartItem.quantity,
      })),
    );
  } catch (e) {
    console.error(e);
    await deleteOrderAndItems(orderId);
    throw new Error("Failed to create order items");
  }

  await deleteCartAndItems(cart.userId);

  return orderId;
}

async function deleteOrderAndItems(orderId: number): Promise<void> {
  await orderItemCtrl.deleteOrderItems(orderId);
  await orderCtrl.deleteOrder(orderId);
}

export { createOrderFromCart, deleteOrderAndItems };
