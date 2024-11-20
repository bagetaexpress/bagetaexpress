"use server";

import { getCartItems } from "./cart-utils";
import { getUser } from "./user-utils";
import { db } from "@/db";
import * as schemas from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { getDate, getNewDate } from "./utils";
import { customerRepository } from "@/repositories/customer-repository";
import cartRepository from "@/repositories/cart-repository";
import orderRepository from "@/repositories/order-repository";

function generatePin(length: number): string {
  const chars = "0123456789";
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)];
  }
  return pin;
}

async function createOrderFromCart(discount: number = 0): Promise<{
  error: string | null;
}> {
  const user = await getUser();
  if (!user || user.schoolId == null) {
    throw new Error("User not found");
  }

  const [customer, hasOrder, cart, cartItems] = await Promise.all([
    customerRepository.getSingle({ userId: user.id }),
    orderRepository.getSingle({
      userId: user.id,
      status: ["ordered", "unpicked"],
    }),
    cartRepository.getSingle({ userId: user.id }),
    getCartItems(user.id),
  ]);

  if (!customer) {
    throw new Error("Customer not found");
  } else if (hasOrder) {
    throw new Error("Order already exists");
  } else if (!cart) {
    throw new Error("Cart not found");
  } else if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  let error: string | null = null;

  try {
    await db.transaction(async (tx) => {
      let pin: string;
      do {
        pin = generatePin(4);
        const [foundOrder] = await tx
          .select()
          .from(schemas.order)
          .innerJoin(
            schemas.customer,
            eq(schemas.customer.userId, schemas.order.userId),
          )
          .where(
            and(
              eq(schemas.order.pin, pin),
              eq(schemas.customer.schoolId, customer.schoolId),
              or(
                eq(schemas.order.status, "ordered"),
                eq(schemas.order.status, "unpicked"),
              ),
            ),
          );
        if (foundOrder == null) {
          break;
        }
      } while (true);

      const [order] = await tx
        .insert(schemas.order)
        .values({
          userId: user.id,
          pin,
          discount,
          status: "ordered",
        })
        .returning();

      for (const cartItem of cartItems) {
        const [extendedItem] = await tx
          .select()
          .from(schemas.item)
          .innerJoin(
            schemas.schoolStore,
            eq(schemas.item.storeId, schemas.schoolStore.storeId),
          )
          .leftJoin(
            schemas.reservation,
            and(
              eq(schemas.reservation.itemId, schemas.item.id),
              eq(schemas.reservation.schoolId, customer.schoolId),
            ),
          )
          .where(
            and(
              eq(schemas.schoolStore.schoolId, customer.schoolId),
              eq(schemas.item.id, cartItem.item.id),
              eq(schemas.item.deleted, false),
            ),
          )
          .limit(1);

        if (!extendedItem) {
          error = `Položka '${cartItem.item.name}' nebola nájdená`;
          tx.rollback();
        }

        const isOrderClosed =
          getDate(extendedItem.school_store.orderClose) < getNewDate();
        const isReservationClosed =
          extendedItem.reservation &&
          getDate(extendedItem.school_store.reservationClose) < getNewDate();

        if (isOrderClosed && !extendedItem.reservation) {
          error = `Nie je možné objednať '${cartItem.item.name}', čas pre objednanie uplynul`;
          tx.rollback();
        }
        if (isReservationClosed && extendedItem.reservation) {
          error = `Nie je možné rezervovať '${cartItem.item.name}', čas pre rezerváciu uplynul`;
          tx.rollback();
        }
        if (
          extendedItem.reservation &&
          isOrderClosed &&
          (extendedItem.reservation?.remaining ?? 0) <
            cartItem.cartItem.quantity
        ) {
          error = `Nie je možné rezervovať '${cartItem.item.name}', nie je dostupný dostatočný počet kusov `;
          tx.rollback();
        }

        if (extendedItem.reservation && isOrderClosed) {
          await tx
            .update(schemas.reservation)
            .set({
              remaining:
                extendedItem.reservation.remaining - cartItem.cartItem.quantity,
            })
            .where(
              and(
                eq(schemas.reservation.itemId, cartItem.item.id),
                eq(schemas.reservation.schoolId, cartItem.schoolStore.schoolId),
              ),
            );
        }

        await tx.insert(schemas.orderItem).values({
          orderId: order.id,
          itemId: cartItem.item.id,
          quantity: cartItem.cartItem.quantity,
          isReservation: isOrderClosed && extendedItem.reservation != null,
        });

        await tx
          .delete(schemas.cartItem)
          .where(eq(schemas.cartItem.cartId, cart.userId));
      }
    });
  } catch (e) {
    console.log(e);
  }

  if (error) {
    return { error };
  }
  return { error: null };
}

async function deleteOrderAndItems(orderId: number): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .delete(schemas.orderItem)
      .where(eq(schemas.orderItem.orderId, orderId));
    await tx.delete(schemas.order).where(eq(schemas.order.id, orderId));
  });
}

export { createOrderFromCart, deleteOrderAndItems };
