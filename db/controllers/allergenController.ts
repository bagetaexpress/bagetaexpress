"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { Allergen, Item, Store, allergen, itemAllergen } from "../schema";

async function getAllergensByStoreId(storeId: Store["id"]) {
  const allergens = await db
    .select()
    .from(allergen)
    .where(eq(allergen.storeId, storeId));

  return allergens;
}

async function getAllergensByItemId(itemId: Item["id"]) {
  const allergens = await db
    .select()
    .from(allergen)
    .innerJoin(itemAllergen, eq(allergen.id, itemAllergen.allergenId))
    .where(eq(itemAllergen.itemId, itemId));

  return allergens;
}

async function getAllergenById(allergenId: Allergen["id"]) {
  const found = await db
    .select()
    .from(allergen)
    .where(eq(allergen.id, allergenId));

  return found;
}

async function createAllergen(
  number: Allergen["number"],
  name: Allergen["name"],
  storeId: Store["id"]
) {
  const res = await db.insert(allergen).values([{ number, name, storeId }]);

  return res.insertId;
}

async function updateAllergen(
  allergenId: Allergen["id"],
  number: number,
  name: string
) {
  await db
    .update(allergen)
    .set({ number, name })
    .where(eq(allergen.id, allergenId));
}

async function deleteAllergen(allergenId: Allergen["id"]) {
  await db.delete(allergen).where(eq(allergen.id, allergenId));
}

async function getItemAllergen(itemId: Item["id"], allergenId: Allergen["id"]) {
  const found = await db
    .select()
    .from(itemAllergen)
    .where(
      and(
        eq(itemAllergen.itemId, itemId),
        eq(itemAllergen.allergenId, allergenId)
      )
    );

  return found;
}

async function createItemAllergen(itemId: Item["id"], allergenId: number) {
  const res = await db.insert(itemAllergen).values([{ itemId, allergenId }]);

  return res;
}

async function deleteItemAllergen(
  itemId: Item["id"],
  allergenId: Allergen["id"]
) {
  await db
    .delete(itemAllergen)
    .where(
      and(
        eq(itemAllergen.itemId, itemId),
        eq(itemAllergen.allergenId, allergenId)
      )
    );
}

async function deleteAllItemAllergens(itemId: Item["id"]) {
  await db.delete(itemAllergen).where(eq(itemAllergen.itemId, itemId));
}

export {
  getAllergensByStoreId,
  getAllergensByItemId,
  getAllergenById,
  createAllergen,
  updateAllergen,
  deleteAllergen,
  getItemAllergen,
  createItemAllergen,
  deleteItemAllergen,
  deleteAllItemAllergens,
};
