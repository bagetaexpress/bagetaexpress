import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { user } from "./user";
import { school } from "../school/school";
import { relations } from "drizzle-orm";
import { cart } from "@/db/cart/cart";

export const customer = mysqlTable("customer", {
  userId: varchar("user_id", { length: 255 }).notNull().primaryKey(),
  schoolId: int("school_id").notNull(),
});

export const customerRelations = relations(customer, ({ one, many }) => ({
  cart: one(cart, {
    fields: [customer.userId],
    references: [cart.userId],
  }),
  user: one(user, {
    fields: [customer.userId],
    references: [user.id],
  }),
  school: one(school, {
    fields: [customer.schoolId],
    references: [school.id],
  }),
}));
