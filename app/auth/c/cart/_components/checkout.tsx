"use client";

import { createOrderFromCart } from "@/lib/order-utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";
import { getCartItems } from "@/lib/cart-utils";
import { CartExtendedItem } from "@/repositories/item-repository";

interface ICheckout {
  items: CartExtendedItem[];
  cartId: string;
}

export default function Cheackout({ items: defaultItems, cartId }: ICheckout) {
  const [items, setItems] = useState(defaultItems);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderCreateError, setOrderCreateError] = useState<{
    message: string;
  } | null>();
  const router = useRouter();

  async function handleCheckout() {
    setIsCreatingOrder(true);
    setOrderCreateError(null);

    try {
      const { error } = await createOrderFromCart();
      if (error) {
        setOrderCreateError({
          message: error,
        });
        setIsCreatingOrder(false);
        return;
      }
    } catch (error) {
      console.log(error);
      setOrderCreateError({
        message: "Nastala chyba pri vytváraní objednávky",
      });
      setIsCreatingOrder(false);
      return;
    }

    setIsCreatingOrder(false);
    router.push("/auth/c/order");
  }

  async function fetchCart() {
    const data = await getCartItems(cartId);
    if (data.length === 0) {
      router.refresh();
      return;
    }
    setItems(data);
    setIsLoaded(true);
  }

  return (
    <Drawer
      onClose={() => {
        setIsLoaded(false);
      }}
    >
      <DrawerTrigger onClick={fetchCart} asChild>
        <Button className="flex-1 md:max-w-fit">Objedať / Rezervovať</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Zhrnutie objednávky</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <div className="grid grid-cols-1 divide-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between p-1">
                  <p>{item.item.name}</p>
                  <p>
                    {item.cartItem.quantity} x {item.item.price}€
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between py-4">
              <p className="font-semibold text-lg">Spolu</p>
              <p className="font-semibold text-xl">
                {items
                  .reduce(
                    (acc, item) =>
                      acc + item.item.price * item.cartItem.quantity,
                    0,
                  )
                  .toFixed(2)}
                €
              </p>
            </div>
            {orderCreateError && (
              <p className="text-red-500">{orderCreateError.message}</p>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Zrušiť</Button>
            </DrawerClose>
            {isCreatingOrder ? (
              <Button
                disabled={isCreatingOrder || !isLoaded}
                className="flex-1"
              >
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Vytváranie ...
              </Button>
            ) : (
              <Button
                disabled={isCreatingOrder || !isLoaded}
                onClick={handleCheckout}
              >
                Objednať / Rezervovať
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
