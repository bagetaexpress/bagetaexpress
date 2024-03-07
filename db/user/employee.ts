import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { store } from "../store/store";

export const employee = sqliteTable("employee", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => user.id),
  storeId: int("store_id", { mode: "number" })
    .notNull()
    .references(() => store.id),
  isOwner: int("is_owner", { mode: "boolean" }).notNull().default(false),
});
