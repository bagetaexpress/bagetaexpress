import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SchoolStats } from "@/db/controllers/school-controller";
import EditOrderClose from "./edit-order-close";
import PrintOrderLabels from "./print-order-labels";
import {
  ExtendedItem,
  getOrderItemsByStoreAndSchool,
} from "@/db/controllers/item-controller";
import { getUser } from "@/lib/user-utils";
import { getStore } from "@/db/controllers/store-controller";
import PrintOrderList from "./print-order-list";
import { getDate } from "@/lib/utils";
import EditReservationClose from "./edit-reservation-close";
import { Loader } from "lucide-react";
import { getReservationsByStoreId } from "@/db/controllers/reservation-controller";
import EditReservationItems from "./edit-reservation-items";
import { Store } from "@/db/schema";
import { getIngredientsByItemId } from "@/db/controllers/ingredient-controller";
import { getAllergensByItemId } from "@/db/controllers/allergen-controller";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

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
  const [orders, reservations, store] = await Promise.all([
    getOrderItemsByStoreAndSchool(user.storeId, school.id),
    getReservationsByStoreId(user.storeId),
    getStore(user.storeId),
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
        <div className=" grid grid-cols-2">
          <p>Objednané:</p>
          <p>{stats.ordered}</p>
          <p>Doručené:</p>
          <p>{stats.pickedup}</p>
          <p>Zablokované:</p>
          <p>{stats.unpicked}</p>
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
            orders={orders}
            store={store}
            orderClose={orderCloseDate}
          />
        </Suspense>
        <PrintOrderList school={school} orders={orders} store={store} />
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

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const ordersExtended = await Promise.all(
    orders.map(async (order) => {
      const [ingredients, allergens] = await Promise.all([
        getIngredientsByItemId(order.item.id),
        getAllergensByItemId(order.item.id),
      ]);

      return {
        ...order,
        ingredients: ingredients.map((i) => ({ name: i.ingredient.name })),
        allergens: allergens.map((a) => ({ name: a.allergen.name })),
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
