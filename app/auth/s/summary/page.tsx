import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getOrdersBySchoolId } from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";
import SummaryRow from "./_components/summaryRow";
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
import { handleFilterChange } from "./serverUtil";
import { Order } from "@/db/schema";

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user || !user.schoolId) return null;
  const filter = (searchParams.filter ?? "ordered") as Order["status"];
  const orders = await getOrdersBySchoolId(user.schoolId, filter);

  return (
    <div className=" relative min-h-full">
      <h1 className="text-2xl font-semibold pt-2">Zhrnutie</h1>
      <form action={handleFilterChange} className="flex py-2 gap-2">
        <Select name="filter" defaultValue={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ordered" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ordered">Aktuálne</SelectItem>
            <SelectItem value="pickedup">Prevzané</SelectItem>
            <SelectItem value="unpicked">Nevyzdvihnuté</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="icon">
          <Search />
        </Button>
      </form>
      <Accordion type="multiple">
        {orders.map((order) => (
          <AccordionItem key={order.id} value={order.pin}>
            <AccordionTrigger>
              <div className="flex justify-between">
                <span>Č. obj.: {order.pin}</span>
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
