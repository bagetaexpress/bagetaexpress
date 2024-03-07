import { sqliteTable, int, primaryKey } from "drizzle-orm/sqlite-core";
import { item } from "../item/item";
import { order } from "./order";
import { relations } from "drizzle-orm";

export const orderItem = sqliteTable(
  "order_item",
  {
    orderId: int("order_id", { mode: "number" }).notNull(),
    itemId: int("item_id", { mode: "number" }).notNull(),
    quantity: int("quantity", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.itemId] }),
  })
);

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  item: one(item, {
    fields: [orderItem.itemId],
    references: [item.id],
  }),
}));
