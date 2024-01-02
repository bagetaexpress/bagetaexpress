"use client";

import { Item } from "@/db/controllers/itemController";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../../../../../components/ui/drawer";
import { addToCart } from "@/lib/cartUtils";
import { FormEvent, useRef, useState } from "react";

export default function ItemCard({
  item,
  disabled,
}: {
  item: Item;
  disabled: boolean;
}) {
  const drawerBtnRef = useRef<HTMLButtonElement | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsAdding(true);
    await addToCart(item.id, 1);
    drawerBtnRef.current?.click();
    setIsAdding(false);
  }

  return (
    <Drawer>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex gap-2 justify-between">
          <p className="font-semibold text-lg">{item.price}€</p>
          <form onSubmit={onSubmit}>
            <DrawerTrigger
              ref={drawerBtnRef}
              className="hidden"
            ></DrawerTrigger>
            <Button disabled={disabled || isAdding} type="submit">
              {isAdding ? "Adding..." : "Add to cart"}
            </Button>
          </form>
        </CardFooter>
      </Card>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{item.name} added to cart!</DrawerTitle>
            <DrawerDescription>Want to order</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Continue shopping</Button>
            </DrawerClose>
            <a href="/auth/c/cart" className="flex">
              <Button disabled={isAdding} className="flex-1">
                View cart
              </Button>
            </a>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
