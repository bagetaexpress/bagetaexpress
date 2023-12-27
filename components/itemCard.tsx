"use client";

import { Item } from "@/db/controllers/itemController";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import addToCart from "@/lib/cart/addToCart";

export default function ItemCard({ item }: { item: Item }) {
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
              onSubmit={(e) => {
                e.preventDefault();
                addToCart(item.id, 1);
              }}
            >
              <DrawerTrigger asChild>
                <Button type="submit">Add to cart</Button>
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
              <div className="grid grid-cols-2 devide-x gap-2">
                <DrawerClose className="flex" asChild>
                  <Button className="flex-1" variant="outline">
                    Continue shopping
                  </Button>
                </DrawerClose>
                <a href="/auth/cart">
                  <Button>View cart</Button>
                </a>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
