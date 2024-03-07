"use client";

import { createOrderFromCart } from "@/lib/orderUtils";
import { Button } from "../../../../../components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "../../../../../components/ui/drawer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Item } from "@/db/schema";
import { getCartItems } from "@/lib/cartUtils";

interface ICheckout {
  items: {
    item: Item;
    quantity: number;
  }[];
  cartId: string;
  orderClose: Date;
}

export default function Cheackout({
  items: defaultItems,
  cartId,
  orderClose,
}: ICheckout) {
  const [items, setItems] = useState(defaultItems);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderCreateError, setOrderCreateError] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    if (orderClose < new Date()) {
      router.refresh();
      return;
    }
    setIsCreatingOrder(true);
    setOrderCreateError(false);

    try {
      await createOrderFromCart(cartId);
    } catch (error) {
      console.log(error);
      setOrderCreateError(true);
      setIsCreatingOrder(false);
      return;
    }
    router.push("/auth/c/order");
    setIsCreatingOrder(false);
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
        <Button className="flex-1 md:max-w-fit">Objedať</Button>
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
                    {item.quantity} x {item.item.price}€
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between py-4">
              <p className="font-semibold text-lg">Spolu</p>
              <p className="font-semibold text-xl">
                {items
                  .reduce(
                    (acc, item) => acc + item.item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
                €
              </p>
            </div>
            {orderCreateError && (
              <p className="text-red-500 text-center">
                Nastala chyba pri vytváraní objednávky
              </p>
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
                Vytváranie objednávky...
              </Button>
            ) : (
              <Button
                disabled={isCreatingOrder || !isLoaded}
                onClick={handleCheckout}
              >
                Objedať
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
