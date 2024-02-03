"use client";

import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/itemController";
import { Store } from "@/db/schema";
import { Printer } from "lucide-react";
import { useRef } from "react";

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

  return (
    <>
      <Button
        variant="outline"
        type="button"
        size="icon"
        className="aspect-square"
        onClick={() => {
          if (toPrintRef.current) {
            const printWindow = window.open(
              "",
              "PRINT",
              "height=600,width=800"
            );

            if (printWindow) {
              printWindow.document.write(`
              <html>
                <head>
                  <style>
                    *{
                      font-family: 'Roboto', sans-serif;
                      padding:0;
                      margin:0;
                    }
                  </style>
                </head>
                <body>
                  ${toPrintRef.current.outerHTML}
                </body>
              </html>`);

              printWindow.document.close(); // necessary for IE >= 10
              printWindow.focus(); // necessary for IE >= 10*/

              printWindow.print();
              printWindow.close();
            }
          }
        }}
      >
        <Printer />
      </Button>
      <div className="hidden">
        <div
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
