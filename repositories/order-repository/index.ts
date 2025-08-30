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
import { cache } from "react";

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
      updatedAt: new Date().toISOString(),
    })
    .where(eq(order.id, data.id));
}

async function getFirstClose(orderId: Order["id"]): Promise<string> {
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
    return new Date().toISOString();
  }
  return found.orderClose;
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
      updatedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(order.status, filter.status),
        sql`user_id IN (SELECT user_id FROM customer WHERE school_id = ${filter.schoolId})`,
      ),
    );
}

async function getDailyItemCounts(days: number = 7): Promise<{ date: string; count: number }[]> {
  const result = await db
    .select({
      date: sql<string>`date(${order.updatedAt})`,
      count: sql<number>`sum(${orderItem.quantity})`,
    })
    .from(order)
    .innerJoin(orderItem, eq(order.id, orderItem.orderId))
    .where(
      and(
        eq(order.status, "pickedup"),
        sql`date(${order.updatedAt}) >= date('now', '-' || ${days} || ' days')`
      )
    )
    .groupBy(sql`date(${order.updatedAt})`)
    .orderBy(sql`date(${order.updatedAt})`);

  return result;
}

async function getOrderStats(days?: number) {
  const today = new Date();
  const startDate = days ? new Date(today) : new Date(0); // Use epoch start for all time
  if (days) {
    startDate.setDate(today.getDate() - days);
  }

  const [totalOrders] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(order)
    .where(
      days ? and(
        sql`date(${order.createdAt}) >= date(${startDate.toISOString()})`,
        sql`date(${order.createdAt}) <= date(${today.toISOString()})`
      ) : undefined
    );

  const [totalOrderedItems] = await db
    .select({
      count: sql<number>`sum(${orderItem.quantity})`,
    })
    .from(order)
    .innerJoin(orderItem, eq(order.id, orderItem.orderId))
    .where(
      days ? and(
        sql`date(${order.createdAt}) >= date(${startDate.toISOString()})`,
        sql`date(${order.createdAt}) <= date(${today.toISOString()})`
      ) : undefined
    );

  const [totalPickedUpOrders] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(order)
    .where(
      and(
        eq(order.status, "pickedup"),
        days ? and(
          sql`date(${order.updatedAt}) >= date(${startDate.toISOString()})`,
          sql`date(${order.updatedAt}) <= date(${today.toISOString()})`
        ) : undefined
      )
    );

  const [totalUnpickedOrders] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(order)
    .where(
      and(
        eq(order.status, "unpicked"),
        days ? and(
          sql`date(${order.updatedAt}) >= date(${startDate.toISOString()})`,
          sql`date(${order.updatedAt}) <= date(${today.toISOString()})`
        ) : undefined
      )
    );

  return {
    totalOrders: totalOrders?.count ?? 0,
    totalOrderedItems: totalOrderedItems?.count ?? 0,
    totalPickedUpOrders: totalPickedUpOrders?.count ?? 0,
    totalUnpickedOrders: totalUnpickedOrders?.count ?? 0,
  };
}

export const orderRepository = {
  getSingle,
  getMany,
  updateSingle,
  getFirstClose,
  updateMany,
  getDailyItemCounts,
  getOrderStats,
};

export default orderRepository;
