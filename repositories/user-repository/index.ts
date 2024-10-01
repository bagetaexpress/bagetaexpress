import "server-only";
import {
  Customer,
  Employee,
  Seller,
  User,
  customer,
  employee,
  seller,
  user,
} from "@/db/schema";
import { db } from "@/db/index";
import { eq, and } from "drizzle-orm";

export interface BeUser {
  user: User;
  employee: Employee | null;
  customer: Customer | null;
  seller: Seller | null;
}

async function getSingleExtended({
  email,
  userId,
}: {
  email?: User["email"];
  userId?: User["id"];
}): Promise<BeUser | null> {
  if (!email && !userId) {
    return null;
  }
  const [found] = await db
    .select()
    .from(user)
    .where(
      and(
        email ? eq(user.email, email) : undefined,
        userId ? eq(user.id, userId) : undefined,
      ),
    )
    .leftJoin(employee, eq(user.id, employee.userId))
    .leftJoin(customer, eq(user.id, customer.userId))
    .leftJoin(seller, eq(user.id, seller.userId))
    .limit(1);
  return found ?? null;
}

async function getSingle({
  userId,
}: {
  userId: User["id"];
}): Promise<User | null> {
  const found = await db.select().from(user).where(eq(user.id, userId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

export const userRepository = {
  getSingleExtended,
  getSingle,
};
