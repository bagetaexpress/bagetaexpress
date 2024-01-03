import { mysqlTable, int, serial, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { itemAllergen } from "./itemAllergen";

export const allergen = mysqlTable("allergen", {
  id: serial("id").primaryKey(),
  number: int("number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const allergenRelations = relations(allergen, ({ many }) => ({
  itemAllergens: many(itemAllergen),
}));
