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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Loader,
  ShoppingCart,
  Plus,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ExtendedItem } from "@/repositories/item-repository";

type ItemStatus = "available" | "reservation" | "closed";

interface AddToCartButtonProps {
  item: Pick<ExtendedItem, "item" | "reservation" | "schoolStore">;
  isDisabled: boolean;
  status?: ItemStatus;
}

export default function AddToCartButton({
  item: { item, reservation, schoolStore },
  isDisabled,
  status = "available",
}: AddToCartButtonProps) {
  const drawerBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

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

  const buttonText = status === "reservation" ? "Rezervovať" : "Do košíka";

  return (
    <div className="w-full">
      <Button
        disabled={isDisabled || isAdding}
        className="w-full h-11 font-medium"
        onClick={onSubmit}
      >
        {isAdding ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Pridáva sa...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>

      <Drawer>
        <DrawerTrigger ref={drawerBtnRef} className="hidden" />
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader className="text-center">
              {error == null ? (
                <>
                  <div className="mx-auto w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <DrawerTitle className="text-lg">
                    Pridané do košíka
                  </DrawerTitle>
                  <DrawerDescription>
                    {item.name}
                  </DrawerDescription>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <DrawerTitle className="text-xl">
                    Nepodarilo sa pridať
                  </DrawerTitle>
                  <DrawerDescription className="text-base text-red-600 dark:text-red-400">
                    {error}
                  </DrawerDescription>
                </>
              )}
            </DrawerHeader>

            {item.imageUrl !== "" && item.imageUrl !== null && error == null && (
              <div className="px-4 pb-2">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    width={400}
                    height={300}
                    alt="Obrázok produktu"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            )}

            <DrawerFooter className="gap-2">
              <Link prefetch={false} href="/auth/c/cart" className="flex">
                <Button className="flex-1 h-12 text-base font-semibold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Prejsť do košíka
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <DrawerClose asChild>
                <Button variant="outline" className="h-11">
                  Pokračovať v nákupe
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
