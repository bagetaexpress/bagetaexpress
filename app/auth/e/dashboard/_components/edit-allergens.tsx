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
import { getUser } from "@/lib/user-utils";
import allergenRepository from "@/repositories/allergen-repository";
import { Loader, Plus, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function EditAllergens() {
  return (
    <Suspense
      fallback={
        <Button variant="ghost" className="flex-1 sm:grow-0 opacity-50" disabled>
          Upraviť alergény <Loader className="w-5 h-5 animate-spin" />
        </Button>
      }
    >
      <EditAllergensInner />
    </Suspense>
  );
}

async function EditAllergensInner() {
  const user = await getUser();
  if (!user || !user.storeId) redirect("/");

  const allergens = await allergenRepository.getMany({ storeId: user.storeId });

  async function handleCreateAllergen(formData: FormData) {
    "use server";
    const numberStr = formData.get("number") as string;
    const name = formData.get("name") as string;

    if (!numberStr || !name) return;
    if (isNaN(parseInt(numberStr))) return;
    if (!user || !user.storeId) return;
    const number = parseInt(numberStr);

    try {
      await allergenRepository.createSingle({
        number,
        name,
        storeId: user.storeId,
      });
    } catch (e) {
      redirect("/auth/e/dashboard?allergenError=Somenthing went wrong");
    }
    revalidatePath("/auth/e/dashboard", "page");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex-1 sm:grow-0">Upraviť alergény</Button>
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
                      await allergenRepository.deleteSingle({
                        allergenId: allergen.id,
                      });
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
