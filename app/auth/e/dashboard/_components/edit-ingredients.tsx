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
  createIngredient,
  deleteIngredient,
  getIngredientsByStoreId,
} from "@/db/controllers/ingredient-controller";
import { getUser } from "@/lib/user-utils";
import { Plus, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditIngredients({ error }: { error?: string }) {
  const user = await getUser();
  if (!user || !user.storeId) redirect("/");

  const ingredients = await getIngredientsByStoreId(user.storeId);

  async function handleCreateIngredient(formData: FormData) {
    "use server";
    const numberStr = formData.get("number") as string;
    const name = formData.get("name") as string;
    const number = parseInt(numberStr);

    if (!numberStr || !name) return;
    if (isNaN(number)) return;
    if (!user || !user.storeId) return;

    try {
      await createIngredient(number, name, user.storeId);
    } catch (e) {
      redirect("/auth/e/dashboard?ingredientError=Somenthing went wrong");
    }
    revalidatePath("/auth/e/dashboard", "page");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 sm:grow-0">Upraviť ingrediencie</Button>
      </DialogTrigger>
      <DialogContent className=" max-h-dvh overflow-auto">
        <DialogHeader>
          <DialogTitle>Upraviť ingrediencie</DialogTitle>
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
            {ingredients.map((ingredient, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium p-2">
                  {ingredient.number}
                </TableCell>
                <TableCell className="p-2">{ingredient.name}</TableCell>
                <TableCell className="flex justify-center p-2">
                  <form
                    action={async () => {
                      "use server";
                      await deleteIngredient(ingredient.id);
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
          <form action={handleCreateIngredient} className=" flex flex-1 gap-1">
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