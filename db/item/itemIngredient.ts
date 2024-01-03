import { mysqlTable, int, primaryKey } from "drizzle-orm/mysql-core";
import { item } from "./item";
import { ingredient } from "./ingredient";
import { relations } from "drizzle-orm";

export const itemIngredient = mysqlTable(
  "item_ingredient",
  {
    ingredientId: int("ingredient_id").notNull(),
    itemId: int("item_id").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.ingredientId, table.itemId] }),
  })
);

export const itemIngredientRelations = relations(itemIngredient, ({ one }) => ({
  ingredient: one(ingredient, {
    fields: [itemIngredient.ingredientId],
    references: [ingredient.id],
  }),
  item: one(item, {
    fields: [itemIngredient.itemId],
    references: [item.id],
  }),
}));
