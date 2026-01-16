"use client";

import { CartExtendedItem } from "@/repositories/item-repository";
import CartItemRow from "./cart-item-row";
import { useState, useMemo } from "react";
import Cheackout from "./checkout";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function LocalCart({
  data: originalData,
  cartId,
}: {
  data: CartExtendedItem[];
  cartId: string;
}) {
  const [data, setData] = useState(originalData);

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = data.reduce((acc, item) => acc + item.cartItem.quantity, 0);
    const totalPrice = data.reduce(
      (acc, item) => acc + item.item.price * item.cartItem.quantity,
      0
    );
    return { totalItems, totalPrice };
  }, [data]);

  return (
    <>
      {/* Items List */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="divide-y divide-border/50">
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
      </Card>

      {/* Desktop Summary */}
      <Card className="hidden md:block mt-4 p-4 border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "položka" : totalItems < 5 ? "položky" : "položiek"}
              </p>
              <p className="text-2xl font-bold">{totalPrice.toFixed(2)}€</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Mobile Sticky Checkout Bar */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-lg">
        <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "položka" : totalItems < 5 ? "položky" : "položiek"}
            </p>
            <p className="font-bold text-xl">{totalPrice.toFixed(2)}€</p>
          </div>
          <div className="flex-1">
            <Cheackout items={data} cartId={cartId} />
          </div>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>
    </>
  );
}
