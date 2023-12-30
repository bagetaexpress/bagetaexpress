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

async function handleAddEmployee(formData: any) {
  const currUser = await getUser();
  if (!currUser || !currUser.storeId) return;
  const employeeId = formData.get("employeeId");
  if (
    !employeeId ||
    typeof employeeId !== "string" ||
    !employeeId.match(/^\d+$/)
  ) {
    redirect("/auth/e/access?EmpError=Invalid employee id");
  }

  const foundUser = await getUserById(parseInt(employeeId));
  if (!foundUser) {
    redirect("/auth/e/access?EmpError=Employee not found");
  }

  const foundEmployee = await getEmployeeById(foundUser.id);
  if (foundEmployee) {
    redirect("/auth/e/access?EmpError=Employee is already an employee");
  }

  await createEmployee({
    userId: foundUser.id,
    storeId: currUser.storeId ?? 0,
  });
  revalidatePath("auth/e/access", "page");
  redirect("/auth/e/access");
}

async function handleRemoveEmployee(employeeId: number) {
  const foundEmployee = await getEmployeeById(employeeId);
  if (!foundEmployee) {
    revalidatePath("auth/e/access", "page");
  }

  await deleteEmployee(foundEmployee?.userId ?? 0);
  revalidatePath("auth/e/access", "page");
}

async function handleAddSeller(formData: any) {
  const currUser = await getUser();
  if (!currUser || !currUser.storeId) return;
  const sellerId = formData.get("sellerId");
  const schoolId = formData.get("schoolId");
  if (!schoolId || typeof schoolId !== "string" || !schoolId.match(/^\d+$/)) {
    redirect("/auth/e/access?SellerError=Invalid school id");
  }
  if (!sellerId || typeof sellerId !== "string" || !sellerId.match(/^\d+$/)) {
    redirect("/auth/e/access?SellerError=Invalid seller id");
  }

  const foundUser = await getUserById(parseInt(sellerId));
  if (!foundUser) {
    redirect("/auth/e/access?SellerError=Seller not found");
  }

  const foundSeller = await getSellerById(foundUser.id);
  if (foundSeller) {
    redirect("/auth/e/access?SellerError=Seller is already an employee");
  }

  await createSeller({
    userId: foundUser.id,
    schoolId: parseInt(schoolId),
    storeId: currUser.storeId ?? 0,
  });
  revalidatePath("auth/e/access", "page");
  redirect("/auth/e/access");
}

async function handleRemoveSeller(sellerId: number) {
  const foundSeller = await getSellerById(sellerId);
  if (!foundSeller) {
    revalidatePath("auth/e/access", "page");
  }

  await deleteSeller(foundSeller?.userId ?? 0);
  revalidatePath("auth/e/access", "page");
  redirect("/auth/e/access");
}

export {
  handleAddEmployee,
  handleRemoveEmployee,
  handleAddSeller,
  handleRemoveSeller,
};
