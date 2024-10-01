import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getOrdersBySchoolId } from "@/db/controllers/order-controller";
import { getUser } from "@/lib/user-utils";
import SummaryRow from "./_components/summary-row";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, Search } from "lucide-react";
import { handleFilterChange } from "./server-util";
import { Order } from "@/db/schema";
import PrintOrderList from "@/components/print-order-list";
import { getSchool } from "@/db/controllers/school-controller";
import { getItemsSummaryByStoreAndSchool } from "@/db/controllers/item-controller";
import { Suspense } from "react";
import ReservedItems from "./_components/reserved-items";
import storeRepository from "@/repositories/store-repository";

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filter = (searchParams.filter as Order["status"]) ?? "ordered";

  return (
    <div className="flex flex-col relative min-h-full">
      <h1 className="text-2xl font-semibold pt-2">Zhrnutie</h1>
      <h2>
        Zobrasujú sa:{" "}
        {
          {
            ordered: "Aktuálne objednávky",
            unpicked: "Nevyzdvihnuté objednávky",
            pickedup: "Prevzaté objednávky",
            cancelled: "Zrušené objednávky",
          }[filter]
        }
      </h2>
      <div className="flex gap-2 justify-between flex-wrap flex-col md:flex-row">
        <form
          action={handleFilterChange}
          className="flex py-2 gap-2 flex-1 md:grow-0"
        >
          <Select name="filter" defaultValue={filter}>
            <SelectTrigger className="flex-1 md:grow-0 md:min-w-[180px]">
              <SelectValue placeholder="ordered" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ordered">Aktuálne</SelectItem>
              <SelectItem value="unpicked">Nevyzdvihnuté</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="icon" className="aspect-square">
            <Search />
          </Button>
        </form>
        <div className="flex gap-2 flex-wrap items-center">
          <PrintOrderListWrapper />
          <ReservedItems />
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-1 justify-center items-center">
            <Loader className="h-10 w-10 animate-spin" />
          </div>
        }
      >
        <SummaryPageInner filter={filter} />
      </Suspense>
    </div>
  );
}

async function SummaryPageInner({
  filter = "ordered",
}: {
  filter?: Order["status"];
}) {
  const user = await getUser();
  if (!user || !user.schoolId) return null;

  const orders = await getOrdersBySchoolId(user.schoolId, filter);

  return (
    <>
      {orders.length === 0 && (
        <div className="flex-1 flex justify-center items-center">
          <p className="text-center text-gray-500">Žiadne objednávky</p>
        </div>
      )}
      <Accordion type="multiple">
        {orders.map(({ order, user }) => (
          <AccordionItem key={order.id} value={order.pin}>
            <AccordionTrigger>
              <div className="flex justify-between">
                <p>
                  <span>Č. obj.: {order.pin}, </span>
                  <span>{user.name ?? user.email}</span>
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Suspense
                fallback={
                  <div className="flex justify-center">
                    <Loader className="h-5 w-5 animate-spin" />
                  </div>
                }
              >
                <SummaryRow orderId={order.id} />
              </Suspense>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

async function PrintOrderListWrapper() {
  const user = await getUser();
  if (!user || !user.schoolId) return null;

  const [itemSummary, school, store] = await Promise.all([
    getItemsSummaryByStoreAndSchool(1, user.schoolId),
    getSchool(user.schoolId),
    storeRepository.getSingle({ storeId: 1 }),
  ]);

  return (
    <Suspense
      fallback={
        <Button variant="outline" className="flex-1 md:grow-0">
          <Loader className="w-5 h-5 animate-spin" />
        </Button>
      }
    >
      <PrintOrderList orders={itemSummary} store={store} school={school} />
    </Suspense>
  );
}
