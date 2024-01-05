"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { ingredient, itemIngredient } from "../schema";

export type Ingredient = {
  id: number;
  number: number;
  name: string;
  storeId: number;
};

export type ItemIngredient = {
  ingredientId: number;
  itemId: number;
};

async function getIngredientsByStoreId(storeId: number) {
  const ingredients = await db
    .select()
    .from(ingredient)
    .where(eq(ingredient.storeId, storeId));

  return ingredients;
}

async function getIngredientsByItemId(itemId: number) {
  const ingredients = await db
    .select()
    .from(ingredient)
    .innerJoin(itemIngredient, eq(ingredient.id, itemIngredient.ingredientId))
    .where(eq(itemIngredient.itemId, itemId));

  return ingredients;
}

async function getIngredientById(id: number) {
  const found = await db.select().from(ingredient).where(eq(ingredient.id, id));

  return found;
}

async function createIngredient(number: number, name: string, storeId: number) {
  const res = await db.insert(ingredient).values([{ number, name, storeId }]);

  return res.insertId;
}

async function updateIngredient(id: number, number: number, name: string) {
  await db
    .update(ingredient)
    .set({ number, name })
    .where(eq(ingredient.id, id));
}

async function deleteIngredient(id: number) {
  await db.delete(ingredient).where(eq(ingredient.id, id));
}

async function getItemIngredient(itemId: number, ingredientId: number) {
  const found = await db
    .select()
    .from(itemIngredient)
    .where(
      and(
        eq(itemIngredient.itemId, itemId),
        eq(itemIngredient.ingredientId, ingredientId)
      )
    );

  return found;
}

async function createItemIngredient(itemId: number, ingredientId: number) {
  const res = await db
    .insert(itemIngredient)
    .values([{ itemId, ingredientId }]);

  return res.insertId;
}

async function deleteItemIngredient(itemId: number, ingredientId: number) {
  await db
    .delete(itemIngredient)
    .where(
      and(
        eq(itemIngredient.itemId, itemId),
        eq(itemIngredient.ingredientId, ingredientId)
      )
    );
}

export {
  getIngredientsByStoreId,
  getIngredientsByItemId,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getItemIngredient,
  createItemIngredient,
  deleteItemIngredient,
};
