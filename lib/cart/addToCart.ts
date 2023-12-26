"use server"

import { 
  createOrderItem,
  getOrderItemByOrderIdAndItemId,
  updateOrderItemQuantity
} from "@/db/controllers/orderItemController";
import getCartId from "./getCartId";

export default async function addToCart(
  itemId:number, quantity:number = 1
): Promise<void> {
  const cartId = await getCartId();

  const orderItem = await getOrderItemByOrderIdAndItemId(cartId, itemId);
  if (orderItem === null) {
    // create new order item
    await createOrderItem(cartId, itemId, quantity);
    return;
  }
  // update quantity
  await updateOrderItemQuantity(cartId, itemId, orderItem.quantity + quantity);
}