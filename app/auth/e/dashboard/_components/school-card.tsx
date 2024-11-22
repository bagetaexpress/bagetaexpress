import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditOrderClose from "./edit-order-close";
import PrintOrderLabels from "./print-order-labels";
import { ExtendedItem } from "@/repositories/item-repository";
import { getUser } from "@/lib/user-utils";
import storeRepository from "@/repositories/store-repository";
import PrintOrderList from "@/components/print-order-list";
import { getDate } from "@/lib/utils";
import EditReservationClose from "./edit-reservation-close";
import { Loader } from "lucide-react";
import EditReservationItems from "./edit-reservation-items";
import { Store } from "@/db/schema";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import reservationRepository from "@/repositories/reservation-repository";
import ingredientRepository from "@/repositories/ingredient-repository";
import allergenRepository from "@/repositories/allergen-repository";
import { SchoolStats } from "@/repositories/school-repository";
import itemRepository from "@/repositories/item-repository";

export function SchoolCardPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <Loader className="w-10 h-10 animate-spin" />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default async function SchoolCard({
  school,
  orderClose,
  reservationClose,
  ...stats
}: SchoolStats) {
  const user = await getUser();
  if (!user || !user.isEmployee || !user.storeId) {
    return null;
  }

  const orderCloseDate = getDate(orderClose);
  const reservationCloseDate = getDate(reservationClose);
  const [summary, reservations, store] = await Promise.all([
    itemRepository.getMany({
      storeId: user.storeId,
      schoolId: school.id,
      isReservation: false,
      orderStatus: ["ordered"],
    }),
    reservationRepository.getMultiple({ storeId: user.storeId }),
    storeRepository.getSingle({ storeId: user.storeId }),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{school.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="grid gap-2">
          <p>
            Ukončenie objednávok:{" "}
            <span className="font-semibold text-nowrap">
              {orderCloseDate.toLocaleString("sk-SK")}
            </span>
          </p>
          <p>
            Ukončenie rezervácie:{" "}
            <span className="font-semibold text-nowrap">
              {reservationCloseDate.toLocaleString("sk-SK")}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-[3fr_1fr] sm:grid-cols-[2fr_1fr]">
          <p>Objednané(ks.):</p>
          <p>{stats.ordered ?? 0}</p>
          <p>Rezervované(ks.):</p>
          <p>{stats.reserved ?? 0}</p>
          <p>Doručené(ks.):</p>
          <p>{stats.pickedup ?? 0}</p>
          <p>Zablokované(obj.):</p>
          <p>{stats.unpicked ?? 0}</p>
        </div>
      </CardContent>
      <CardFooter className="grid gap-1">
        <EditOrderClose orderClose={orderCloseDate} schoolId={school.id} />
        <EditReservationClose
          reservationClose={reservationCloseDate}
          schoolId={school.id}
        />
        <EditReservationItems
          schoolId={school.id}
          reservations={reservations}
        />
        <Suspense
          fallback={
            <Button disabled variant="outline">
              <Loader className="w-5 h-5 animate-spin" />
            </Button>
          }
        >
          <PrintOrderLabelsWrapper
            orders={summary}
            store={store}
            orderClose={orderCloseDate}
          />
        </Suspense>
        <PrintOrderList school={school} orders={summary} store={store} />
      </CardFooter>
    </Card>
  );
}

async function PrintOrderLabelsWrapper({
  orders,
  store,
  orderClose,
}: {
  orders: Array<ExtendedItem & { quantity: number }>;
  store: Store;
  orderClose: Date;
}) {
  const user = await getUser();
  if (!user || !user.isEmployee || !user.storeId) {
    return null;
  }

  const ordersExtended = await Promise.all(
    orders.map(async (order) => {
      const [ingredients, allergens] = await Promise.all([
        ingredientRepository.getMany({ itemId: order.item.id }),
        allergenRepository.getMany({ itemId: order.item.id }),
      ]);

      return {
        ...order,
        ingredients: ingredients.map((i) => ({ name: i.name })),
        allergens: allergens.map((a) => ({ name: a.name })),
      };
    }),
  );

  return (
    <PrintOrderLabels
      orders={ordersExtended}
      store={store}
      orderClose={orderClose}
    />
  );
}
