"use client";

import { Item } from "@/db/schema";
import CartItemRow from "./cartItemRow";
import { use, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import useFreeItems from "@/lib/hooks/useFreeItems";

interface LocalCartProps {
  data: {
    item: Item;
    quantity: number;
  }[];
  cartId: string;
  totalOrdered: number;
}

export default function LocalCart({
  data: originalData,
  cartId,
  totalOrdered,
}: LocalCartProps) {
  const [data, setData] = useState(originalData);
  const { tillNextFree, freeItemsNum, totalPrice, freeItemsPrice } =
    useFreeItems({ data, totalOrdered });

  return (
    <div>
      <h1 className="text-2xl font-semibold pt-2">Košík</h1>
      <p>
        Už len {tillNextFree}{" "}
        {{
          1: "bageta",
          2: "bagety",
          3: "bagety",
          4: "bagety",
          5: "bagiet",
        }[tillNextFree] ?? "bagiet"}{" "}
        a {freeItemsNum == 0 ? "jednu" : "ďalšiu"} máš zadarmo
      </p>
      <div className="grid grid-cols-1 divide-y-2">
        {data.map((item, i) => (
          <CartItemRow
            key={item.item.id + "-" + i}
            {...item.item}
            quantity={item.quantity}
            addItem={() => {
              const newData = data.map((d) => {
                if (d.item.id === item.item.id) {
                  return { ...d, quantity: d.quantity + 1 };
                }
                return d;
              });
              setData(newData);
            }}
            removeItem={() => {
              const newData = data.map((d) => {
                if (d.item.id === item.item.id) {
                  return { ...d, quantity: d.quantity - 1 };
                }
                return d;
              });
              setData(newData);
            }}
            cartId={cartId}
          />
        ))}
      </div>
      <div className="flex justify-between py-3">
        <p className="font-semibold text-lg">Spolu</p>
        <p className="font-semibold text-xl">{totalPrice.toFixed(2)}€</p>
      </div>
      <Separator />
      <div className="flex justify-between py-3">
        <p className="font-semibold text-lg">Zľava</p>
        <p className="font-semibold text-xl">{freeItemsPrice.toFixed(2)}€</p>
      </div>
      <Separator />
      <div className="flex justify-between py-3">
        <p className="font-semibold text-lg">Celkom</p>
        <p className="font-semibold text-xl">
          {(totalPrice - freeItemsPrice).toFixed(2)}€
        </p>
      </div>
    </div>
  );
}
