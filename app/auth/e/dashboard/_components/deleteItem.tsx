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
import { removeItem, updateItem } from "@/db/controllers/itemController";
import { Item } from "@/db/schema";
import { deleteFile } from "@/lib/upladthingServer";
import { Trash } from "lucide-react";
import { revalidatePath } from "next/cache";

export default function DeleteItemButton({ item }: { item: Item }) {
  async function handleDelete() {
    "use server";
    // await deleteFile(item.imageUrl);
    // await removeItem(item.id);
    await updateItem({ id: item.id, deleted: true });
    revalidatePath("/auth/e/dashboard", "page");
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
