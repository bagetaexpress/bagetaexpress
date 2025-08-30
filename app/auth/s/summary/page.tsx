import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Loader, Search, Inbox, Clock } from "lucide-react";
import { handleFilterChange } from "./server-util";
import { Order } from "@/db/schema";
import PrintOrderList from "@/components/print-order-list";
import { Suspense } from "react";
import ReservedItems from "./_components/reserved-items";
import storeRepository from "@/repositories/store-repository";
import schoolRepository from "@/repositories/school-repository";
import orderRepository from "@/repositories/order-repository";
import itemRepository from "@/repositories/item-repository";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { offsetDateToSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "bageta.express | Zhrnutie objednávok",
};

export default async function SummaryPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
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

  const orders = await orderRepository.getMany({
    schoolId: user.schoolId,
    status: [filter],
  });

  console.log(orders);

  return (
    <>
      {orders.length === 0 && (
        <div className="flex-1 flex flex-col justify-center items-center gap-3 py-10 text-center text-gray-500">
          <Inbox className="h-10 w-10" />
          <div>
            <p className="font-medium">Žiadne objednávky</p>
            <p className="text-sm text-muted-foreground">Skúste zmeniť filtrovanie alebo sa vráťte neskôr.</p>
          </div>
        </div>
      )}
      {orders.length > 0 && (
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
          <p>
            Počet objednávok: <span className="font-medium text-foreground">{orders.length}</span>
          </p>
        </div>
      )}
      <Accordion type="multiple">
        {orders.sort((a, b) => new Date(b.order.updatedAt) > new Date(a.order.updatedAt) ? 1 : -1).map(({ order, user }) => (
          <AccordionItem key={order.id} value={order.pin}>
            <AccordionTrigger>
              <div className="flex w-full items-center justify-between gap-4 pr-2">
                <div className="min-w-0">
                  <p className="truncate">
                    <span className="text-xs text-muted-foreground mr-1">Č. obj.</span>
                    <span className="font-medium">{order.pin}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="truncate align-middle">{user.name ?? user.email}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(offsetDateToSk(new Date(order.updatedAt)), "d.M.y HH:mm")}</span>
                  </div>
                </div>
                <div className="hidden xs:block">
                  <Suspense fallback={<div className="text-sm text-muted-foreground">…</div>}>
                    <OrderTriggerMeta orderId={order.id} orderStatus={order.status} />
                  </Suspense>
                </div>
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
                <SummaryRow orderId={order.id} orderStatus={order.status} />
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
    itemRepository.getSummary({
      storeId: 1,
      schoolId: user.schoolId,
    }),
    schoolRepository.getSingle({ schoolId: user.schoolId }),
    storeRepository.getSingle({ storeId: 1 }),
  ]);

  if (!itemSummary) return null;
  if (!school) return null;
  if (!store) return null;

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

async function OrderTriggerMeta({ orderId, orderStatus }: { orderId: number, orderStatus: Order["status"] }) {
  const items = await itemRepository.getManyWithQuantity({ orderId, orderStatus: [orderStatus] });
  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const total = items.reduce((acc, it) => acc + it.item.price * it.quantity, 0);

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Badge variant="outline">{itemCount} polož.</Badge>
      <Badge>{total.toFixed(2)}€</Badge>
    </div>
  );
}
