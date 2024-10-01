import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { Customer, customer } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

async function createSingle(
  data: InferInsertModel<typeof customer>,
): Promise<string> {
  await db.insert(customer).values({
    userId: data.userId,
    schoolId: data.schoolId,
  });
  return data.userId;
}

async function getSingle({
  userId,
}: {
  userId: Customer["userId"];
}): Promise<Customer | null> {
  const [found] = await db
    .select()
    .from(customer)
    .where(eq(customer.userId, userId));

  return found ?? null;
}

export const customerRepository = {
  getSingle,
  createSingle,
};
