import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { school } from "../school/school";
import { item } from "../item/item";

export const reservation = sqliteTable(
  "reservation",
  {
    schoolId: integer("school_id", { mode: "number" })
      .notNull()
      .references(() => school.id),
    itemId: integer("item_id", { mode: "number" })
      .notNull()
      .references(() => item.id),
    quantity: integer("quantity", { mode: "number" }).notNull(),
    remaining: integer("remaining", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.schoolId, table.itemId] }),
  }),
);
