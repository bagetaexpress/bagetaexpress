import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const school = sqliteTable("school", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  websiteUrl: text("website_url").notNull(),
  emailDomain: text("email_domain").notNull(),
});
