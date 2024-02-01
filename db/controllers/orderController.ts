"use server";

import { db } from "@/db";
import { customer, order, Order, School } from "../schema";
import { eq, and, sql } from "drizzle-orm";

async function createOrder(
  userId: Order["userId"],
  pin: Order["pin"],
  status: Order["status"] = "ordered"
) {
  const newOrder = await db.insert(order).values({
    userId,
    pin,
    status,
  });

  return newOrder;
}

async function getOrderByPin(
  pin: Order["pin"],
  schoolId?: School["id"],
  status: Order["status"] = "ordered"
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
            eq(customer.schoolId, schoolId)
          )
        )
    ).map((row) => row.order);
  } else {
    orders = await db
      .select()
      .from(order)
      .where(and(eq(order.pin, pin), eq(order.status, status)));
  }

  if (orders.length === 0) {
    return null;
  }
  return orders[0];
}

async function deleteOrder(orderId: Order["id"]): Promise<void> {
  await db.delete(order).where(eq(order.id, orderId));
}

async function getOrdersByUserId(
  userId: Order["userId"],
  status: Order["status"]
): Promise<Order[]> {
  const orders = await db
    .select()
    .from(order)
    .where(and(eq(order.userId, userId), eq(order.status, status)));
  return orders;
}

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
  status: Order["status"]
): Promise<void> {
  await db
    .update(order)
    .set({
      status,
    })
    .where(eq(order.id, orderId));
}

async function getOrdersBySchoolId(
  schoolId: School["id"],
  status: Order["status"]
): Promise<Order[]> {
  const orders = await db
    .select({ order })
    .from(order)
    .innerJoin(customer, eq(order.userId, customer.userId))
    .where(and(eq(order.status, status), eq(customer.schoolId, schoolId)));
  return orders.map((row) => row.order);
}

async function blockUnpickedOrders(schoolId: School["id"]): Promise<void> {
  await db.execute(sql`
    UPDATE \`order\`
    INNER JOIN customer ON \`order\`.user_id = customer.user_id
    SET \`order\`.status = "unpicked"
    WHERE \`order\`.status = "ordered" AND customer.school_id = ${schoolId}`);
}

export {
  createOrder,
  deleteOrder,
  getOrderByPin,
  getOrder,
  getOrders,
  getOrdersBySchoolId,
  updateOrderStatus,
  getOrdersByUserId,
  blockUnpickedOrders,
};
