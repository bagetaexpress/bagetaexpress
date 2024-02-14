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

export default async function BlockPage() {
  return (
    <div className=" min-h-full flex flex-col gap-2 justify-center items-center">
      <div>
        <h1 className=" font-semibold text-2xl">Ukončenie predaja</h1>
        <p>
          Po zablokovaní nevyzdvihnutých objednávok sa posunie dátum uzavretia o
          jeden deň,
          <br />
          ak je dátum uzavretia v piatok, tak sa posunie na nedeľu.
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg">Zablokovať nevyzdvihnuté</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Táto akcia je nevratná</AlertDialogTitle>
            <AlertDialogDescription>
              Všetky nevyzdvihnuté objednávky budú zablokované.
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
                  let daysToAdd: number = 1;

                  if (dayOfWeek === 5) {
                    daysToAdd = 2;
                  } else if (dayOfWeek === 6) {
                    daysToAdd = 1;
                  } else {
                    daysToAdd = 0;
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
