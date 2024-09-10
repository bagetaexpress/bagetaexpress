import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { user } from "../user/user";
import { sql } from "drizzle-orm";

export const order = sqliteTable("order", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  pin: text("pin", { length: 4 }).notNull(),
  discount: real("discount").notNull().default(0),
  isReservation: integer("is_reservation", { mode: "boolean" })
    .notNull()
    .default(false),
  status: text("status", {
    enum: ["ordered", "pickedup", "unpicked", "cancelled"],
  }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
