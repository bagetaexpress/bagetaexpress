"use server";

import { customer, employee, school, seller, user } from "../schema";
import { db } from "../index";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { School } from "./schoolController";

export type Customer = {
  userId: number;
  schoolId: number;
};

export type Employee = {
  userId: number;
  storeId: number;
};

export type Seller = {
  storeId: number;
  schoolId: number;
  userId: number;
};

export type User = {
  id: number;
  email: string;
  password: string;
  isAdmin: boolean;
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

async function createUser(email: string, password: string): Promise<User> {
  const hash = await bcrypt.hash(password, 10);
  const newUser = await db
    .insert(user)
    .values({
      email: email,
      password: hash,
    })
    .execute();
  return {
    id: parseInt(newUser.insertId), // TODO: fix this
    email: email,
    password: hash,
    isAdmin: false,
  };
}

interface ICreateEmployee {
  userId: number;
  storeId: number;
}
async function createEmployee(data: ICreateEmployee): Promise<number> {
  const res = await db.insert(employee).values({
    userId: data.userId,
    storeId: data.storeId,
  });
  return parseInt(res.insertId); // TODO: fix this
}

interface ICreateCustomer {
  email: string;
  password: string;
  schoolId: number;
}
async function createCustomer(data: ICreateCustomer): Promise<Customer> {
  const newUser = await createUser(data.email, data.password);
  await db
    .insert(customer)
    .values({
      userId: newUser.id,
      schoolId: data.schoolId,
    })
    .execute();
  return {
    userId: newUser.id,
    schoolId: data.schoolId,
  };
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

async function deleteSeller(sellerId: number): Promise<void> {
  await db.delete(seller).where(eq(seller.userId, sellerId));
}

async function deleteEmployee(employeeId: number): Promise<void> {
  await db.delete(employee).where(eq(employee.userId, employeeId));
}

async function getUserById(userId: number): Promise<User | null> {
  const found = await db.select().from(user).where(eq(user.id, userId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

async function getEmployeeById(employeeId: number): Promise<Employee | null> {
  const found = await db
    .select()
    .from(employee)
    .where(eq(employee.userId, employeeId));
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

async function getSellerById(sellerId: number): Promise<Seller | null> {
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
  createUser,
  getUserByEmail,
  createEmployee,
  createCustomer,
  getEmployeesByStoreId,
  getSellersByStoreId,
  createSeller,
  deleteSeller,
  deleteEmployee,
  getSellerById,
};
