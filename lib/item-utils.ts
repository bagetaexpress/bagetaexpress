"use server";

import { db } from "@/db";
import {
  Allergen,
  Ingredient,
  item,
  Item,
  itemAllergen,
  itemIngredient,
} from "@/db/schema";
import { eq, InferInsertModel } from "drizzle-orm";

async function updateItem({
  itemId,
  data,
  allergenIds,
  ingredientIds,
}: {
  itemId: Item["id"];
  data: Partial<Item>;
  allergenIds: Allergen["id"][];
  ingredientIds: Ingredient["id"][];
}): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(itemAllergen).where(eq(itemAllergen.itemId, itemId));
    await tx.delete(itemIngredient).where(eq(itemIngredient.itemId, itemId));

    await tx
      .insert(itemAllergen)
      .values(allergenIds.map((id) => ({ itemId, allergenId: id })));
    await tx
      .insert(itemIngredient)
      .values(ingredientIds.map((id) => ({ itemId, ingredientId: id })));
  });

  await db.update(item).set(data).where(eq(item.id, itemId));
}

async function createItem({
  data,
  allergenIds,
  ingredientIds,
}: {
  data: InferInsertModel<typeof item>;
  allergenIds: Allergen["id"][];
  ingredientIds: Ingredient["id"][];
}): Promise<void> {
  await db.transaction(async (tx) => {
    const [newItem] = await tx.insert(item).values([data]).returning();

    await tx
      .insert(itemAllergen)
      .values(
        allergenIds.map((id) => ({ itemId: newItem.id, allergenId: id })),
      );
    await tx
      .insert(itemIngredient)
      .values(
        ingredientIds.map((id) => ({ itemId: newItem.id, ingredientId: id })),
      );
  });
}

export { updateItem, createItem };
