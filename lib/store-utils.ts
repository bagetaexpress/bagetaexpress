"use server";

import {
  updateSchoolStoreOrderClose,
  updateSchoolStoreReservationClose,
} from "@/db/controllers/school-controller";
import { getUser } from "./user-utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { SchoolStore } from "@/db/schema";

async function updateOrderClose(
  schoolId: SchoolStore["schoolId"],
  date: SchoolStore["orderClose"],
) {
  const user = await getUser();
  if (!user || !user.storeId) {
    throw new Error("Not logged in");
  }
  await updateSchoolStoreOrderClose(schoolId, user.storeId, date);
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
  await updateSchoolStoreReservationClose(schoolId, user.storeId, date);
  revalidatePath("/auth/e/dashboard", "page");
}

function revalidateItems() {
  revalidateTag("items");
}

export { updateOrderClose, revalidateItems, updateReservationClose };
