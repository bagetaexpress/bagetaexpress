import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { store } from "../store/store";
import { school } from "../school/school";

export const seller = sqliteTable("seller", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => user.id),
  storeId: integer("store_id", { mode: "number" })
    .notNull()
    .references(() => store.id),
  schoolId: integer("school_id", { mode: "number" })
    .notNull()
    .references(() => school.id),
});
