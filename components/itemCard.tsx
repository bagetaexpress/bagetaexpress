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

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div>
      <Drawer>
        <Card className="w-fit h-fit">
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex gap-2 justify-between">
            <p>{item.price}</p>
            <DrawerTrigger>
              <Button>Buy</Button>
            </DrawerTrigger>
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
                <DrawerClose className="flex">
                  <Button className="flex-1" variant="outline">
                    Continue shopping
                  </Button>
                </DrawerClose>
                <Button>View cart</Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
