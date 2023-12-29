"use server";

import { OrderStatus } from "@/db/controllers/orderController";
import { redirect } from "next/navigation";

export async function handleFilterChange(e: FormData) {
  const filter = e.get("filter") as OrderStatus;
  redirect(`?filter=${filter}`);
}
