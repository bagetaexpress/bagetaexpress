"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { addToCart } from "@/lib/cart-utils";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ExtendedItem } from "@/repositories/item-repository";

export default function AddToCartButton({
  item: { item, reservation, schoolStore },
  isDisabled,
}: {
  item: Pick<ExtendedItem, "item" | "reservation" | "schoolStore">;
  isDisabled: boolean;
}) {
  const drawerBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (new Date(schoolStore.orderClose) < new Date() && !reservation) {
      setError("Objednávky sú uzavreté");
      drawerBtnRef.current?.click();
      return;
    }
    if (reservation && new Date(schoolStore.reservationClose) < new Date()) {
      setError("Rezervácie sú uzavreté");
      drawerBtnRef.current?.click();
      return;
    }

    setIsAdding(true);
    setError(null);
    try {
      await addToCart(item.id);
    } catch (e: { message: string } | any) {
      setError(e?.message ?? "Nastala chyba");
    }
    drawerBtnRef.current?.click();
    setIsAdding(false);
  }

  return (
    <>
      {isAdding ? (
        <Button disabled={true} className="w-full">
          Pridáva sa <Loader className="w-5 h-5 ml-2 animate-spin" />
        </Button>
      ) : (
        <Button disabled={isDisabled} className="w-full" onClick={onSubmit}>
          Pridať do košíka
        </Button>
      )}
      <Drawer>
        <DrawerTrigger ref={drawerBtnRef} className="hidden" />
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                {error == null ? "Pridané do košíka!" : "Nepodarilo sa pridať!"}
              </DrawerTitle>
              <DrawerDescription>
                {error == null ? item.name : error}
              </DrawerDescription>
            </DrawerHeader>
            {item.imageUrl !== "" && item.imageUrl !== null ? (
              <div className="flex justify-center mb-2">
                <Image
                  src={item.imageUrl}
                  width={400}
                  height={400}
                  alt="Obrázok produktu"
                  className="rounded-md max-w-full"
                />
              </div>
            ) : null}
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
    </>
  );
}
