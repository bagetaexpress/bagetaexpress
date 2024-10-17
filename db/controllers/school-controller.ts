"use server";

import { aliasedTable, and, eq, sql } from "drizzle-orm";
import { db } from "..";
import {
  School,
  SchoolStore,
  customer,
  order,
  orderItem,
  school,
  schoolStore,
} from "../schema";

async function getSchoolsByStoreId(
  storeId: SchoolStore["storeId"],
): Promise<School[]> {
  const schools = await db
    .select({ school })
    .from(school)
    .innerJoin(schoolStore, eq(school.id, schoolStore.schoolId))
    .where(eq(schoolStore.storeId, storeId));
  return schools.map((school) => school.school);
}

async function getSchool(schoolId: School["id"]): Promise<School> {
  const res = await db
    .select({ school })
    .from(school)
    .where(eq(school.id, schoolId));
  if (res.length === 0) {
    throw new Error("School not found");
  }
  return res[0].school;
}

export type SchoolStats = {
  school: School;
  orderClose: string;
  reservationClose: string;
  ordered: number;
  reserved: number;
  pickedup: number;
  unpicked: number;
};

async function getSchoolsOrderStats(
  storeId: SchoolStore["storeId"],
): Promise<SchoolStats[]> {
  const ordered = aliasedTable(orderItem, "ordered");
  const reserved = aliasedTable(orderItem, "reserved");
  const pickedup = aliasedTable(orderItem, "pickedup");

  const schools = await db
    .select({
      school,
      orderClose: schoolStore.orderClose,
      reservationClose: schoolStore.reservationClose,
      ordered: sql`SUM(ordered.quantity)`,
      reserved: sql`SUM(reserved.quantity)`,
      pickedup: sql`SUM(pickedup.quantity)`,
      unpicked: sql`COUNT(case when ${order.status} = 'unpicked' then 1 end)`,
    })
    .from(school)
    .leftJoin(schoolStore, eq(school.id, schoolStore.schoolId))
    .leftJoin(customer, eq(school.id, customer.schoolId))
    .leftJoin(order, eq(customer.userId, order.userId))
    .leftJoin(
      ordered,
      and(
        eq(order.id, ordered.orderId),
        eq(order.status, "ordered"),
        eq(ordered.isReservation, false),
      ),
    )
    .leftJoin(
      reserved,
      and(
        eq(order.id, reserved.orderId),
        eq(order.status, "ordered"),
        eq(reserved.isReservation, true),
      ),
    )
    .leftJoin(
      pickedup,
      and(eq(order.id, pickedup.orderId), eq(order.status, "pickedup")),
    )
    .where(eq(schoolStore.storeId, storeId))
    .groupBy(school.id);

  for (const school of schools) {
    school.ordered = school.ordered ?? 0;
    school.reserved = school.reserved ?? 0;
    school.pickedup = school.pickedup ?? 0;
    const [unpicked] = await db
      .select({
        unpicked: sql`COUNT(case when ${order.status} = 'unpicked' then 1 end)`,
      })
      .from(order)
      .innerJoin(customer, eq(order.userId, customer.userId))
      .where(eq(customer.schoolId, school.school.id));
    school.unpicked = unpicked?.unpicked ?? 0;
  }

  return schools as SchoolStats[];
}

async function getSchoolByDomain(
  domain: School["emailDomain"],
): Promise<School | undefined> {
  const res = await db
    .select({ school })
    .from(school)
    .where(eq(school.emailDomain, domain));
  if (res.length === 0) {
    return undefined;
  }
  return res[0].school;
}

async function getSchoolDomains(): Promise<School["emailDomain"][]> {
  const res = await db.select({ emailDomain: school.emailDomain }).from(school);
  return res.map((r) => r.emailDomain);
}

export {
  getSchoolsByStoreId,
  getSchoolByDomain,
  getSchoolsOrderStats,
  getSchool,
  getSchoolDomains,
};
