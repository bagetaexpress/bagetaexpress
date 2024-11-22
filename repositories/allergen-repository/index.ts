import "server-only";
import { and, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { Allergen, Item, allergen, itemAllergen } from "@/db/schema";

async function getMany({
  storeId,
  itemId,
}: {
  storeId?: Allergen["storeId"];
  itemId?: Item["id"];
}): Promise<Allergen[]> {
  if (storeId) {
    return await db
      .select()
      .from(allergen)
      .where(eq(allergen.storeId, storeId));
  }
  if (itemId) {
    return await db
      .select({ ...getTableColumns(allergen) })
      .from(allergen)
      .innerJoin(itemAllergen, eq(allergen.id, itemAllergen.allergenId))
      .where(eq(itemAllergen.itemId, itemId));
  }

  return [];
}

async function getSingle({
  itemId,
}: {
  itemId: Allergen["id"];
}): Promise<Allergen | null> {
  const [found] = await db
    .select()
    .from(allergen)
    .where(eq(allergen.id, itemId));
  return found ?? null;
}

async function createSingle(data: {
  number: Allergen["number"];
  name: Allergen["name"];
  storeId: Allergen["storeId"];
}): Promise<void> {
  await db.insert(allergen).values([data]);
}

async function updateSingle(data: {
  allergenId: Allergen["id"];
  number: Allergen["number"];
  name: Allergen["name"];
}): Promise<void> {
  await db
    .update(allergen)
    .set({ number: data.number, name: data.name })
    .where(eq(allergen.id, data.allergenId));
}
async function deleteSingle({
  allergenId,
}: {
  allergenId: Allergen["id"];
}): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .delete(itemAllergen)
      .where(eq(itemAllergen.allergenId, allergenId));
    await tx.delete(allergen).where(eq(allergen.id, allergenId));
  });
}

async function addToItemSingle({
  itemId,
  allergenId,
}: {
  itemId: Item["id"];
  allergenId: Allergen["id"];
}): Promise<void> {
  await db.insert(itemAllergen).values([{ itemId, allergenId }]);
}

async function removeFromItemSingle({
  itemId,
  allergenId,
}: {
  itemId: Item["id"];
  allergenId: Allergen["id"];
}) {
  await db
    .delete(itemAllergen)
    .where(
      and(
        eq(itemAllergen.itemId, itemId),
        eq(itemAllergen.allergenId, allergenId),
      ),
    );
}

async function removeFromItemMany({ itemId }: { itemId: Item["id"] }) {
  await db.delete(itemAllergen).where(eq(itemAllergen.itemId, itemId));
}

export const allergenRepository = {
  getMany,
  getSingle,
  createSingle,
  updateSingle,
  deleteSingle,
  addToItemSingle,
  removeFromItemSingle,
  removeFromItemMany,
};

export default allergenRepository;
