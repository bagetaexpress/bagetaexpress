"use server";

import {
  getUserById,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
  getSellerById,
  createSeller,
  deleteSeller,
} from "@/db/controllers/userController";
import { getUser } from "@/lib/userUtils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AddEmployeeErrors, AddSellerErrors } from "./accessErrors";

async function handleAddEmployee(formData: any) {
  const currUser = await getUser();
  if (!currUser || !currUser.storeId) return;
  const employeeId = formData.get("employeeId");
  if (!employeeId || typeof employeeId !== "string") {
    redirect("/auth/e/access?EmpError=" + AddEmployeeErrors.InvalidUserId);
  }

  const foundUser = await getUserById(employeeId);
  if (!foundUser) {
    redirect("/auth/e/access?EmpError=" + AddEmployeeErrors.UserNotFound);
  }

  const foundEmployee = await getEmployeeById(foundUser.id);
  if (foundEmployee) {
    redirect(
      "/auth/e/access?EmpError=" + AddEmployeeErrors.UserAlreadyEmployee
    );
  }

  await createEmployee({
    userId: foundUser.id,
    storeId: currUser.storeId ?? 0,
  });
  revalidatePath("auth/e/access", "page");
  redirect("/auth/e/access");
}

async function handleRemoveEmployee(employeeId: string) {
  const foundEmployee = await getEmployeeById(employeeId);
  if (!foundEmployee) {
    revalidatePath("auth/e/access", "page");
  }

  await deleteEmployee(foundEmployee?.userId ?? "");
  revalidatePath("auth/e/access", "page");
}

async function handleAddSeller(formData: any) {
  const currUser = await getUser();
  if (!currUser || !currUser.storeId) return;
  const sellerId = formData.get("sellerId");
  const schoolId = formData.get("schoolId");
  if (!schoolId || typeof schoolId !== "string" || !schoolId.match(/^\d+$/)) {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.InvalidSchoolId);
  }
  if (!sellerId || typeof sellerId !== "string") {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.InvalidUserId);
  }

  const foundUser = await getUserById(sellerId);
  if (!foundUser) {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.UserNotFound);
  }

  const foundSeller = await getSellerById(foundUser.id);
  if (foundSeller) {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.UserAlreadySeller);
  }

  await createSeller({
    userId: foundUser.id,
    schoolId: parseInt(schoolId),
    storeId: currUser.storeId ?? 0,
  });
  revalidatePath("auth/e/access", "page");
  redirect("/auth/e/access");
}

async function handleRemoveSeller(sellerId: string) {
  const foundSeller = await getSellerById(sellerId);
  if (!foundSeller) {
    revalidatePath("auth/e/access", "page");
  }

  await deleteSeller(foundSeller?.userId ?? "");
  revalidatePath("auth/e/access", "page");
}

export {
  handleAddEmployee,
  handleRemoveEmployee,
  handleAddSeller,
  handleRemoveSeller,
};
