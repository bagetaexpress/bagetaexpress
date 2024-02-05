import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { item } from "../item/item";
import { employee } from "../user/employee";
import { relations } from "drizzle-orm";
import { schoolStore } from "../school/schoolStore";
import { seller } from "../user/seller";
import { allergen } from "../item/allergen";
import { ingredient } from "../item/ingredient";

export const store = mysqlTable("store", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  websiteUrl: varchar("website_url", { length: 255 }).notNull(),
  adress: varchar("adress", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  desctiption: varchar("description", { length: 255 }).notNull(),
});

export const storeRelations = relations(store, ({ many }) => ({
  items: many(item),
  schools: many(schoolStore),
  employees: many(employee),
  sellers: many(seller),
  allergens: many(allergen),
  ingredients: many(ingredient),
}));
