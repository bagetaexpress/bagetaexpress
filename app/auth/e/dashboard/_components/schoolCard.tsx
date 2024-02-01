import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SchoolStats } from "@/db/controllers/schoolController";
import EditOrderClose from "./editOrderClose";
import PrintOrderLabels from "./printOrderLabels";
import { getOrderItemsByStoreAndSchool } from "@/db/controllers/itemController";
import { getUser } from "@/lib/userUtils";
import { getStore } from "@/db/controllers/storeController";

export default async function SchoolCard({
  school,
  orderClose,
  ...stats
}: SchoolStats) {
  const user = await getUser();
  if (!user) {
    return null;
  }
  const orders = await getOrderItemsByStoreAndSchool(
    user.storeId ?? 0,
    school.id
  );
  const store = await getStore(user.storeId ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{school.name}</CardTitle>
        <CardDescription>
          Ukončenie objednávok:{" "}
          <span className="font-semibold">{orderClose.toLocaleString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" grid grid-cols-2">
          <p>Objednávky:</p>
          <p>{stats.ordered}</p>
          <p>Doručené:</p>
          <p>{stats.pickedup}</p>
          <p>Zablokované:</p>
          <p>{stats.unpicked}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-1">
          <EditOrderClose orderClose={orderClose} schoolId={school.id} />
          <PrintOrderLabels orders={orders} store={store} />
        </div>
      </CardFooter>
    </Card>
  );
}
