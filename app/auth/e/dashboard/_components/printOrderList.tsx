"use client";

import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/itemController";
import { School, Store } from "@/db/schema";
import { TableProperties } from "lucide-react";
import { useCallback, useRef } from "react";

interface IProps {
  orders: Array<
    {
      quantity: number;
    } & ExtendedItem
  >;
  store: Store;
  school: School;
}

export default function PrintOrderList({ orders, store, school }: IProps) {
  const toPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    (async () => {
      if (toPrintRef.current) {
        const originalContents = Array.from(document.body.childNodes);
        const cloned = toPrintRef.current.cloneNode(true);

        document.body.replaceChildren(cloned);

        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
        window.print();
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
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
        <TableProperties />
      </Button>
      <div className="hidden">
        <div
          // className="printable"
          ref={toPrintRef}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h1 className="font-bold text-4xl">{store.name}</h1>
          <div>
            <p className=" font-bold text-sm">Odoberateľ:</p>
            <h3 className=" text-2xl">{school.name}</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th rowSpan={2} scope="col">
                  p.č.
                </th>
                <th rowSpan={2} scope="col">
                  Názov a druh
                </th>
                <th rowSpan={2} scope="col">
                  Množstvo
                </th>
                <th colSpan={2} scope="col">
                  DPH
                </th>
                <th rowSpan={2} scope="col">
                  DPH
                </th>
              </tr>
              <tr>
                <th scope="col">
                  Jednotkova
                  <br />
                  cena
                </th>
                <th scope="col">Spolu</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i}>
                  <td scope="row">{i + 1}</td>
                  <td style={{ textAlign: "left" }}>{order.item.name}</td>
                  <td>{order.quantity}ks</td>
                  <td>{order.item.price}</td>
                  <td>
                    {(parseFloat(order.item.price) * order.quantity).toFixed(2)}
                  </td>
                  <td>20%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div>
              <p>
                Spolu:{" "}
                {orders.reduce((acc, { quantity }) => acc + +quantity, 0)}
                ks
              </p>
            </div>
            <div>
              <p>
                Celková suma:
                {orders
                  .reduce(
                    (acc, order) =>
                      acc + parseFloat(order.item.price) * order.quantity,
                    0
                  )
                  .toFixed(2)}
                €
              </p>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                gap: "1rem",
              }}
            >
              <p>Kontroloval:</p>
              <p>Podpis skladníka:</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <p
                style={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  borderTop: "2px solid black",
                }}
              >
                Dátum, podpis a pečia
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
