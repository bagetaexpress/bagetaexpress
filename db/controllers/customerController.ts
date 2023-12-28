"use server"

import { eq } from "drizzle-orm";
import { db } from "..";
import { customer } from "../schema";

export type Customer = {
  userId: number
  schoolId: number
}

async function getCustomer(userId: number): Promise<Customer | null> {
  const customers = await db.select().from(customer)
    .where(eq(customer.userId, userId));
  if (customers.length === 0) {
    return null;
  }
  return customers[0];
}

export {
  getCustomer,
}