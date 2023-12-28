"use server"

import { 
  createCartItem,
  getCartItemByCartIdAndItemId,
  updateCartItemQuantity
} from "@/db/controllers/cartItemController";
import getCartId from "./getCartId";

export default async function addToCart(
  itemId:number, quantity:number = 1
): Promise<void> {
  const cartId = await getCartId();

  const orderItem = await getCartItemByCartIdAndItemId(cartId, itemId);
  if (orderItem === null) {
    // create new order item
    await createCartItem(cartId, itemId, quantity);
    return;
  }
  // update quantity
  await updateCartItemQuantity(cartId, itemId, orderItem.quantity + quantity);
}