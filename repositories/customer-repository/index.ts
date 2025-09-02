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

async function updateSingle({
  userId,
  schoolId,
}: {
  userId: Customer["userId"];
  schoolId: Customer["schoolId"];
}): Promise<void> {
  await db.update(customer).set({ schoolId }).where(eq(customer.userId, userId));
}

export const customerRepository = {
  getSingle,
  createSingle,
  updateSingle,
};
