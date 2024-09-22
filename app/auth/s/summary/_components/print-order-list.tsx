"use client";
"use client";

import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/item-controller";
import { School, Store } from "@/db/schema";
import { TableProperties } from "lucide-react";
import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

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
  const handlePrint = useReactToPrint({
    content: useCallback(() => toPrintRef.current, []),
  });

  function onPrintPress() {
    if (!toPrintRef.current) {
      toast.error("Tlač sa nepodarila", {
        description: "Obnovte stránku a skúste znova alebo kontaktujte podporu",
        action: { label: "Obnoviť stránku", onClick: () => location.reload() },
      });
      return;
    }
    handlePrint();
    return;
  }

  return (
    <>
      <Button
        variant="outline"
        type="button"
        className="gap-2"
        onClick={onPrintPress}
      >
        Zhrnutie
        <TableProperties />
      </Button>
      <div className="hidden">
        <div ref={toPrintRef} id="print-order-list">
          <style>
            {`
              #print-order-list table {
                border-collapse: collapse;
                width: 100%;
              }

              #print-order-list th,
              #print-order-list td {
                border: 2px solid black;
                border-collapse: collapse;
                border-color: #000000;
                padding: 8px;
                text-align: center;
              }

              #print-order-list th {
                background-color: #f2f2f2;
              }

              #print-order-list tr:nth-child(even) {
                background-color: #f2f2f2;
              }
          `}
          </style>
          <div
            style={{
              fontFamily: "Geist, Arial, sans-serif",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "1rem",
            }}
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
                    <td>{(order.item.price * order.quantity).toFixed(2)}</td>
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
                      (acc, order) => acc + order.item.price * order.quantity,
                      0,
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
      </div>
    </>
  );
}
