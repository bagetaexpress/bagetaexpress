import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Plus } from "lucide-react";
import { handleRemoveEmployee, handleAddEmployee } from "../accessServerUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/userUtils";
import { getEmployeesByStoreId } from "@/db/controllers/userController";
import { AddEmployeeErrors } from "../accessErrors";

export default async function EmployeeTable({
  err,
}: {
  err: AddEmployeeErrors | undefined;
}) {
  const currUser = await getUser();
  if (!currUser || !currUser.isEmployee) {
    redirect("/");
  }

  const employees = await getEmployeesByStoreId(currUser.storeId ?? 0);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees?.map(
            ({ user }) =>
              user.id !== currUser.id && (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className=" text-right">
                    <form
                      action={async () => {
                        "use server";
                        await handleRemoveEmployee(user.id);
                      }}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        name="employeeId"
                        value={user.id}
                      >
                        <Trash className="h-5 w-5" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
      <form action={handleAddEmployee} className="flex flex-col gap-2 mt-2">
        <Label htmlFor="employeeId">Pridať zamestnanca</Label>
        <div className="flex gap-2">
          <Input
            name="employeeId"
            id="employeeId"
            placeholder="ID účtu"
            required
          />
          <Button type="submit" size="icon" className=" aspect-square">
            <Plus />
          </Button>
        </div>
        {err && (
          <span className="text-red-500">
            {
              {
                [AddEmployeeErrors.InvalidUserId]: "Neplatné ID účtu",
                [AddEmployeeErrors.UserNotFound]: "Účet neexistuje",
                [AddEmployeeErrors.UserAlreadyEmployee]:
                  "Účet už má priradenú rolu zamestnanca",
              }[err]
            }
          </span>
        )}
      </form>
    </>
  );
}
