"use server";

import { customerRepository } from "@/repositories/customer-repository";
import employeeRepository from "@/repositories/employee-repository";
import { userRepository } from "@/repositories/user-repository";

interface ICreateUser {
  email: string;
  password: string;
  schoolId?: number;
  storeId?: number;
}

type CreateUserResponse = {
  status: number;
  error: string;
};

async function createUser(req: ICreateUser): Promise<CreateUserResponse> {
  try {
    const foundUser = await userRepository.getSingleExtended({
      email: req.email,
    });
    if (foundUser) {
      throw new Error("User already exists");
    }

    if (!req.schoolId && !req.storeId) {
      throw new Error("Must provide schoolId or storeId");
    }
    if (req.schoolId && req.storeId) {
      throw new Error("Cannot provide both schoolId and storeId");
    }

    if (req.schoolId) {
      await customerRepository.createSingle(req as any);
    }
    if (req.storeId) {
      await employeeRepository.createSingle(req as any);
    }

    return { status: 200, error: "" };
  } catch (e: any) {
    const errMessage = e?.message ?? "Internal Server Error";
    console.error(errMessage);
    return { status: 500, error: errMessage };
  }
}

export default createUser;
