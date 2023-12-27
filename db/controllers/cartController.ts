"use server"

import { db } from "@/db";
import { cart } from "../schema";
import { and, eq } from "drizzle-orm";

type CartStatus = "cart" | "carted" | "pickedup" | "unpicked" | "cancelled";

export type Cart = {
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

async function getCartByUserId(userId: number): Promise<Cart | null> {
  const found = await db.select().from(cart)
    .where(eq(cart.userId, userId));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function createCart(userId: number): Promise<number> {
  const newCart = await db.insert(cart).values({
    userId,
  });
  return parseInt(newCart.insertId);
}

export {
  getCartByUserId,
  createCart,
}