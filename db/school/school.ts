import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const school = sqliteTable("school", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  websiteUrl: text("website_url").notNull(),
  emailDomain: text("email_domain").notNull(),
});
