"use server";

import { db } from "..";
import { Store, store } from "../schema";
import { eq } from "drizzle-orm";

async function getStore(storeId: Store["id"]): Promise<Store> {
  const found = await db.select().from(store).where(eq(store.id, storeId));
  if (found.length === 0) {
    throw new Error(`No store found with id ${storeId}`);
  }
  return found[0];
}

async function updateStore(data: { id: Store["id"] } & Partial<Store>) {
  await db.update(store).set(data).where(eq(store.id, data.id));
}

export { getStore, updateStore };
