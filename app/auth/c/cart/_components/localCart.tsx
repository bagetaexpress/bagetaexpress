"use client";

import { Item } from "@/db/schema";
import CartItemRow from "./cartItemRow";
import { useState } from "react";

interface LocalCartProps {
  data: {
    item: Item;
    quantity: number;
  }[];
  cartId: string;
}

export default function LocalCart({
  data: originalData,
  cartId,
}: LocalCartProps) {
  const [data, setData] = useState(originalData);

  return (
    <div>
      <h1 className="text-2xl font-semibold pt-2">Košík</h1>
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
      <div className="flex justify-between py-4">
        <p className="font-semibold text-lg">Spolu</p>
        <p className="font-semibold text-xl">
          {data
            .reduce((acc, item) => acc + item.item.price * item.quantity, 0)
            .toFixed(2)}
          €
        </p>
      </div>
    </div>
  );
}
