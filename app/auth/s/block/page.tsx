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
import {
  getSchoolStores,
  updateSchoolStoreOrderClose,
} from "@/db/controllers/schoolController";
import { getUser } from "@/lib/userUtils";

export default function BlockPage() {
  return (
    <div className=" min-h-full flex justify-center items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg">Zablokovať nevyzdvihnuté</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istý?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia zablokuje všetky nevyzdvihnuté objednávky. Táto akcia
              je nevratná.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <form
              action={async () => {
                "use server";
                const user = await getUser();
                if (!user || !user.schoolId) return;

                const schoolStores = await getSchoolStores(user.schoolId);
                for (const schoolStore of schoolStores) {
                  if (schoolStore.orderClose > new Date()) continue;

                  const date = schoolStore.orderClose;
                  const dayOfWeek = date.getDay();
                  let daysToAdd: number;

                  if (dayOfWeek === 5) {
                    daysToAdd = 3;
                  } else if (dayOfWeek === 6) {
                    daysToAdd = 2;
                  } else {
                    daysToAdd = 1;
                  }
                  date.setDate(date.getDate() + daysToAdd);

                  await updateSchoolStoreOrderClose(
                    user.schoolId,
                    schoolStore.storeId,
                    date
                  );
                }

                await blockUnpickedOrders(user.schoolId);
              }}
            >
              <AlertDialogAction type="submit" className="w-full">
                Zablokovať
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
