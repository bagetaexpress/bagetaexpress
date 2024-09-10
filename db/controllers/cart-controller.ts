"use server";

import { db } from "@/db";
import { Cart, cart } from "../schema";
import { eq } from "drizzle-orm";

async function getCart(userId: Cart["userId"]): Promise<Cart | null> {
  const found = await db.select().from(cart).where(eq(cart.userId, userId));
  if (found.length === 0) {
    return null;
  }
  return found[0];
}

async function createCart(userId: Cart["userId"]): Promise<string> {
  await db.insert(cart).values({
    userId,
  });
  return userId;
}

async function deleteCart(userId: Cart["userId"]): Promise<void> {
  await db.delete(cart).where(eq(cart.userId, userId));
}

export { getCart, createCart, deleteCart };
