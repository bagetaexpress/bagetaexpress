import { getOrderItemsByOrderId } from "@/db/controllers/orderItemController";
import getCartId from "./getCartId";
import { getItemById } from "@/db/controllers/itemController";

export default async function getCartItems() {
  const cartId = await getCartId();

  const cartItemsIds = await getOrderItemsByOrderId(cartId);

  let cartItems = [];
  for (const cartItemId of cartItemsIds) {
    const item = await getItemById(cartItemId.itemId);
    if (item !== null) {
      cartItems.push({item, quantity: cartItemId.quantity});
    }
  }

  return cartItems;
}