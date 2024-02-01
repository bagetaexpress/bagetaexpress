"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import {
  School,
  SchoolStore,
  customer,
  order,
  school,
  schoolStore,
} from "../schema";

async function getSchoolsByStoreId(
  storeId: SchoolStore["storeId"]
): Promise<School[]> {
  const schools = await db
    .select({ school })
    .from(school)
    .innerJoin(schoolStore, eq(school.id, schoolStore.schoolId))
    .where(eq(schoolStore.storeId, storeId));
  return schools.map((school) => school.school);
}

export type SchoolStats = {
  school: School;
  orderClose: Date;
  ordered: number;
  pickedup: number;
  unpicked: number;
};

async function getSchoolsOrderStats(storeId: SchoolStore["storeId"]) {
  const schools = await db
    .select({
      school,
      orderClose: schoolStore.orderClose,
      ordered: sql`COUNT(case when ${order.status} = 'ordered' then 1 end)`,
      pickedup: sql`COUNT(case when ${order.status} = 'pickedup' then 1 end)`,
      unpicked: sql`COUNT(case when ${order.status} = 'unpicked' then 1 end)`,
    })
    .from(school)
    .innerJoin(schoolStore, eq(school.id, schoolStore.schoolId))
    .innerJoin(customer, eq(school.id, customer.schoolId))
    .innerJoin(order, eq(customer.userId, order.userId))
    .where(eq(schoolStore.storeId, storeId))
    .groupBy(school.id);

  return schools as SchoolStats[];
}

async function updateSchoolStoreOrderClose(
  schoolId: SchoolStore["schoolId"],
  storeId: SchoolStore["storeId"],
  orderClose: Date
) {
  await db
    .update(schoolStore)
    .set({ orderClose })
    .where(
      and(eq(schoolStore.schoolId, schoolId), eq(schoolStore.storeId, storeId))
    );
}

async function getFirstOrderClose(schoolId: SchoolStore["schoolId"]) {
  const res = await db
    .select({ orderClose: schoolStore.orderClose })
    .from(schoolStore)
    .where(eq(schoolStore.schoolId, schoolId))
    .orderBy(schoolStore.orderClose)
    .limit(1);
  return res[0].orderClose;
}

async function getSchoolStores(schoolId: number): Promise<SchoolStore[]> {
  const res = await db
    .select({ schoolStore })
    .from(schoolStore)
    .where(eq(schoolStore.schoolId, schoolId));
  return res.map((r) => r.schoolStore);
}

export {
  getSchoolsByStoreId,
  getFirstOrderClose,
  getSchoolStores,
  getSchoolsOrderStats,
  updateSchoolStoreOrderClose,
};
