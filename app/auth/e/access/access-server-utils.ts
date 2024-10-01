"use server";

import { getUser } from "@/lib/user-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AddEmployeeErrors, AddSellerErrors } from "./access-errors";
import employeeRepository from "@/repositories/employee-repository";
import { userRepository } from "@/repositories/user-repository";
import sellerRepository from "@/repositories/seller-repository";

async function handleAddEmployee(formData: any) {
  const currUser = await getUser();
  if (!currUser || !currUser.storeId) return;
  const employeeId = formData.get("employeeId");
  if (!employeeId || typeof employeeId !== "string") {
    redirect("/auth/e/access?EmpError=" + AddEmployeeErrors.InvalidUserId);
  }

  const foundUser = await userRepository.getSingle({ userId: employeeId });
  if (!foundUser) {
    redirect("/auth/e/access?EmpError=" + AddEmployeeErrors.UserNotFound);
  }

  const foundEmployee = await employeeRepository.getSingle({
    userId: foundUser.id,
  });
  if (foundEmployee) {
    redirect(
      "/auth/e/access?EmpError=" + AddEmployeeErrors.UserAlreadyEmployee,
    );
  }

  await employeeRepository.createSingle({
    userId: foundUser.id,
    storeId: currUser.storeId ?? 0,
  });
  revalidatePath("auth/e/access", "page");
  redirect("/auth/e/access");
}

async function handleRemoveEmployee(employeeId: string) {
  const foundEmployee = await employeeRepository.getSingle({
    userId: employeeId,
  });
  if (!foundEmployee) {
    revalidatePath("auth/e/access", "page");
    return;
  }

  await employeeRepository.deleteSingle({ userId: foundEmployee.userId });
  revalidatePath("auth/e/access", "page");
}

async function handleAddSeller(formData: any) {
  const currUser = await getUser();
  if (!currUser || !currUser.storeId) return;

  const schoolId = formData.get("schoolId");
  const sellerId = formData.get("sellerId");

  if (!schoolId || typeof schoolId !== "string" || !schoolId.match(/^\d+$/)) {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.InvalidSchoolId);
  }
  if (!sellerId || typeof sellerId !== "string" || !sellerId.match(/^\d+$/)) {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.InvalidUserId);
  }

  const foundUser = await userRepository.getSingle({ userId: sellerId });
  if (!foundUser) {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.UserNotFound);
  }

  const foundSeller = await sellerRepository.getSingle({
    userId: foundUser.id,
  });
  if (foundSeller) {
    redirect("/auth/e/access?SellerError=" + AddSellerErrors.UserAlreadySeller);
  }

  await sellerRepository.createSingle({
    userId: foundUser.id,
    schoolId: parseInt(schoolId),
    storeId: currUser.storeId ?? 0,
  });
  revalidatePath("auth/e/access", "page");
  redirect("/auth/e/access");
}

async function handleRemoveSeller(sellerId: string) {
  const foundSeller = await sellerRepository.getSingle({ userId: sellerId });
  if (!foundSeller) {
    revalidatePath("auth/e/access", "page");
    return;
  }

  await sellerRepository.deleteSingle({ userId: foundSeller?.userId });
  revalidatePath("auth/e/access", "page");
}

export {
  handleAddEmployee,
  handleRemoveEmployee,
  handleAddSeller,
  handleRemoveSeller,
};
