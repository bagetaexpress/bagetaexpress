"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExtendedItem } from "@/db/controllers/itemController";
import { Store, order } from "@/db/schema";
import { printComponent } from "@/lib/utils";
import { Printer } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { date } from "zod";

interface IProps {
  orders: Array<
    {
      quantity: number;
    } & ExtendedItem
  >;
  store: Store;
  orderClose: Date;
}

export default function PrintOrderLabels({
  orders,
  store,
  orderClose,
}: IProps) {
  const toPrintRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [consumptionDate, setConsumptionDate] = useState<Date>(
    new Date(orderClose.setDate(orderClose.getDate() + 2))
  );

  function handlePrint() {
    if (!toPrintRef.current) {
      toast.error("Tlač sa nepodarila", {
        description: "Obnovte stránku a skúste znova alebo kontaktujte podporu",
        action: { label: "Obnoviť stránku", onClick: () => location.reload() },
      });
      return;
    }
    void printComponent(toPrintRef.current);
  }

  return (
    <>
      <div className="hidden">
        <div ref={toPrintRef}>
          <div className="grid grid-cols-3 gap-4 p-4">
            {orders.map((order, i) => {
              const items = [];
              for (let j = 0; j < order.quantity; j++) {
                items.push(
                  <div key={i.toString() + j.toString()}>
                    {store.imageUrl !== "" && store.imageUrl !== null ? (
                      <Image
                        alt="store image"
                        width={1000}
                        height={200}
                        src={store.imageUrl}
                        className="mx-auto object-contain flex-1 max-h-[1.75cm] w-auto"
                      />
                    ) : (
                      <p className=" text-center font-bold text-[1.125rem]">
                        {store.name}
                      </p>
                    )}
                    <p className="font-bold">
                      {order.item.name} {order.item.weight}g
                    </p>
                    <p
                      // style={{ fontSize: "0.75rem", lineHeight: "0.8rem" }}
                      className="pb-0 mb-0 text-xs/[0.8rem]"
                    >
                      Zloženie:{" "}
                      {order.ingredients.map((x) => x.name).join(", ")}
                      <br />
                      Obsahuje: {order.allergens.map((x) => x.name).join(", ")}
                      <br />
                    </p>
                    <p className="text-[0.6rem]/[0.7rem]">
                      Skladujte pri teplote do 6°C
                      <br />
                      Spotrebujte do:{" "}
                      {consumptionDate.toLocaleDateString("sk-SK")}
                    </p>
                  </div>
                );
              }
              return items;
            })}
          </div>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            size="icon"
            className="aspect-square"
          >
            <Printer />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upraviť dátum</DialogTitle>
            <DialogDescription>Zmeňte dátum spotreby</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Calendar
              mode="single"
              selected={consumptionDate}
              className="rounded-md border w-fit"
              onSelect={(val) => {
                if (val == null) return;
                setConsumptionDate(val);
              }}
              initialFocus
              disabled={(date) =>
                date < new Date(new Date().setDate(new Date().getDate() - 1))
              }
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setConsumptionDate(
                  new Date(orderClose.setDate(orderClose.getDate() + 2))
                );
                setIsOpen(false);
              }}
            >
              Zrušiť
            </Button>
            <Button
              style={{ marginLeft: 0 }}
              onClick={async () => {
                if (!date) return;
                handlePrint();
                setIsOpen(false);
              }}
            >
              Vytlačiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
