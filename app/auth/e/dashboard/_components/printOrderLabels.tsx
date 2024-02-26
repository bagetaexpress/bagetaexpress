"use client";

import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/itemController";
import { Store } from "@/db/schema";
import { printComponent } from "@/lib/utils";
import { Printer } from "lucide-react";
import Image from "next/image";
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

  function handlePrint() {
    if (!toPrintRef.current) return;
    void printComponent(toPrintRef.current);
  }

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
        <div ref={toPrintRef}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              padding: "1rem",
            }}
          >
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
                        style={{
                          margin: "0 auto",
                          flex: 1,
                          maxHeight: "1.75cm",
                          width: "auto",
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          fontSize: "1.125rem",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {store.name}
                      </p>
                    )}
                    <p style={{ fontWeight: "bold" }}>
                      {order.item.name} {order.item.weight}g
                    </p>
                    <p style={{ fontSize: "0.75rem", lineHeight: "0.8rem" }}>
                      Zloženie:{" "}
                      {order.ingredients.map((x) => x.name).join(", ")}
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
      </div>
    </>
  );
}
