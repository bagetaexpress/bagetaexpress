"use server"

import { db } from "@/db"
import { customer, employee, user } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import bcrypt from "bcrypt";
import { createCustomer, createEmployee, getUserByEmail } from "@/db/controllers/userController";

interface ICreateUser {
  email: string
  password: string
  schoolId?: number
  storeId?: number
}

type CreateUserResponse = {
  status: number
  error: string
}

async function createUser(req: ICreateUser): Promise<CreateUserResponse> {
  try {
    const foundUser = await getUserByEmail(req.email)
    if (foundUser) {
      throw new Error("User already exists")
    }

    if (!req.schoolId && !req.storeId) {
      throw new Error("Must provide schoolId or storeId")
    }
    if (req.schoolId && req.storeId) {
      throw new Error("Cannot provide both schoolId and storeId")
    }

    if (req.schoolId) {
      await createCustomer(req as any)
    }
    if (req.storeId) {
      await createEmployee(req as any)
    }

    return { status: 200, error: "" }
  } catch (e: any) {
    const errMessage = e?.message ?? "Internal Server Error"
    console.error(errMessage)
    return { status: 500, error: errMessage}
  }
}

export default createUser