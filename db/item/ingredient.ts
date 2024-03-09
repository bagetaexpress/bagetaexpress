import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { store } from "../store/store";

export const ingredient = sqliteTable("ingredient", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  number: integer("number", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  storeId: integer("store_id", { mode: "number" })
    .notNull()
    .references(() => store.id),
});
