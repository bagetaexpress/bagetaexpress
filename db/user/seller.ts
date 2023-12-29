import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { user } from "./user";
import { store } from "../store/store";
import { relations } from "drizzle-orm";

export const seller = mysqlTable("seller", {
  userId: int("user_id").notNull().primaryKey(),
  storeId: int("store_id").notNull(),
  schoolId: int("school_id").notNull(),
});

export const sellerRelations = relations(seller, ({ one }) => ({
  user: one(user, {
    fields: [seller.userId],
    references: [user.id],
  }),
  store: one(store, {
    fields: [seller.storeId],
    references: [store.id],
  }),
  school: one(store, {
    fields: [seller.schoolId],
    references: [store.id],
  }),
}));
