import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { user } from "./user";
import { school } from "../school/school";
import { relations } from "drizzle-orm";
import { cart } from "@/db/cart/cart";

export const customer = mysqlTable("customer", {
  userId: int("user_id").notNull().primaryKey(),
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
