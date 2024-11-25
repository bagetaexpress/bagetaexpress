import "server-only";
import { db } from "@/db";
import {
  customer,
  item,
  order,
  Order,
  orderItem,
  school,
  School,
  schoolStore,
  user,
  User,
} from "@/db/schema";
import { eq, and, sql, or, getTableColumns } from "drizzle-orm";
import { getDate, getFormatedDate } from "@/lib/utils";
import { cache } from "react";
import { getNewDate } from "../../lib/utils";

const getSingle = cache(
  async ({
    pin,
    schoolId,
    userId,
    status,
  }: {
    pin?: Order["pin"];
    schoolId?: School["id"];
    userId?: Order["userId"];
    status?: Order["status"][];
  }): Promise<Order | null> => {
    const filters = [
      pin ? eq(order.pin, pin) : undefined,
      status ? or(...status.map((s) => eq(order.status, s))) : undefined,
      userId ? eq(order.userId, userId) : undefined,
    ];

    let baseQuery = db
      .select({ ...getTableColumns(order) })
      .from(order)
      .$dynamic();

    if (schoolId) {
      baseQuery = baseQuery.innerJoin(
        customer,
        eq(order.userId, customer.userId),
      );
      filters.push(eq(customer.schoolId, schoolId));
    }

    const [found] = await baseQuery.where(and(...filters));

    return found ?? null;
  },
);

async function getMany({
  schoolId,
  status,
}: {
  schoolId?: School["id"];
  status?: Order["status"][];
}): Promise<{ order: Order; user: User }[]> {
  const found = await db
    .select({ order, user })
    .from(order)
    .innerJoin(customer, eq(order.userId, customer.userId))
    .innerJoin(user, eq(customer.userId, user.id))
    .where(
      and(
        status ? or(...status.map((s) => eq(order.status, s))) : undefined,
        schoolId ? eq(customer.schoolId, schoolId) : undefined,
      ),
    );

  return found;
}

async function updateSingle(
  data: Pick<Order, "id"> & Partial<Order>,
): Promise<void> {
  await db
    .update(order)
    .set({
      ...data,
      updatedAt: getFormatedDate(getNewDate()),
    })
    .where(eq(order.id, data.id));
}

async function getFirstClose(orderId: Order["id"]): Promise<Date> {
  const [found] = await db
    .select({ orderClose: schoolStore.orderClose })
    .from(order)
    .innerJoin(customer, eq(order.userId, customer.userId))
    .innerJoin(school, eq(customer.schoolId, school.id))
    .innerJoin(schoolStore, eq(school.id, schoolStore.schoolId))
    .innerJoin(orderItem, eq(order.id, orderItem.orderId))
    .innerJoin(item, eq(orderItem.itemId, item.id))
    .where(eq(order.id, orderId))
    .orderBy(schoolStore.orderClose);

  if (!found) {
    return getDate(new Date().toISOString());
  }
  return getDate(found.orderClose);
}

async function updateMany({
  filter,
  data,
}: {
  filter: {
    schoolId: School["id"];
    status: Order["status"];
  };
  data: Partial<Order>;
}) {
  await db
    .update(order)
    .set({
      ...data,
      updatedAt: getFormatedDate(getNewDate()),
    })
    .where(
      and(
        eq(order.status, filter.status),
        sql`user_id IN (SELECT user_id FROM customer WHERE school_id = ${filter.schoolId})`,
      ),
    );
}

export const orderRepository = {
  getSingle,
  getMany,
  updateSingle,
  getFirstClose,
  updateMany,
};

export default orderRepository;
