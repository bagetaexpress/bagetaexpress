"use client";

import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/itemController";
import { School, Store } from "@/db/schema";
import { TableProperties } from "lucide-react";
import { useCallback, useRef } from "react";
import ReactToPrint from "react-to-print";

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
  // const toPrintRef = useRef<HTMLDivElement>(null);
  const toPrintRef = useRef<HTMLDivElement | null>(null);

  function isMobile() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor);
    return check;
  }

  async function handlePrint() {
    if (!toPrintRef.current) return;

    const currState = Array.from(window.document.body.childNodes);
    const printContent = toPrintRef.current.cloneNode(true);

    window.document.body.replaceChildren(printContent);
    window.print();

    if (isMobile()) {
      window.addEventListener(
        "focus",
        () => {
          window.document.body.replaceChildren(...currState);
        },
        { once: true }
      );
    } else {
      window.document.body.replaceChildren(...currState);
    }
  }

  return (
    <>
      {/* <ReactToPrint
        content={() => toPrintRef.current as HTMLElement}
        documentTitle="Objednávkový list"
        removeAfterPrint
        trigger={() => (
          <Button
            variant="outline"
            type="button"
            size="icon"
            className="aspect-square"
          >
            <TableProperties />
          </Button>
        )}
      /> */}
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
          ref={toPrintRef}
          style={{
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
