import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { item } from "../item/item";
import { order } from "./order";

export const orderItem = sqliteTable(
  "order_item",
  {
    orderId: integer("order_id", { mode: "number" })
      .notNull()
      .references(() => order.id),
    itemId: integer("item_id", { mode: "number" })
      .notNull()
      .references(() => item.id),
    quantity: integer("quantity", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.itemId] }),
  })
);
