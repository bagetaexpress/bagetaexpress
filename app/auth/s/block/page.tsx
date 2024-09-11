import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { blockUnpickedOrders } from "@/db/controllers/order-controller";
import {
  getSchoolStores,
  updateSchoolStore,
} from "@/db/controllers/school-controller";
import { getUser } from "@/lib/user-utils";
import { getDate, getFormatedDate, isLessThenNow } from "@/lib/utils";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BlockPage({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className=" min-h-full flex flex-col gap-2 justify-center items-center">
      <div className="w-fit">
        {searchParams.success === "true" && (
          <Alert className=" mb-4 bg-green-300 border-green-500 bg-opacity-50">
            <Check className="w-6 h-6" />
            <AlertTitle>Predaj sa úspešne ukončil</AlertTitle>
            <AlertDescription>
              Všetci študenti, ktorý si nevyzdvihli objednávku, boli
              zablokovaní.
            </AlertDescription>
          </Alert>
        )}
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
          <Button size="lg">Ukončiť predaj</Button>
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
                  if (!isLessThenNow(schoolStore.orderClose)) continue;

                  const orderCloseDate = getDate(schoolStore.orderClose);
                  const reservationCloseDate = getDate(
                    schoolStore.reservationClose,
                  );
                  const dayOfWeek = new Date().getDay();
                  let daysToAdd: number = 1;

                  if (dayOfWeek >= 5) {
                    daysToAdd = 7 - dayOfWeek + 1;
                  }

                  orderCloseDate.setDate(orderCloseDate.getDate() + daysToAdd);
                  reservationCloseDate.setDate(
                    reservationCloseDate.getDate() + daysToAdd,
                  );

                  await updateSchoolStore({
                    schoolId: user.schoolId,
                    storeId: schoolStore.storeId,
                    orderClose: getFormatedDate(orderCloseDate),
                    reservationClose: getFormatedDate(reservationCloseDate),
                  });
                }

                await blockUnpickedOrders(user.schoolId);

                redirect("/auth/s/block?success=true");
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
