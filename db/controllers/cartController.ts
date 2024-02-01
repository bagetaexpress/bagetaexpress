"use server";

import { db } from "@/db";
import { cart } from "../schema";
import { eq } from "drizzle-orm";

export type Cart = {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

async function getCart(userId: string): Promise<Cart | null> {
  const found = await db.select().from(cart).where(eq(cart.userId, userId));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function createCart(userId: string): Promise<string> {
  await db.insert(cart).values({
    userId,
  });
  return userId;
}

async function deleteCart(userId: string): Promise<void> {
  await db.delete(cart).where(eq(cart.userId, userId));
}

export { getCart, createCart, deleteCart };
