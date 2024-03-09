import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SchoolStats,
  getOrderClose,
  getSchool,
} from "@/db/controllers/schoolController";
import EditOrderClose from "./editOrderClose";
import PrintOrderLabels from "./printOrderLabels";
import { getOrderItemsByStoreAndSchool } from "@/db/controllers/itemController";
import { getUser } from "@/lib/userUtils";
import { getStore } from "@/db/controllers/storeController";
import PrintOrderList from "./printOrderList";

export default async function SchoolCard({
  school,
  orderClose,
  ...stats
}: SchoolStats) {
  const user = await getUser();
  if (!user || !user.isEmployee || !user.storeId) {
    return null;
  }

  const orderCloseDate = new Date(orderClose ?? new Date());
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
