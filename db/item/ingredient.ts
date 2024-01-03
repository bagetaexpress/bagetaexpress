import { mysqlTable, int, serial, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { itemIngredient } from "./itemIngredient";

export const ingredient = mysqlTable("ingredient", {
  id: serial("id").primaryKey(),
  number: int("number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const ingredientRelations = relations(ingredient, ({ many }) => ({
  itemIngredients: many(itemIngredient),
}));
