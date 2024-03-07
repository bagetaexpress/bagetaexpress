import { sqliteTable, int, primaryKey } from "drizzle-orm/sqlite-core";
import { item } from "../item/item";
import { order } from "./order";

export const orderItem = sqliteTable(
  "order_item",
  {
    orderId: int("order_id", { mode: "number" })
      .notNull()
      .references(() => order.id),
    itemId: int("item_id", { mode: "number" })
      .notNull()
      .references(() => item.id),
    quantity: int("quantity", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.itemId] }),
  })
);
