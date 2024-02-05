import {
  boolean,
  decimal,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
import { store } from "../store/store";
import { relations } from "drizzle-orm";
import { orderItem } from "../schema";
import { cartItem } from "../cart/cartItem";
import { itemAllergen } from "./itemAllergen";
import { itemIngredient } from "./itemIngredient";

export const item = mysqlTable("item", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  weight: int("weight").notNull().default(0),
  imageUrl: varchar("image_url", { length: 255 }).notNull().default(""),
  price: decimal("price", { precision: 4, scale: 2 }).notNull(),
  storeId: int("store_id").notNull(),
  deleted: boolean("deleted").notNull().default(false),
});

export const itemRelations = relations(item, ({ one, many }) => ({
  orderItems: many(orderItem),
  cartItems: many(cartItem),
  itemAllergens: many(itemAllergen),
  itemIngredient: many(itemIngredient),
  store: one(store, {
    fields: [item.storeId],
    references: [store.id],
  }),
}));
