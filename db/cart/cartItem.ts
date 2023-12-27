import { mysqlTable, int, primaryKey } from "drizzle-orm/mysql-core";
import { item } from "../store/item";
import { cart } from "./cart";
import { relations } from "drizzle-orm";

export const cartItem = mysqlTable('cart_item', {
    cartId: int('cart_id').notNull(),
    itemId: int('item_id').notNull(),
    quantity: int('quantity').notNull(),
  }, (table) => ({
    pk: primaryKey({ columns: [table.cartId, table.itemId] }),
  })
)

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.userId]
  }),
  item: one(item, {
    fields: [cartItem.itemId],
    references: [item.id]
  })
}))
