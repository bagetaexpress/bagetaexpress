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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user-utils";
import { getSellersByStoreId } from "@/db/controllers/user-controller";
import { handleAddSeller, handleRemoveSeller } from "../access-server-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSchoolsByStoreId } from "@/db/controllers/school-controller";
import { AddSellerErrors } from "../access-errors";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function SellerTable({
  err,
}: {
  err: AddSellerErrors | undefined;
}) {
  const currUser = await getUser();
  if (!currUser || !currUser.isEmployee) {
    redirect("/");
  }

  const [sellers, schools] = await Promise.all([
    getSellersByStoreId(currUser.storeId ?? 0),
    getSchoolsByStoreId(currUser.storeId ?? 0),
  ]);

  const filteredSellers = sellers?.filter(
    ({ user }) => user.id !== currUser.id && !user.isAdmin,
  );

  return (
    <>
      <Table className="max-w-full hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Škola</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSellers?.map(({ school, user }) => (
            <TableRow key={user.id} className="">
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{school.name}</TableCell>
              <TableCell className=" text-right ">
                <form
                  action={async () => {
                    "use server";
                    await handleRemoveSeller(user.id);
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
      {filteredSellers?.length === 0 && (
        <div className="text-center text-muted-foreground p-4">
          Žiadni predajcovia
        </div>
      )}
      <Accordion type="multiple" className="max-w-full block md:hidden">
        {filteredSellers?.map(({ school, user }) => (
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
              <div>
                <span className="font-medium">Škola: </span>
                {school.name}
              </div>
              <form
                action={async () => {
                  "use server";
                  await handleRemoveSeller(user.id);
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
      <form action={handleAddSeller} className="flex flex-col gap-2 mt-2">
        <Label htmlFor="sellerId">Pridať predajcu</Label>
        <div className="flex gap-2">
          <Input name="sellerId" id="sellerId" placeholder="ID účtu" required />
          <Select name="schoolId">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Škola" />
            </SelectTrigger>
            <SelectContent>
              {schools?.map(({ id, name }) => (
                <SelectItem key={id} value={id.toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="icon" className=" aspect-square">
            <Plus />
          </Button>
        </div>
        {err && (
          <span className="text-red-500">
            {
              {
                [AddSellerErrors.InvalidUserId]: "Neplatné ID účtu",
                [AddSellerErrors.UserNotFound]: "Používateľ neexistuje",
                [AddSellerErrors.UserAlreadySeller]:
                  "Používateľ už má priradenú rolu predajcu",
                [AddSellerErrors.InvalidSchoolId]: "Zvolená škola neexistuje",
                [AddSellerErrors.SchoolNotFound]: "Škola neexistuje",
              }[err]
            }
          </span>
        )}
      </form>
    </>
  );
}
