import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  createAllergen,
  deleteAllergen,
  getAllergensByStoreId,
} from "@/db/controllers/allergenController";
import { getUser } from "@/lib/userUtils";
import { Plus, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditAllergens({ error }: { error?: string }) {
  const user = await getUser();
  if (!user || !user.storeId) redirect("/");

  const allergens = await getAllergensByStoreId(user.storeId);

  async function handleCreateAllergen(formData: FormData) {
    "use server";
    const numberStr = formData.get("number") as string;
    const name = formData.get("name") as string;

    if (!numberStr || !name) return;
    if (isNaN(parseInt(numberStr))) return;
    if (!user || !user.storeId) return;
    const number = parseInt(numberStr);

    try {
      await createAllergen(number, name, user.storeId);
    } catch (e) {
      redirect("/auth/e/dashboard?allergenError=Somenthing went wrong");
    }
    revalidatePath("/auth/e/dashboard", "page");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 sm:grow-0">Upraviť alergény</Button>
      </DialogTrigger>
      <DialogContent className=" max-h-dvh overflow-auto">
        <DialogHeader>
          <DialogTitle>Upraviť alergény</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Číslo</TableHead>
              <TableHead>Názov</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allergens.map((allergen, i) => (
              <TableRow key={i + "editAllergen"}>
                <TableCell className="font-medium p-2">
                  {allergen.number}
                </TableCell>
                <TableCell className="p-2">{allergen.name}</TableCell>
                <TableCell className="flex justify-center p-2">
                  <form
                    action={async () => {
                      "use server";
                      await deleteAllergen(allergen.id);
                      revalidatePath("/auth/e/dashboard", "page");
                    }}
                  >
                    <Button type="submit" size="icon">
                      <Trash className="w-5 h-5" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter>
          <form action={handleCreateAllergen} className=" flex flex-1 gap-1">
            <Input
              pattern="[0-9]*"
              required
              name="number"
              placeholder="Číslo"
              className="w-32"
            />
            <Input
              type="text"
              name="name"
              required
              placeholder="Názov"
              className="flex-1"
            />
            <Button type="submit" size="icon" className=" aspect-square">
              <Plus />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
