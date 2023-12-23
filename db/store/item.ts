import { decimal, int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { store } from "./store";
import { relations } from "drizzle-orm";
import { orderItem } from "../schema";

export const item = mysqlTable('item', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 255}).notNull(), 
  description: varchar('description', {length: 255}).notNull(),
  price: decimal('price', {precision: 2}).notNull(),
  storeId: int('store_id').notNull()
})

export const itemRelations = relations(item, ({ one, many }) => ({
  orderItems: many(orderItem),
  store: one(store, {
    fields: [item.storeId],
    references: [store.id]
  })
}))