import "server-only";
import { db } from "@/db";
import { Store, store } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getSingle({
  storeId,
}: {
  storeId: Store["id"];
}): Promise<Store> {
  const found = await db.select().from(store).where(eq(store.id, storeId));
  if (found.length === 0) {
    throw new Error(`No store found with id ${storeId}`);
  }
  return found[0];
}

async function updateSingle(data: { id: Store["id"] } & Partial<Store>) {
  await db.update(store).set(data).where(eq(store.id, data.id));
}

export const storeRepository = {
  getSingle,
  updateSingle,
};

export default storeRepository;
