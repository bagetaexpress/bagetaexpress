"use client";

import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/itemController";
import { School, Store } from "@/db/schema";
import { TableProperties } from "lucide-react";
import { useRef } from "react";

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
                    table {
                      border-collapse: collapse;
                      width: 100%;
                    }
                    th, td {
                      border: 2px solid black;
                      border-collapse: collapse;
                      border-color: #000000;
                      padding: 8px;
                      text-align: center;
                    }
                    tr:nth-child(even) {
                      background-color: 'red';
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
        <TableProperties />
      </Button>
      <div className="hidden">
        <div
          ref={toPrintRef}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h1>{store.name}</h1>
          <div>
            <p style={{ fontWeight: "bold" }}>Odoberateľ:</p>
            <h3>{school.name}</h3>
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
                Spolu: {orders.reduce((acc, { quantity }) => acc + quantity, 0)}
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
