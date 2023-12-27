"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCartByUserId, createCart } from "@/db/controllers/cartController";
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
    cartId = await createCart(userId);
  }else {
    cartId = cart.userId;
  }

  return cartId;
}