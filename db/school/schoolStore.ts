import { mysqlTable, int, primaryKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { school } from "./school";
import { store } from "../store/store";

export const schoolStore = mysqlTable(
  "school_store",
  {
    schoolId: int("order_id").notNull(),
    storeId: int("item_id").notNull(),
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
