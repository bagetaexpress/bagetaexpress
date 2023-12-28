"use server"

import { db } from "@/db";
import { cart } from "../schema";
import { and, eq } from "drizzle-orm";


export type Cart = {
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

async function getCart(userId: number): Promise<Cart | null> {
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

async function deleteCart(userId: number): Promise<void> {
  await db.delete(cart)
    .where(eq(cart.userId, userId));
}

export {
  getCart,
  createCart,
  deleteCart,
}
