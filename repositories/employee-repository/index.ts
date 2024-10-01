import "server-only";
import { Employee, Seller, User, employee, user } from "@/db/schema";
import { db } from "@/db/index";
import { InferInsertModel, eq } from "drizzle-orm";

async function createSingle(
  data: InferInsertModel<typeof employee>,
): Promise<string> {
  await db.insert(employee).values({
    userId: data.userId,
    storeId: data.storeId,
  });
  return data.userId;
}

async function getMultiple({
  storeId,
}: {
  storeId: Employee["storeId"];
}): Promise<
  {
    user: User;
    employee: Employee;
  }[]
> {
  const found = await db
    .select()
    .from(employee)
    .innerJoin(user, eq(employee.userId, user.id))
    .where(eq(employee.storeId, storeId));

  return found;
}

async function deleteSingle({
  userId,
}: {
  userId: Seller["userId"];
}): Promise<void> {
  await db.delete(employee).where(eq(employee.userId, userId));
}

async function getSingle({
  userId,
}: {
  userId: Employee["userId"];
}): Promise<Employee | null> {
  const [found] = await db
    .select()
    .from(employee)
    .where(eq(employee.userId, userId));

  return found ?? null;
}

export const employeeRepository = {
  createSingle,
  getMultiple,
  deleteSingle,
  getSingle,
};

export default employeeRepository;
