"use server";

import { Order } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleFilterChange(e: FormData) {
  const filter = e.get("filter") as Order["status"];
  revalidatePath("/auth/s/summary");
  redirect(`/auth/s/summary?filter=${filter}`);
}
