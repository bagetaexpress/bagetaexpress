import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { store } from "../store/store";
import { school } from "../school/school";

export const seller = sqliteTable("seller", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => user.id),
  storeId: int("store_id", { mode: "number" })
    .notNull()
    .references(() => store.id),
  schoolId: int("school_id", { mode: "number" })
    .notNull()
    .references(() => school.id),
});
