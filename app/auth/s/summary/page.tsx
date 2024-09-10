import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getOrdersBySchoolId } from "@/db/controllers/order-controller";
import { getUser } from "@/lib/user-utils";
import SummaryRow from "./_components/summary-row";
import { redirect } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { handleFilterChange } from "./server-util";
import { Order, order } from "@/db/schema";
import PrintOrderList from "./_components/print-order-list";
import { getSchool } from "@/db/controllers/school-controller";
import { getOrderItemsByStoreAndSchool } from "@/db/controllers/item-controller";
import { getStore } from "@/db/controllers/store-controller";

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user || !user.schoolId) return null;
  const filter = (searchParams.filter ?? "ordered") as Order["status"];
  const orders = await getOrdersBySchoolId(user.schoolId, filter);

  const currentOrders = await getOrderItemsByStoreAndSchool(1, user.schoolId);
  const school = await getSchool(user.schoolId);
  const store = await getStore(1);

  return (
    <div className=" relative min-h-full">
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
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <form action={handleFilterChange} className="flex py-2 gap-2">
          <Select name="filter" defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ordered" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ordered">Aktuálne</SelectItem>
              <SelectItem value="unpicked">Nevyzdvihnuté</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="icon">
            <Search />
          </Button>
        </form>
        <PrintOrderList orders={currentOrders} store={store} school={school} />
      </div>
      <Accordion type="multiple">
        {orders.length === 0 && (
          <div className="text-center text-gray-500">Žiadne objednávky</div>
        )}
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
              <SummaryRow orderId={order.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
