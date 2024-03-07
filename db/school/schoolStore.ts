import { sqliteTable, int, primaryKey, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { school } from "./school";
import { store } from "../store/store";

export const schoolStore = sqliteTable(
  "school_store",
  {
    schoolId: int("school_id", { mode: "number" })
      .notNull()
      .references(() => school.id),
    storeId: int("store_id", { mode: "number" })
      .notNull()
      .references(() => store.id),
    orderClose: text("order_close")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.schoolId, table.storeId] }),
  })
);
