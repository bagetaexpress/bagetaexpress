"use client";

import { ExtendedItem } from "@/db/controllers/itemController";
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
import Image from "next/image";

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
    await addToCart(item.id);
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
          <div className="flex justify-center mb-2">
            <Image
              src={item.imageUrl}
              width={200}
              height={200}
              alt="Obrázok produktu"
              className="rounded-md"
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex flex-wrap">
                  <p className="font-semibold mr-1">Alergény:</p>
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
            <p className="font-semibold mr-1">Obsahuje:</p>
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
              {isAdding ? "Pridáva sa..." : "Pridať do košíka"}
            </Button>
          </form>
        </CardFooter>
      </Card>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Pridané do košíka!</DrawerTitle>
            <DrawerDescription>{item.name}</DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center mb-2">
            <Image
              src={item.imageUrl}
              width={250}
              height={250}
              alt="Obrázok produktu"
              className="rounded-md"
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Pokračovať ďalej</Button>
            </DrawerClose>
            <a href="/auth/c/cart" className="flex">
              <Button disabled={isAdding} className="flex-1">
                Prejsť do košíka
              </Button>
            </a>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
