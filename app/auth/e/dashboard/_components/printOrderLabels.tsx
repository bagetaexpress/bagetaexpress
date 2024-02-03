"use client";

import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/itemController";
import { Store } from "@/db/schema";
import { Printer } from "lucide-react";
import { useCallback, useRef } from "react";

interface IProps {
  orders: Array<
    {
      quantity: number;
    } & ExtendedItem
  >;
  store: Store;
}

export default function PrintOrderLabels({ orders, store }: IProps) {
  const toPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    (async () => {
      if (toPrintRef.current) {
        const originalContents = Array.from(document.body.childNodes);
        const cloned = toPrintRef.current.cloneNode(true);

        document.body.replaceChildren(cloned);

        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
        window.print();
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });

        document.body.replaceChildren(...originalContents);
      }
    })();
  }, [toPrintRef]);

  return (
    <>
      <Button
        variant="outline"
        type="button"
        size="icon"
        className="aspect-square"
        onClick={handlePrint}
      >
        <Printer />
      </Button>
      <div className="hidden">
        <div
          // className="printable"
          ref={toPrintRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}
        >
          {orders.map((order, i) => {
            const items = [];
            for (let j = 0; j < order.quantity; j++) {
              items.push(
                <div key={i.toString() + j.toString()}>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {store.name}
                  </p>
                  <p style={{ fontWeight: "bold" }}>{order.item.name}</p>
                  <p style={{ fontSize: "0.75rem" }}>
                    Zloženie: {order.ingredients.map((x) => x.name).join(", ")}
                    <br />
                    Obsahuje: {order.allergens.map((x) => x.name).join(", ")}
                    <br />
                    Skladujte pri teplote do 6°C
                  </p>
                </div>
              );
            }
            return items;
          })}
        </div>
      </div>
    </>
  );
}
