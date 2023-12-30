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
import { getUser } from "@/lib/userUtils";
import { getSellersByStoreId } from "@/db/controllers/userController";
import { handleAddSeller, handleRemoveSeller } from "../accessServerUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSchoolsByStoreId } from "@/db/controllers/schoolController";

export default async function SellerTable({
  err,
}: {
  err: string | undefined;
}) {
  const currUser = await getUser();
  if (!currUser || !currUser.isEmployee) {
    redirect("/");
  }

  const sellers = await getSellersByStoreId(currUser.storeId ?? 0);
  const schools = await getSchoolsByStoreId(currUser.storeId ?? 0);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>School</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers?.map(
            ({ school, user }) =>
              user.id !== currUser.id && (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{school.name}</TableCell>
                  <TableCell className=" text-right">
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
              )
          )}
        </TableBody>
      </Table>
      <form action={handleAddSeller} className="flex flex-col gap-2 mt-2">
        <Label htmlFor="sellerId">Add employee</Label>
        <div className="flex gap-2">
          <Input
            name="sellerId"
            id="sellerId"
            placeholder="Account id"
            required
          />
          <Select name="schoolId">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="School" />
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
        {err && <span className="text-red-500">{err}</span>}
      </form>
    </>
  );
}
