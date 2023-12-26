"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCartByUserId, createOrder } from "@/db/controllers/orderController";
import { getServerSession } from "next-auth";

export default async function getCartId(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (session === null) {
    throw new Error("User is not authenticated");
  }
  const userId = session.user.id;

  let cartId: number;
  let cart = await getCartByUserId(userId);
  if (cart === null) {
    cartId = await createOrder(userId, "cart");
  }else {
    cartId = cart.id;
  }

  return cartId;
}