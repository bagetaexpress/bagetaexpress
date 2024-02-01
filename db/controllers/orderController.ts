"use server";

import { db } from "@/db";
import { customer, order, user } from "../schema";
import { eq, and, sql } from "drizzle-orm";

export type OrderStatus = "ordered" | "pickedup" | "unpicked" | "cancelled";

export type Order = {
  id: number;
  userId: string;
  status: OrderStatus;
  pin: string;
  createdAt: Date;
  updatedAt: Date;
};

async function createOrder(
  userId: string,
  pin: string,
  status: OrderStatus = "ordered"
) {
  const newOrder = await db.insert(order).values({
    userId,
    pin,
    status,
  });

  return newOrder;
}

async function getOrderByPin(
  pin: string,
  schoolId?: number,
  status: OrderStatus = "ordered"
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

async function deleteOrder(orderId: number): Promise<void> {
  await db.delete(order).where(eq(order.id, orderId));
}

async function getOrdersByUserId(
  userId: string,
  status: OrderStatus
): Promise<Order[]> {
  const orders = await db
    .select()
    .from(order)
    .where(and(eq(order.userId, userId), eq(order.status, status)));
  return orders;
}

async function getOrder(orderId: number): Promise<Order | null> {
  const orders = await db.select().from(order).where(eq(order.id, orderId));
  if (orders.length === 0) {
    return null;
  }
  return orders[0];
}

async function getOrders(userId: string): Promise<Order[]> {
  const orders = await db.select().from(order).where(eq(order.userId, userId));
  return orders;
}

async function updateOrderStatus(
  orderId: number,
  status: OrderStatus
): Promise<void> {
  await db
    .update(order)
    .set({
      status,
    })
    .where(eq(order.id, orderId));
}

async function getOrdersBySchoolId(
  schoolId: number,
  status: OrderStatus
): Promise<Order[]> {
  const orders = await db
    .select({ order })
    .from(order)
    .innerJoin(customer, eq(order.userId, customer.userId))
    .where(and(eq(order.status, status), eq(customer.schoolId, schoolId)));
  return orders.map((row) => row.order);
}

async function blockUnpickedOrders(schoolId: number): Promise<void> {
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
