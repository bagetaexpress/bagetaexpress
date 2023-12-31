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

export default function ItemCard({
  item,
  disabled,
}: {
  item: Item;
  disabled: boolean;
}) {
  return (
    <div>
      <Drawer>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex gap-2 justify-between">
            <p className="font-semibold text-lg">{item.price}€</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await addToCart(item.id, 1);
              }}
            >
              <DrawerTrigger asChild>
                <Button disabled={disabled} type="submit">
                  Add to cart
                </Button>
              </DrawerTrigger>
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
                <Button className="flex-1">View cart</Button>
              </a>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
