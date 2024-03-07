import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
import { store } from "../schema";

export const allergen = sqliteTable("allergen", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  number: int("number", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  storeId: int("store_id", { mode: "number" })
    .notNull()
    .references(() => store.id),
});
