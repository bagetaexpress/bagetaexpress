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
import { Item, removeItem } from "@/db/controllers/itemController";
import { Trash } from "lucide-react";
import { revalidatePath } from "next/cache";

export default function DeleteItemButton({ item }: { item: Item }) {
  async function handleDelete() {
    "use server";
    await removeItem(item.id);
    revalidatePath("/auth/e/dashboard", "page");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-center items-center gap-2"
        >
          Delete <Trash className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-semibold"> {item.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={handleDelete}>
            <AlertDialogAction asChild>
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
