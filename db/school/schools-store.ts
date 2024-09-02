import {
  sqliteTable,
  integer,
  primaryKey,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { school } from "./school";
import { store } from "../store/store";

export const schoolStore = sqliteTable(
  "school_store",
  {
    schoolId: integer("school_id", { mode: "number" })
      .notNull()
      .references(() => school.id),
    storeId: integer("store_id", { mode: "number" })
      .notNull()
      .references(() => store.id),
    orderClose: text("order_close")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.schoolId, table.storeId] }),
  }),
);
