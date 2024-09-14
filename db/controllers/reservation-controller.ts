"use server";

import { db } from "@/db";
import { Item, Reservation, item, reservation } from "../schema";
import { and, eq } from "drizzle-orm";

async function getReservationsByStoreId(storeId: Item["storeId"]): Promise<
  {
    item: Item;
    reservation: Reservation | null;
  }[]
> {
  return await db
    .select()
    .from(reservation)
    .rightJoin(item, eq(reservation.itemId, item.id))
    .where(eq(item.storeId, storeId));
}

async function getReservation(
  itemId: Item["id"],
  schoolId: Reservation["schoolId"],
) {
  return await db
    .select()
    .from(reservation)
    .where(
      and(eq(reservation.itemId, itemId), eq(reservation.schoolId, schoolId)),
    )
    .get();
}

async function createReservation(newReservation: {
  itemId: Item["id"];
  schoolId: Reservation["schoolId"];
  quantity: Reservation["quantity"];
}) {
  return await db
    .insert(reservation)
    .values({
      ...newReservation,
      remaining: newReservation.quantity,
    })
    .onConflictDoNothing();
}

async function updateReservation({
  itemId,
  schoolId,
  quantity,
}: {
  itemId: Item["id"];
  schoolId: Reservation["schoolId"];
  quantity: Reservation["quantity"];
}) {
  return await db
    .update(reservation)
    .set({ quantity, remaining: quantity })
    .where(
      and(eq(reservation.itemId, itemId), eq(reservation.schoolId, schoolId)),
    );
}

async function deleteReservation(
  itemId: Item["id"],
  schoolId: Reservation["schoolId"],
) {
  return await db
    .delete(reservation)
    .where(
      and(eq(reservation.itemId, itemId), eq(reservation.schoolId, schoolId)),
    );
}

export {
  getReservationsByStoreId,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};
