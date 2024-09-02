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
import { getOrderItemsByStoreAndSchool } from "@/db/controllers/item-controller";
import { getUser } from "@/lib/user-utils";
import { getStore } from "@/db/controllers/store-controller";
import PrintOrderList from "./print-order-list";
import { getDate } from "@/lib/utils";

export default async function SchoolCard({
  school,
  orderClose,
  ...stats
}: SchoolStats) {
  const user = await getUser();
  if (!user || !user.isEmployee || !user.storeId) {
    return null;
  }

  const orderCloseDate = getDate(orderClose ?? new Date());
  const orders = await getOrderItemsByStoreAndSchool(user.storeId, school.id);
  const store = await getStore(user.storeId ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{school.name}</CardTitle>
        <CardDescription>
          Ukončenie objednávok:{" "}
          <span className="font-semibold">
            {orderCloseDate.toLocaleString("sk-SK")}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" grid grid-cols-2">
          <p>Objednané:</p>
          <p>{stats.ordered}</p>
          <p>Doručené:</p>
          <p>{stats.pickedup}</p>
          <p>Zablokované:</p>
          <p>{stats.unpicked}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-1">
          <EditOrderClose orderClose={orderCloseDate} schoolId={school.id} />
          <PrintOrderLabels
            orders={orders}
            store={store}
            orderClose={orderCloseDate}
          />
          <PrintOrderList school={school} orders={orders} store={store} />
        </div>
      </CardFooter>
    </Card>
  );
}
