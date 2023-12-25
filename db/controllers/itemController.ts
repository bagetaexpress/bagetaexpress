import { eq } from "drizzle-orm"
import { item, schoolStore, store } from "../schema"
import { db } from "@/db"


async function getItemsBySchool(schoolId: number) {
  const items = await db.select({item}).from(item)
    .innerJoin(store, eq(item.storeId, store.id))
    .innerJoin(schoolStore, eq(store.id, schoolStore.storeId))
    .where(eq(schoolStore.schoolId, schoolId))
  return items.map(item => item.item)
}

export {
  getItemsBySchool
}