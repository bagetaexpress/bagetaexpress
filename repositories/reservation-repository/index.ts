import "server-only";
import { db } from "@/db";
import { Item, Reservation, item, reservation } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

async function getMultiple({ storeId }: { storeId: Item["storeId"] }): Promise<
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

async function getSingle(
  itemId: Item["id"],
  schoolId: Reservation["schoolId"],
): Promise<Reservation | null> {
  const [found] = await db
    .select()
    .from(reservation)
    .where(
      and(eq(reservation.itemId, itemId), eq(reservation.schoolId, schoolId)),
    )
    .limit(1);

  return found ?? null;
}

async function createSingle(newReservation: {
  itemId: Item["id"];
  schoolId: Reservation["schoolId"];
  quantity: Reservation["quantity"];
}): Promise<void> {
  await db
    .insert(reservation)
    .values({
      ...newReservation,
      remaining: newReservation.quantity,
    })
    .onConflictDoNothing();
}

async function updateSingle({
  itemId,
  schoolId,
  quantity,
}: {
  itemId: Item["id"];
  schoolId: Reservation["schoolId"];
  quantity: Reservation["quantity"];
}): Promise<void> {
  await db
    .update(reservation)
    .set({ quantity, remaining: quantity })
    .where(
      and(eq(reservation.itemId, itemId), eq(reservation.schoolId, schoolId)),
    );
}

async function resetRemaining(schoolId: Reservation["schoolId"]) {
  return await db
    .update(reservation)
    .set({ remaining: sql<number>`quantity` })
    .where(eq(reservation.schoolId, schoolId));
}

async function deleteSingle({
  itemId,
  schoolId,
}: {
  itemId: Item["id"];
  schoolId: Reservation["schoolId"];
}): Promise<void> {
  await db
    .delete(reservation)
    .where(
      and(eq(reservation.itemId, itemId), eq(reservation.schoolId, schoolId)),
    );
}

export const reservationRepository = {
  getMultiple,
  getSingle,
  createSingle,
  updateSingle,
  resetRemaining,
  deleteSingle,
};

export default reservationRepository;
