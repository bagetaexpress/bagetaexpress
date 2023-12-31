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
import { blockUnpickedOrders } from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";

export default function BlockPage() {
  return (
    <div className=" min-h-full flex justify-center items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg">Block unpicked</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will ban all the users with
              unpicked orders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form
              action={async () => {
                "use server";
                const user = await getUser();
                if (!user || !user.schoolId) return;
                console.log("blocking");
                await blockUnpickedOrders(user.schoolId);
                console.log("blocked");
              }}
            >
              <AlertDialogAction type="submit" className="w-full">
                Block unpicked
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
