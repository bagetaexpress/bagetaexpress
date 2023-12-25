import { mysqlTable, int, primaryKey } from "drizzle-orm/mysql-core";
import { item } from "../store/item";
import { order } from "./order";
import { relations } from "drizzle-orm";

export const orderItem = mysqlTable('order_item', {
    orderId: int('order_id').notNull(),
    itemId: int('item_id').notNull(),
    quantity: int('quantity').notNull(),
  }, (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.itemId] }),
  })
)

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id]
  }),
  item: one(item, {
    fields: [orderItem.itemId],
    references: [item.id]
  })
}))
