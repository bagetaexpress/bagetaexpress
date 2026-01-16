import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Item } from "@/db/schema";
import itemRepository from "@/repositories/item-repository";
import { Trash, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

type DeleteItemButtonProps = {
  item: Item;
  variant?: "default" | "icon" | "dropdown";
};

export default function DeleteItemButton({ item, variant = "default" }: DeleteItemButtonProps) {
  async function handleDelete() {
    "use server";
    await itemRepository.updateSingle({ data: { id: item.id, deleted: true } });
    revalidatePath("/auth/e/dashboard", "page");
  }

  if (variant === "icon") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si určite istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia je nevratná.
              <span className="font-semibold"> {item.name}</span> sa nenávratne
              zmaže.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <form action={handleDelete}>
              <AlertDialogAction asChild>
                <Button className="w-full" variant="destructive" type="submit">
                  Zmazať
                </Button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (variant === "dropdown") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem 
            onSelect={(e) => e.preventDefault()}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Zmazať
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si určite istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia je nevratná.
              <span className="font-semibold"> {item.name}</span> sa nenávratne
              zmaže.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <form action={handleDelete}>
              <AlertDialogAction asChild>
                <Button className="w-full" variant="destructive" type="submit">
                  Zmazať
                </Button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-center items-center gap-2"
        >
          <Trash className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ste si určite istý?</AlertDialogTitle>
          <AlertDialogDescription>
            Táto akcia je nevratná.
            <span className="font-semibold"> {item.name}</span> sa nenávratne
            zmaže.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zrušiť</AlertDialogCancel>
          <form action={handleDelete}>
            <AlertDialogAction asChild>
              <Button className="w-full" variant="destructive" type="submit">
                Zmazať
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
