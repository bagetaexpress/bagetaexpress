import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { customer } from "../user/customer";
import { schoolStore } from "./schoolStore";
import { seller } from "../user/seller";

export const school = mysqlTable("school", {
  id: serial("id").primaryKey(),
  name: varchar("same", { length: 255 }).notNull(),
  websiteUrl: varchar("website_url", { length: 255 }).notNull(),
  emailRegex: varchar("email_regex", { length: 255 }).notNull(),
});

export const schoolRelations = relations(school, ({ many }) => ({
  students: many(customer),
  schoolStores: many(schoolStore),
  sellers: many(seller),
}));
