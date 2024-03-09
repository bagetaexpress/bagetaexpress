import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { item } from "./item";
import { ingredient } from "./ingredient";

export const itemIngredient = sqliteTable(
  "item_ingredient",
  {
    ingredientId: integer("ingredient_id", { mode: "number" })
      .notNull()
      .references(() => ingredient.id),
    itemId: integer("item_id", { mode: "number" })
      .notNull()
      .references(() => item.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.ingredientId, table.itemId] }),
  })
);
