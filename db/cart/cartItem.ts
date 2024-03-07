import { sqliteTable, int, primaryKey, text } from "drizzle-orm/sqlite-core";
import { item } from "../item/item";
import { cart } from "./cart";

export const cartItem = sqliteTable(
  "cart_item",
  {
    cartId: text("cart_id")
      .notNull()
      .references(() => cart.userId),
    itemId: int("item_id", { mode: "number" })
      .notNull()
      .references(() => item.id),
    quantity: int("quantity", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cartId, table.itemId] }),
  })
);
