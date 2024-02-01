"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { Customer, customer } from "../schema";

async function getCustomer(
  userId: Customer["userId"]
): Promise<Customer | null> {
  const customers = await db
    .select()
    .from(customer)
    .where(eq(customer.userId, userId));
  if (customers.length === 0) {
    return null;
  }
  return customers[0];
}

export { getCustomer };
