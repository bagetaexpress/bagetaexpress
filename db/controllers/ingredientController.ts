"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { Ingredient, Item, ingredient, itemIngredient } from "../schema";

async function getIngredientsByStoreId(storeId: Ingredient["storeId"]) {
  const ingredients = await db
    .select()
    .from(ingredient)
    .where(eq(ingredient.storeId, storeId));

  return ingredients;
}

async function getIngredientsByItemId(itemId: Item["id"]) {
  const ingredients = await db
    .select()
    .from(ingredient)
    .innerJoin(itemIngredient, eq(ingredient.id, itemIngredient.ingredientId))
    .where(eq(itemIngredient.itemId, itemId));

  return ingredients;
}

async function getIngredientById(itemId: Ingredient["id"]) {
  const found = await db
    .select()
    .from(ingredient)
    .where(eq(ingredient.id, itemId));

  return found;
}

async function createIngredient(
  number: Ingredient["number"],
  name: Ingredient["name"],
  storeId: Ingredient["storeId"]
) {
  const res = await db.insert(ingredient).values([{ number, name, storeId }]);

  return res;
}

async function updateIngredient(
  ingredientId: Ingredient["id"],
  number: Ingredient["number"],
  name: Ingredient["name"]
) {
  await db
    .update(ingredient)
    .set({ number, name })
    .where(eq(ingredient.id, ingredientId));
}

async function deleteIngredient(ingredientId: Ingredient["id"]) {
  await db.delete(ingredient).where(eq(ingredient.id, ingredientId));
}

async function getItemIngredient(
  itemId: Item["id"],
  ingredientId: Ingredient["id"]
) {
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

async function createItemIngredient(
  itemId: Item["id"],
  ingredientId: Ingredient["id"]
) {
  const res = await db
    .insert(itemIngredient)
    .values([{ itemId, ingredientId }]);

  return res;
}

async function deleteItemIngredient(
  itemId: Item["id"],
  ingredientId: Ingredient["id"]
) {
  await db
    .delete(itemIngredient)
    .where(
      and(
        eq(itemIngredient.itemId, itemId),
        eq(itemIngredient.ingredientId, ingredientId)
      )
    );
}

async function deleteItemIngredients(itemId: Item["id"]) {
  await db.delete(itemIngredient).where(eq(itemIngredient.itemId, itemId));
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
  deleteItemIngredients,
  deleteItemIngredient,
};
