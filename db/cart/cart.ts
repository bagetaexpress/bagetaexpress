import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { user } from "../user/user";
import { relations } from "drizzle-orm";
import { cartItem } from "./cartItem";

export const cart = mysqlTable("cart", {
  userId: varchar("user_id", { length: 255 }).notNull().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const cartRelations = relations(cart, ({ one, many }) => ({
  cartItems: many(cartItem),
  user: one(user, {
    fields: [cart.userId],
    references: [user.id],
  }),
}));
