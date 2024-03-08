import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const store = sqliteTable("store", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  websiteUrl: text("website_url").notNull(),
  adress: text("adress").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  description: text("description").notNull(),
});
