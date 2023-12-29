import {
  mysqlTable,
  serial,
  int,
  timestamp,
  mysqlEnum,
  varchar,
} from "drizzle-orm/mysql-core";
import { user } from "../user/user";
import { relations } from "drizzle-orm";
import { orderItem } from "./orderItem";

export const order = mysqlTable("order", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  pin: varchar("pin", { length: 4 }).notNull(),
  status: mysqlEnum("status", [
    "ordered",
    "pickedup",
    "unpicked",
    "cancelled",
  ]).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const orderRelations = relations(order, ({ one, many }) => ({
  orderItems: many(orderItem),
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
}));
