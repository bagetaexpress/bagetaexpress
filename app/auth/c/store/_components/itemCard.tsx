"use client";

import { ExtendedItem, Item } from "@/db/controllers/itemController";
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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function ItemCard({
  item: { item, allergens = [], ingredients = [] },
  disabled,
}: {
  item: ExtendedItem;
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
        <CardContent className=" text-xs">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex flex-wrap">
                  <p className="font-semibold mr-1">Allergens:</p>
                  <p className="italic">
                    {allergens.map((a) => a.id).join(", ")}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="italic">
                  {allergens.map((a) => a.name).join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex flex-wrap">
            <p className="font-semibold mr-1">Ingredients:</p>
            <p>{ingredients.map((i) => i.name).join(", ")}</p>
          </div>
        </CardContent>
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
