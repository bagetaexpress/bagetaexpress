import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "../user/user";
import { sql } from "drizzle-orm";

export const cart = sqliteTable("cart", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => user.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
