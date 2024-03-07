import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { store } from "../store/store";

export const item = sqliteTable("item", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  weight: int("weight", { mode: "number" }).notNull().default(0),
  imageUrl: text("image_url").notNull().default(""),
  price: real("price").notNull(),
  storeId: int("store_id", { mode: "number" })
    .notNull()
    .references(() => store.id),
  deleted: int("deleted", { mode: "boolean" }).notNull().default(false),
});
