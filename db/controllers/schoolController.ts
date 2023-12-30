"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { customer, order, school, schoolStore } from "../schema";

export type School = {
  id: number;
  name: string;
  websiteUrl: string;
  emailRegex: string;
};

async function getSchoolsByStoreId(storeId: number): Promise<any[]> {
  const schools = await db
    .select({ school })
    .from(school)
    .innerJoin(schoolStore, eq(school.id, schoolStore.schoolId))
    .where(eq(schoolStore.storeId, storeId));
  return schools.map((school) => school.school);
}

async function getSchoolsOrderStats(storeId: number) {
  const schools = await db
    .select({
      school,
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

  return schools as {
    school: School;
    ordered: number;
    pickedup: number;
    unpicked: number;
  }[];
}

export { getSchoolsByStoreId, getSchoolsOrderStats };
