import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { store } from "../schema";

export const allergen = sqliteTable("allergen", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  number: integer("number", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  storeId: integer("store_id", { mode: "number" })
    .notNull()
    .references(() => store.id),
});
