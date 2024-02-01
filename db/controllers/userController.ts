"use server";

import { customer, employee, school, seller, user } from "../schema";
import { db } from "../index";
import { eq, sql } from "drizzle-orm";
import { School } from "./schoolController";

export type Customer = {
  userId: string;
  schoolId: number;
};

export type Employee = {
  userId: string;
  storeId: number;
};

export type Seller = {
  storeId: number;
  schoolId: number;
  userId: string;
};

export type User = {
  id: string;
  name: string | null;
  isAdmin: boolean;
  email: string;
  emailVerified: Date | null;
  image: string | null;
};

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
  userId: string;
  storeId: number;
}
async function createEmployee(data: ICreateEmployee): Promise<string> {
  await db.insert(employee).values({
    userId: data.userId,
    storeId: data.storeId,
  });
  return data.userId;
}

interface ICreateCustomer {
  userId: string;
  schoolId: number;
}
async function createCustomer(data: ICreateCustomer): Promise<string> {
  await db.insert(customer).values({
    userId: data.userId,
    schoolId: data.schoolId,
  });
  return data.userId;
}

async function getEmployeesByStoreId(storeId: number): Promise<
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

async function getSellersByStoreId(storeId: number): Promise<
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

async function deleteSeller(sellerId: string): Promise<void> {
  await db.delete(seller).where(eq(seller.userId, sellerId));
}

async function deleteEmployee(employeeId: string): Promise<void> {
  await db.delete(employee).where(eq(employee.userId, employeeId));
}

async function getUserById(userId: string): Promise<User | null> {
  const found = await db.select().from(user).where(eq(user.id, userId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

async function getEmployeeById(employeeId: string): Promise<Employee | null> {
  const found = await db
    .select()
    .from(employee)
    .where(eq(employee.userId, employeeId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

async function getSellerById(sellerId: string): Promise<Seller | null> {
  const found = await db
    .select()
    .from(seller)
    .where(eq(seller.userId, sellerId));
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
