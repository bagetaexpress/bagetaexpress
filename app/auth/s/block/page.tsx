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
import { blockUnpickedOrders } from "@/db/controllers/orderController";
import {
  getSchoolStores,
  updateSchoolStoreOrderClose,
} from "@/db/controllers/schoolController";
import { getUser } from "@/lib/userUtils";
import { getDate } from "@/lib/utils";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BlockPage({
  searchParams,
}: {
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

                console.info(
                  `Blocking unpicked orders for school ${user.schoolId}`,
                );

                const schoolStores = await getSchoolStores(user.schoolId);
                for (const schoolStore of schoolStores) {
                  if (getDate(schoolStore.orderClose) > new Date()) continue;

                  const date = getDate(schoolStore.orderClose);
                  const dayOfWeek = date.getDay();
                  let daysToAdd: number = 1;

                  if (dayOfWeek === 5) {
                    daysToAdd = 3;
                  }

                  date.setDate(date.getDate() + daysToAdd);

                  await updateSchoolStoreOrderClose(
                    user.schoolId,
                    schoolStore.storeId,
                    format(new Date(date), "yyyy-MM-dd HH:mm:ss"),
                  );
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
