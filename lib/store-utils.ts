"use server";

import { getUser } from "./user-utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { SchoolStore, Store } from "@/db/schema";
import { storeRepository } from "@/repositories/store-repository";
import { schoolStoreRepository } from "@/repositories/school-store-repository";

async function updateOrderClose(
  schoolId: SchoolStore["schoolId"],
  date: SchoolStore["orderClose"],
) {
  const user = await getUser();
  if (!user || !user.storeId) {
    throw new Error("Not logged in");
  }

  await schoolStoreRepository.updateSingle({
    schoolId,
    storeId: user.storeId,
    orderClose: date,
  });
  revalidatePath("/auth/e/dashboard", "page");
}

async function updateReservationClose(
  schoolId: SchoolStore["schoolId"],
  date: SchoolStore["reservationClose"],
) {
  const user = await getUser();
  if (!user || !user.storeId) {
    throw new Error("Not logged in");
  }

  await schoolStoreRepository.updateSingle({
    schoolId,
    storeId: user.storeId,
    reservationClose: date,
  });
  revalidatePath("/auth/e/dashboard", "page");
}

async function revalidateItems() {
  revalidateTag("items");
}

async function updateStore(data: { id: Store["id"] } & Partial<Store>) {
  await storeRepository.updateSingle(data);
}
export {
  updateOrderClose,
  revalidateItems,
  updateReservationClose,
  updateStore,
};
