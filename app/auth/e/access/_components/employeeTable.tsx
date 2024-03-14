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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const filteredEmployees = employees?.filter(
    ({ user }) => user.id !== currUser.id && !user.isAdmin,
  );

  return (
    <>
      <Table className="max-w-full hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees?.map(({ user }) => (
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
          ))}
        </TableBody>
      </Table>
      {filteredEmployees?.length === 0 && (
        <div className="text-center text-muted-foreground p-4">
          Žiadni zamestnanci
        </div>
      )}
      <Accordion type="multiple" className="max-w-full block md:hidden">
        {filteredEmployees?.map(({ user }) => (
          <AccordionItem key={user.id} value={user.email}>
            <AccordionTrigger>{user.name ?? user.email}</AccordionTrigger>
            <AccordionContent>
              <div>
                <span className="font-medium">ID: </span>
                {user.id}
              </div>
              <div>
                <span className="font-medium">Email: </span>
                {user.email}
              </div>
              <form
                action={async () => {
                  "use server";
                  await handleRemoveEmployee(user.id);
                }}
                className="flex pt-2"
              >
                <Button
                  variant="outline"
                  name="employeeId"
                  className="flex-1 items-center justify-center gap-2"
                  value={user.id}
                >
                  Odstrániť
                  <Trash className="h-5 w-5" />
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
