import { db } from '@/db';
import { order } from '../schema';
import { eq } from 'drizzle-orm';

export type OrderStatus = 'ordered' | 'pickedup' | 'unpicked' | 'cancelled';

export type Order = {
  id: number;
  userId: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

async function createOrder(userId: number, status: OrderStatus = 'ordered'): Promise<number> {
  const newOrder = await db.insert(order).values({
    userId,
    status
  });
  const orderId = parseInt(newOrder.insertId);

  return orderId;
}

async function deleteOrder(orderId: number): Promise<void> {
  await db.delete(order)
    .where(eq(order.id, orderId));
}

async function getOrder(orderId: number): Promise<Order | null> {
  const orders = await db.select().from(order)
    .where(eq(order.id, orderId));
  if (orders.length === 0) {
    return null;
  }
  return orders[0];
}

async function getOrders(userId: number): Promise<Order[]> {
  const orders = await db.select().from(order)
    .where(eq(order.userId, userId));
  return orders;
}

async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
  await db.update(order)
    .set({
      status
    })
    .where(eq(order.id, orderId));
}

export {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrderStatus
}