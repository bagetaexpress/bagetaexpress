"use server";

import { Order } from "@/db/schema";
import { redirect } from "next/navigation";

export async function handleFilterChange(e: FormData) {
  const filter = e.get("filter") as Order["status"];
  redirect(`/auth/s/summary?filter=${filter}`);
}
