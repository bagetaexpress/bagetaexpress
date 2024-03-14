import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { item } from "./item";
import { allergen } from "./allergen";

export const itemAllergen = sqliteTable(
  "item_allergen",
  {
    allergenId: integer("allergen_id", { mode: "number" })
      .notNull()
      .references(() => allergen.id),
    itemId: integer("item_id", { mode: "number" })
      .notNull()
      .references(() => item.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.allergenId, table.itemId] }),
  }),
);
