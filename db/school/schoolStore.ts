import { mysqlTable, int, primaryKey, datetime } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { school } from "./school";
import { store } from "../store/store";

export const schoolStore = mysqlTable(
  "school_store",
  {
    schoolId: int("school_id").notNull(),
    storeId: int("store_id").notNull(),
    orderClose: datetime("order_close")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.schoolId, table.storeId] }),
  })
);

export const schoolStoreRelations = relations(schoolStore, ({ one }) => ({
  school: one(school, {
    fields: [schoolStore.schoolId],
    references: [school.id],
  }),
  store: one(store, {
    fields: [schoolStore.storeId],
    references: [store.id],
  }),
}));
