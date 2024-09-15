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
  const unpicked = aliasedTable(orderItem, "unpicked");

  const schools = await db
    .select({
      school,
      orderClose: schoolStore.orderClose,
      reservationClose: schoolStore.reservationClose,
      ordered: sql`SUM(ordered.quantity)`,
      reserved: sql`SUM(reserved.quantity)`,
      pickedup: sql`SUM(pickedup.quantity)`,
      unpicked: sql`SUM(unpicked.quantity)`,
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
    .leftJoin(
      unpicked,
      and(eq(order.id, unpicked.orderId), eq(order.status, "unpicked")),
    )
    .where(eq(schoolStore.storeId, storeId))
    .groupBy(school.id);

  return schools as SchoolStats[];
}

async function updateSchoolStore({
  schoolId,
  storeId,
  orderClose,
  reservationClose,
}: SchoolStore) {
  await db
    .update(schoolStore)
    .set({ orderClose, reservationClose })
    .where(
      and(eq(schoolStore.schoolId, schoolId), eq(schoolStore.storeId, storeId)),
    );
}

async function updateSchoolStoreOrderClose(
  schoolId: SchoolStore["schoolId"],
  storeId: SchoolStore["storeId"],
  orderClose: SchoolStore["orderClose"],
) {
  await db
    .update(schoolStore)
    .set({ orderClose })
    .where(
      and(eq(schoolStore.schoolId, schoolId), eq(schoolStore.storeId, storeId)),
    );
}

async function updateSchoolStoreReservationClose(
  schoolId: SchoolStore["schoolId"],
  storeId: SchoolStore["storeId"],
  reservationClose: SchoolStore["reservationClose"],
) {
  await db
    .update(schoolStore)
    .set({ reservationClose })
    .where(
      and(eq(schoolStore.schoolId, schoolId), eq(schoolStore.storeId, storeId)),
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

async function getSchoolStores(
  schoolId: SchoolStore["schoolId"],
): Promise<SchoolStore[]> {
  const res = await db
    .select({ schoolStore })
    .from(schoolStore)
    .where(eq(schoolStore.schoolId, schoolId));
  return res.map((r) => r.schoolStore);
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

async function getOrderClose(
  schoolId: School["id"],
  storeId: SchoolStore["storeId"],
): Promise<SchoolStore["orderClose"] | null> {
  const res = await db
    .select({ orderClose: schoolStore.orderClose })
    .from(schoolStore)
    .where(
      and(eq(schoolStore.schoolId, schoolId), eq(schoolStore.storeId, storeId)),
    );
  return res[0]?.orderClose ?? null;
}

export {
  getOrderClose,
  getSchoolsByStoreId,
  getFirstOrderClose,
  getSchoolStores,
  getSchoolByDomain,
  getSchoolsOrderStats,
  updateSchoolStoreOrderClose,
  updateSchoolStoreReservationClose,
  updateSchoolStore,
  getSchool,
  getSchoolDomains,
};
