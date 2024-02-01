import { mysqlTable, int, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { item } from "../item/item";
import { cart } from "./cart";
import { relations } from "drizzle-orm";

export const cartItem = mysqlTable(
  "cart_item",
  {
    cartId: varchar("cart_id", { length: 255 }).notNull(),
    itemId: int("item_id").notNull(),
    quantity: int("quantity").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cartId, table.itemId] }),
  })
);

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.userId],
  }),
  item: one(item, {
    fields: [cartItem.itemId],
    references: [item.id],
  }),
}));
