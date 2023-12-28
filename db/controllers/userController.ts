"use server"

import { customer, employee, user } from "../schema";
import { db } from "../index";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export type Customer = {
  userId: number
  schoolId: number
}

export type Employee = {
  userId: number
  storeId: number
}

export type User = {
  id: number
  email: string
  password: string
  isAdmin: boolean
}

export interface BeUser {
  user: User
  employee: Employee | null
  customer: Customer | null
}

async function getUserByEmail(email: string): Promise<BeUser | null> {
  const found = await db
  .select().from(user)
  .where(eq(user.email, email))
  .innerJoin(employee, eq(user.id, employee.userId))
  .innerJoin(customer, eq(user.id, customer.userId))
  .limit(1);
  if (!found || found.length === 0) {
    return null;
  }
  return found[0];
}

async function createUser(email: string, password: string): Promise<User> {
  const hash = await bcrypt.hash(password, 10);
  const newUser = await db.insert(user).values({
    email: email,
    password: hash,
  }).execute();
  return {
    id: parseInt(newUser.insertId),
    email: email,
    password: hash,
    isAdmin: false,
  };
}

interface ICreateEmployee {
  email: string
  password: string
  storeId: number
}
async function createEmployee(data: ICreateEmployee): Promise<Employee> {
  const newUser = await createUser(data.email, data.password);
  await db.insert(employee).values({
    userId: newUser.id,
    storeId: data.storeId,
  }).execute();
  return {
    userId: newUser.id,
    storeId: data.storeId,
  };
}

interface ICreateCustomer {
  email: string
  password: string
  schoolId: number
}
async function createCustomer(data: ICreateCustomer): Promise<Customer> {
  const newUser = await createUser(data.email, data.password);
  await db.insert(customer).values({
    userId: newUser.id,
    schoolId: data.schoolId,
  }).execute();
  return {
    userId: newUser.id,
    schoolId: data.schoolId,
  };
}

export { 
  createUser,
  getUserByEmail,
  createEmployee,
  createCustomer,
};