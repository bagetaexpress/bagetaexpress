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
import { Item } from "@/db/controllers/itemController";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";

interface ICheckout {
  items: {
    item: Item;
    quantity: number;
  }[];
  cartId: number;
}

export default function Cheackout({ items, cartId }: ICheckout) {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setIsCreatingOrder(true);
    await createOrderFromCart(cartId);
    router.push("/auth/c/order");
    setIsCreatingOrder(false);
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex-1 md:max-w-fit">Checkout</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Order summary</DrawerTitle>
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
              <p className="font-semibold text-lg">Total</p>
              <p className="font-semibold text-xl">
                {items
                  .reduce(
                    (acc, item) =>
                      acc + parseFloat(item.item.price) * item.quantity,
                    0
                  )
                  .toFixed(2)}
                €
              </p>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            {isCreatingOrder ? (
              <Button disabled={isCreatingOrder} className="flex-1">
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Creating order...
              </Button>
            ) : (
              <Button disabled={isCreatingOrder} onClick={handleCheckout}>
                Confirm
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
