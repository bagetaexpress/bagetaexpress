"use client";

import { CartExtendedItem } from "@/repositories/item-repository";
import CartItemRow from "./cart-item-row";
import { useState } from "react";

export default function LocalCart({
  data: originalData,
  cartId,
}: {
  data: CartExtendedItem[];
  cartId: string;
}) {
  const [data, setData] = useState(originalData);

  return (
    <>
      <div className="grid grid-cols-1 divide-y-2 rounded-md overflow-hidden">
        {data.map((item, i) => (
          <CartItemRow
            key={item.item.id + "-" + i}
            {...item}
            addItem={() => {
              const newData = data.map((d): CartExtendedItem => {
                if (d.item.id === item.item.id) {
                  return {
                    ...d,
                    cartItem: {
                      ...d.cartItem,
                      quantity: d.cartItem.quantity + 1,
                    },
                  };
                }
                return d;
              });
              setData(newData);
            }}
            removeItem={() => {
              const newData = data.map((d) => {
                if (d.item.id === item.item.id) {
                  return {
                    ...d,
                    cartItem: {
                      ...d.cartItem,
                      quantity: d.cartItem.quantity - 1,
                    },
                  };
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
            .reduce(
              (acc, item) => acc + item.item.price * item.cartItem.quantity,
              0,
            )
            .toFixed(2)}
          €
        </p>
      </div>
    </>
  );
}
