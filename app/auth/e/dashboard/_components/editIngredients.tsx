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
} from "@/db/controllers/ingredientController";
import { getUser } from "@/lib/userUtils";
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
        <Button>Edit ingredients</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit ingredients</DialogTitle>
          <DialogDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {ingredient.number}
                    </TableCell>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell className="flex justify-center">
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

            <form action={handleCreateIngredient} className=" flex gap-1 mt-4">
              <Input
                // type="number"
                pattern="[0-9]*"
                required
                name="number"
                placeholder="Number"
                className="w-32"
              />
              <Input
                type="text"
                name="name"
                required
                placeholder="Name"
                className="flex-1"
              />
              <Button type="submit" size="icon" className=" aspect-square">
                <Plus />
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
