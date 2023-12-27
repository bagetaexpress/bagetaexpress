"use client";

import { Button } from "./ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import { Item } from "@/db/controllers/itemController";

interface ICheckout {
  items: {
    item: Item;
    quantity: number;
  }[];
  orderId: number;
}

export default function Cheackout({ items, orderId }: ICheckout) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex-1 md:max-w-fit">Checkout</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Order summary</DrawerTitle>
            {/* <DrawerDescription></DrawerDescription> */}
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
            <Button
              onClick={() => {
                // addToCart(orderId, items);
              }}
            >
              Confirm
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
