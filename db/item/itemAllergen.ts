import { mysqlTable, int, primaryKey } from "drizzle-orm/mysql-core";
import { item } from "./item";
import { allergen } from "./allergen";
import { relations } from "drizzle-orm";

export const itemAllergen = mysqlTable(
  "item_allergen",
  {
    allergenId: int("allergen_id").notNull(),
    itemId: int("item_id").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.allergenId, table.itemId] }),
  })
);

export const itemAllergenRelations = relations(itemAllergen, ({ one }) => ({
  allergen: one(allergen, {
    fields: [itemAllergen.allergenId],
    references: [allergen.id],
  }),
  item: one(item, {
    fields: [itemAllergen.itemId],
    references: [item.id],
  }),
}));
