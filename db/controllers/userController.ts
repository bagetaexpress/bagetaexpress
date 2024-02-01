"use server";

import {
  Customer,
  Employee,
  School,
  Seller,
  User,
  customer,
  employee,
  school,
  seller,
  user,
} from "../schema";
import { db } from "../index";
import { eq } from "drizzle-orm";

export interface BeUser {
  user: User;
  employee: Employee | null;
  customer: Customer | null;
  seller: Seller | null;
}

async function getUserByEmail(email: string): Promise<BeUser | null> {
  const found = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .leftJoin(employee, eq(user.id, employee.userId))
    .leftJoin(customer, eq(user.id, customer.userId))
    .leftJoin(seller, eq(user.id, seller.userId))
    .limit(1);
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

interface ICreateEmployee {
  userId: Employee["userId"];
  storeId: Employee["storeId"];
}
async function createEmployee(data: ICreateEmployee): Promise<string> {
  await db.insert(employee).values({
    userId: data.userId,
    storeId: data.storeId,
  });
  return data.userId;
}

interface ICreateCustomer {
  userId: Customer["userId"];
  schoolId: Customer["schoolId"];
}
async function createCustomer(data: ICreateCustomer): Promise<string> {
  await db.insert(customer).values({
    userId: data.userId,
    schoolId: data.schoolId,
  });
  return data.userId;
}

async function getEmployeesByStoreId(storeId: Employee["storeId"]): Promise<
  | {
      user: User;
      employee: Employee;
    }[]
  | null
> {
  const found = await db
    .select()
    .from(employee)
    .innerJoin(user, eq(employee.userId, user.id))
    .where(eq(employee.storeId, storeId));
  if (!found || found.length === 0) {
    return null;
  }
  return found;
}

async function getSellersByStoreId(storeId: Seller["storeId"]): Promise<
  | {
      user: User;
      seller: Seller;
      school: School;
    }[]
  | null
> {
  const found = await db
    .select()
    .from(seller)
    .innerJoin(user, eq(seller.userId, user.id))
    .innerJoin(school, eq(seller.schoolId, school.id))
    .where(eq(seller.storeId, storeId));
  if (!found || found.length === 0) {
    return null;
  }
  return found;
}

async function createSeller(data: Seller): Promise<Seller> {
  await db
    .insert(seller)
    .values({
      userId: data.userId,
      storeId: data.storeId,
      schoolId: data.schoolId,
    })
    .execute();
  return data;
}

async function deleteSeller(userId: Seller["userId"]): Promise<void> {
  await db.delete(seller).where(eq(seller.userId, userId));
}

async function deleteEmployee(userId: Seller["userId"]): Promise<void> {
  await db.delete(employee).where(eq(employee.userId, userId));
}

async function getUserById(userId: User["id"]): Promise<User | null> {
  const found = await db.select().from(user).where(eq(user.id, userId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

async function getEmployeeById(
  userId: Employee["userId"]
): Promise<Employee | null> {
  const found = await db
    .select()
    .from(employee)
    .where(eq(employee.userId, userId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

async function getSellerById(userId: Seller["userId"]): Promise<Seller | null> {
  const found = await db.select().from(seller).where(eq(seller.userId, userId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

export {
  getUserById,
  getEmployeeById,
  getUserByEmail,
  getEmployeesByStoreId,
  getSellersByStoreId,
  createCustomer,
  createEmployee,
  createSeller,
  deleteSeller,
  deleteEmployee,
  getSellerById,
};
