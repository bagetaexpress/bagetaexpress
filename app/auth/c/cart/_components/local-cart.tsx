"use client";

import { CartExtendedItem } from "@/repositories/item-repository";
import CartItemRow from "./cart-item-row";
import { useState } from "react";
import Cheackout from "./checkout";

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
      <div className="grid grid-cols-1 divide-y-2 rounded-lg overflow-hidden border bg-card text-card-foreground">
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
      {/* Desktop summary */}
      <div className="hidden md:flex justify-between py-4">
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
      {/* Mobile sticky checkout bar */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Spolu</p>
            <p className="font-semibold text-lg">
              {data
                .reduce(
                  (acc, item) => acc + item.item.price * item.cartItem.quantity,
                  0,
                )
                .toFixed(2)}
              €
            </p>
          </div>
          <div className="flex-1">
            <Cheackout items={data} cartId={cartId} />
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  );
}
