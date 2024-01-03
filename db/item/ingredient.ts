import { mysqlTable, int, serial, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { itemIngredient } from "./itemIngredient";
import { store } from "../store/store";

export const ingredient = mysqlTable("ingredient", {
  id: serial("id").primaryKey(),
  number: int("number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  storeId: int("store_id").notNull(),
});

export const ingredientRelations = relations(ingredient, ({ many, one }) => ({
  itemIngredients: many(itemIngredient),
  store: one(store, {
    fields: [ingredient.storeId],
    references: [store.id],
  }),
}));
