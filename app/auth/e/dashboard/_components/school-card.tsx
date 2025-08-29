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
import { Loader, CalendarDays, Clock, ListChecks } from "lucide-react";
import EditReservationItems from "./edit-reservation-items";
import { Store } from "@/db/schema";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import reservationRepository from "@/repositories/reservation-repository";
import ingredientRepository from "@/repositories/ingredient-repository";
import allergenRepository from "@/repositories/allergen-repository";
import { SchoolStats } from "@/repositories/school-repository";
import itemRepository from "@/repositories/item-repository";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    itemRepository.getSummary({
      storeId: user.storeId,
      schoolId: school.id,
    }),
    reservationRepository.getMultiple({ storeId: user.storeId }),
    storeRepository.getSingle({ storeId: user.storeId }),
  ]);

  const now = new Date();
  const isOrderOpen = now < orderCloseDate;
  const isReservationOpen = now < reservationCloseDate && !isOrderOpen;

  function formatRelativeSk(target: Date) {
    const diffMs = target.getTime() - now.getTime();
    const future = diffMs > 0;
    const absMs = Math.abs(diffMs);
    const minutes = Math.floor(absMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days >= 1) {
      const remH = hours % 24;
      return future ? `za ${days} d ${remH} h` : `pred ${days} d ${remH} h`;
    }
    if (hours >= 1) {
      const remM = minutes % 60;
      return future ? `za ${hours} h ${remM} m` : `pred ${hours} h ${remM} m`;
    }
    return future ? `za ${minutes} m` : `pred ${minutes} m`;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">{school.name}</CardTitle>
          {isOrderOpen && (
            <Badge variant="default" className="text-xs">
              Objednávky otvorené
            </Badge>
          )}
          {isReservationOpen && (
            <Badge variant="secondary" className="text-xs">
              Rezervácie otvorené
            </Badge>
          )}
          {(!isReservationOpen && !isOrderOpen) && (
            <Badge variant="destructive" className="text-xs">
              Objednávky uzavreté
            </Badge>
          )}
        </div>
        <CardDescription className="mt-1">{store.name}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Uzávierka objednávok</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-nowrap">
                {orderCloseDate.toLocaleString("sk-SK")}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                {formatRelativeSk(orderCloseDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Uzávierka rezervácií</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-nowrap">
                {reservationCloseDate.toLocaleString("sk-SK")}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                {formatRelativeSk(reservationCloseDate)}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-md bg-muted/50 px-3 py-2">
            <div className="text-[10px] text-muted-foreground truncate">Objednané</div>
            <div className="text-base font-semibold">{stats.ordered ?? 0}</div>
          </div>
          <div className="rounded-md bg-muted/50 px-3 py-2">
            <div className="text-[10px] text-muted-foreground truncate">Rezervované</div>
            <div className="text-base font-semibold">{stats.reserved ?? 0}</div>
          </div>
          <div className="rounded-md bg-muted/50 px-3 py-2">
            <div className="text-[10px] text-muted-foreground truncate">Vydané</div>
            <div className="text-base font-semibold">{stats.pickedup ?? 0}</div>
          </div>
          <div className="rounded-md bg-muted/50 px-3 py-2">
            <div className="text-[10px] text-muted-foreground truncate">Neprevzaté</div>
            <div className="text-base font-semibold">{stats.unpicked ?? 0}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid gap-2">
        <div className="text-xs font-medium text-muted-foreground">Rýchle akcie</div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <EditOrderClose
            orderClose={orderCloseDate}
            schoolId={school.id}
            label={
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm">
                <CalendarDays className="h-4 w-4" />
                Čas objednávky
              </span>
            }
            buttonProps={{ variant: "secondary", className: "h-9" }}
          />
          <EditReservationClose
            reservationClose={reservationCloseDate}
            schoolId={school.id}
            label={
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm">
                <Clock className="h-4 w-4" />
                Čas rezervácie
              </span>
            }
            buttonProps={{ variant: "secondary", className: "h-9" }}
          />
        </div>
        <EditReservationItems
          schoolId={school.id}
          reservations={reservations}
          label={
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm">
              <ListChecks className="h-4 w-4" />
              Položky rezervácie
            </span>
          }
          buttonProps={{ variant: "secondary", className: "h-9" }}
        />
        <div className="grid grid-cols-2 gap-2 w-full">
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
        </div>
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
