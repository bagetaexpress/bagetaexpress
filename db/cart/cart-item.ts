import {
  sqliteTable,
  integer,
  primaryKey,
  text,
} from "drizzle-orm/sqlite-core";
import { item } from "../item/item";
import { cart } from "./cart";

export const cartItem = sqliteTable(
  "cart_item",
  {
    cartId: text("cart_id")
      .notNull()
      .references(() => cart.userId),
    itemId: integer("item_id", { mode: "number" })
      .notNull()
      .references(() => item.id),
    quantity: integer("quantity", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cartId, table.itemId] }),
  }),
);
