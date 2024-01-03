import { mysqlTable, int, serial, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { itemAllergen } from "./itemAllergen";
import { store } from "../schema";

export const allergen = mysqlTable("allergen", {
  id: serial("id").primaryKey(),
  number: int("number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  storeId: int("store_id").notNull(),
});

export const allergenRelations = relations(allergen, ({ many, one }) => ({
  itemAllergens: many(itemAllergen),
  store: one(store, {
    fields: [allergen.storeId],
    references: [store.id],
  }),
}));
