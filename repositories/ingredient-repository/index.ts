import "server-only";
import { and, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db/index";
import { Ingredient, Item, ingredient, itemIngredient } from "@/db/schema";

async function getMany({
  storeId,
  itemId,
}: {
  storeId?: Ingredient["storeId"];
  itemId?: Item["id"];
}): Promise<Ingredient[]> {
  if (storeId) {
    return await db
      .select()
      .from(ingredient)
      .where(eq(ingredient.storeId, storeId));
  }
  if (itemId) {
    return await db
      .select({ ...getTableColumns(ingredient) })
      .from(ingredient)
      .innerJoin(itemIngredient, eq(ingredient.id, itemIngredient.ingredientId))
      .where(eq(itemIngredient.itemId, itemId));
  }

  return [];
}

async function getSingle({
  itemId,
}: {
  itemId: Ingredient["id"];
}): Promise<Ingredient | null> {
  const [found] = await db
    .select()
    .from(ingredient)
    .where(eq(ingredient.id, itemId));
  return found ?? null;
}

async function createSingle(data: {
  number: Ingredient["number"];
  name: Ingredient["name"];
  storeId: Ingredient["storeId"];
}): Promise<void> {
  await db.insert(ingredient).values([data]);
}

async function updateSingle(data: {
  ingredientId: Ingredient["id"];
  number: Ingredient["number"];
  name: Ingredient["name"];
}): Promise<void> {
  await db
    .update(ingredient)
    .set({ number: data.number, name: data.name })
    .where(eq(ingredient.id, data.ingredientId));
}
async function deleteSingle({
  ingredientId,
}: {
  ingredientId: Ingredient["id"];
}): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .delete(itemIngredient)
      .where(eq(itemIngredient.ingredientId, ingredientId));
    await tx.delete(ingredient).where(eq(ingredient.id, ingredientId));
  });
}

async function addToItemSingle({
  itemId,
  ingredientId,
}: {
  itemId: Item["id"];
  ingredientId: Ingredient["id"];
}): Promise<void> {
  await db.insert(itemIngredient).values([{ itemId, ingredientId }]);
}

async function removeFromItemSingle({
  itemId,
  ingredientId,
}: {
  itemId: Item["id"];
  ingredientId: Ingredient["id"];
}) {
  await db
    .delete(itemIngredient)
    .where(
      and(
        eq(itemIngredient.itemId, itemId),
        eq(itemIngredient.ingredientId, ingredientId),
      ),
    );
}

async function removeFromItemMany({ itemId }: { itemId: Item["id"] }) {
  await db.delete(itemIngredient).where(eq(itemIngredient.itemId, itemId));
}

export const ingredientRepository = {
  getMany,
  getSingle,
  createSingle,
  updateSingle,
  deleteSingle,
  addToItemSingle,
  removeFromItemSingle,
  removeFromItemMany,
};

export default ingredientRepository;
