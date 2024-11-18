"use server";

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
  User,
  user,
} from "../schema";
import { eq, and, sql, or } from "drizzle-orm";
import { getUser } from "@/lib/user-utils";
import { getDate, getFormatedDate } from "@/lib/utils";
import { cache } from "react";

async function createOrder(
  userId: Order["userId"],
  pin: Order["pin"],
  status: Order["status"] = "ordered",
  discount: Order["discount"] = 0,
) {
  const newOrder = await db.insert(order).values({
    userId,
    pin,
    discount,
    status,
  });

  return newOrder;
}

async function getOrderByPin(
  pin: Order["pin"],
  schoolId?: School["id"],
  status: Order["status"] = "ordered",
): Promise<Order | null> {
  let orders: Order[];

  if (schoolId) {
    orders = (
      await db
        .select({ order })
        .from(order)
        .innerJoin(customer, eq(order.userId, customer.userId))
        .where(
          and(
            eq(order.pin, pin),
            eq(order.status, status),
            eq(customer.schoolId, schoolId),
          ),
        )
    ).map((row) => row.order);
  } else {
    orders = await db
      .select()
      .from(order)
      .where(and(eq(order.pin, pin), eq(order.status, status)));
  }

  return orders[0] ?? null;
}

async function deleteOrder(orderId: Order["id"]): Promise<void> {
  await db.delete(order).where(eq(order.id, orderId));
}

async function getOrdersByUserId(
  userId: Order["userId"],
  status: Order["status"],
): Promise<Order[]> {
  const orders = await db
    .select()
    .from(order)
    .where(and(eq(order.userId, userId), eq(order.status, status)));
  return orders;
}

const getActiveOrder = cache(
  async (userId: Order["userId"]): Promise<Order | null> => {
    const [found] = await db
      .select()
      .from(order)
      .where(
        and(
          eq(order.userId, userId),
          or(eq(order.status, "ordered"), eq(order.status, "unpicked")),
        ),
      )
      .limit(1);
    return found ?? null;
  },
);

async function getOrder(orderId: Order["id"]): Promise<Order | null> {
  const orders = await db.select().from(order).where(eq(order.id, orderId));
  if (orders.length === 0) {
    return null;
  }
  return orders[0];
}

async function getOrders(userId: Order["userId"]): Promise<Order[]> {
  const orders = await db.select().from(order).where(eq(order.userId, userId));
  return orders;
}

async function updateOrderStatus(
  orderId: Order["id"],
  status: Order["status"],
): Promise<void> {
  await db
    .update(order)
    .set({
      status,
      updatedAt: getFormatedDate(new Date()),
    })
    .where(eq(order.id, orderId));
}

async function getFirstOrderItemClose(orderId: Order["id"]): Promise<Date> {
  const items = await db
    .select({ orderClose: schoolStore.orderClose })
    .from(order)
    .innerJoin(customer, eq(order.userId, customer.userId))
    .innerJoin(school, eq(customer.schoolId, school.id))
    .innerJoin(schoolStore, eq(school.id, schoolStore.schoolId))
    .innerJoin(orderItem, eq(order.id, orderItem.orderId))
    .innerJoin(item, eq(orderItem.itemId, item.id))
    .where(eq(order.id, orderId))
    .orderBy(schoolStore.orderClose);

  if (items.length === 0) {
    return new Date();
  }

  return getDate(items[0].orderClose);
}

async function getOrdersBySchoolId(
  schoolId: School["id"],
  status: Order["status"],
): Promise<{ order: Order; user: User }[]> {
  const orders = await db
    .select({ order, user })
    .from(order)
    .innerJoin(customer, eq(order.userId, customer.userId))
    .innerJoin(user, eq(customer.userId, user.id))
    .where(and(eq(order.status, status), eq(customer.schoolId, schoolId)));
  return orders.map((row) => ({ order: row.order, user: row.user }));
}

async function blockUnpickedOrders(schoolId: School["id"]): Promise<void> {
  await db
    .update(order)
    .set({ status: "unpicked", updatedAt: getFormatedDate(new Date()) })
    .where(
      sql`status = "ordered" AND user_id IN (SELECT user_id FROM customer WHERE school_id = ${schoolId})`,
    );
  // await db.execute(sql`
  //   UPDATE \`order\`
  //   INNER JOIN customer ON \`order\`.user_id = customer.user_id
  //   SET \`order\`.status = "unpicked"
  //   WHERE \`order\`.status = "ordered" AND customer.school_id = ${schoolId}`);
}

async function getTotalOrderedItems(): Promise<number> {
  const user = await getUser();
  if (!user) {
    return 0;
  }
  const res = await db
    .select({ sum: sql`SUM(quantity)` })
    .from(order)
    .innerJoin(orderItem, eq(order.id, orderItem.orderId))
    .where(and(eq(order.userId, user.id), eq(order.status, "pickedup")));
  return (res[0]?.sum ?? 0) as number;
}

export {
  getTotalOrderedItems,
  createOrder,
  deleteOrder,
  getOrderByPin,
  getOrder,
  getOrders,
  getOrdersBySchoolId,
  updateOrderStatus,
  getOrdersByUserId,
  blockUnpickedOrders,
  getFirstOrderItemClose,
  getActiveOrder,
};
