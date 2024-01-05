"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { allergen, itemAllergen } from "../schema";

export type Allergen = {
  id: number;
  number: number;
  name: string;
  storeId: number;
};

export type ItemAllergen = {
  allergenId: number;
  itemId: number;
};

async function getAllergensByStoreId(storeId: number) {
  const allergens = await db
    .select()
    .from(allergen)
    .where(eq(allergen.storeId, storeId));

  return allergens;
}

async function getAllergensByItemId(itemId: number) {
  const allergens = await db
    .select()
    .from(allergen)
    .innerJoin(itemAllergen, eq(allergen.id, itemAllergen.allergenId))
    .where(eq(itemAllergen.itemId, itemId));

  return allergens;
}

async function getAllergenById(id: number) {
  const found = await db.select().from(allergen).where(eq(allergen.id, id));

  return found;
}

async function createAllergen(number: number, name: string, storeId: number) {
  const res = await db.insert(allergen).values([{ number, name, storeId }]);

  return res.insertId;
}

async function updateAllergen(id: number, number: number, name: string) {
  await db.update(allergen).set({ number, name }).where(eq(allergen.id, id));
}

async function deleteAllergen(id: number) {
  await db.delete(allergen).where(eq(allergen.id, id));
}

async function getItemAllergen(itemId: number, allergenId: number) {
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

async function createItemAllergen(itemId: number, allergenId: number) {
  const res = await db.insert(itemAllergen).values([{ itemId, allergenId }]);

  return res.insertId;
}

async function deleteItemAllergen(itemId: number, allergenId: number) {
  await db
    .delete(itemAllergen)
    .where(
      and(
        eq(itemAllergen.itemId, itemId),
        eq(itemAllergen.allergenId, allergenId)
      )
    );
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
};
