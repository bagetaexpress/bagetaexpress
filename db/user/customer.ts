import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { school } from "../school/school";

export const customer = sqliteTable("customer", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => user.id),
  schoolId: integer("school_id", { mode: "number" })
    .notNull()
    .references(() => school.id),
});
