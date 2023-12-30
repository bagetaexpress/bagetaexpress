import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployeesByStoreId,
  getSellersByStoreId,
  getUserById,
} from "@/db/controllers/userController";
import { getUser } from "@/lib/userUtils";
import { Plus, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  handleAddEmployee,
  handleAddSeller,
  handleRemoveEmployee,
} from "./accessServerUtils";
import EmployeeTable from "./_components/employeeTable";
import SellerTable from "./_components/sellerTable";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currUser = await getUser();
  if (!currUser || !currUser.isEmployee) {
    redirect("/");
  }

  const sellers = await getSellersByStoreId(currUser.storeId ?? 0);

  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold pt-2">Access manager</h1>
      <h2 className="text-2xl font-semibold pt-4">Employees</h2>
      <EmployeeTable err={searchParams.EmpError as string | undefined} />
      <h2 className="text-2xl font-semibold pt-4">Sellers</h2>
      <SellerTable err={searchParams.SellerError as string | undefined} />
    </div>
  );
}
