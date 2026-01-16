"use client";

import { createOrderFromCart } from "@/lib/order-utils";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Loader,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { getCartItems } from "@/lib/cart-utils";
import { CartExtendedItem } from "@/repositories/item-repository";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ICheckout {
  items: CartExtendedItem[];
  cartId: string;
}

export default function Cheackout({ items: defaultItems, cartId }: ICheckout) {
  const [items, setItems] = useState(defaultItems);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderCreateError, setOrderCreateError] = useState<{
    message: string;
  } | null>();
  const router = useRouter();

  const totalPrice = items.reduce(
    (acc, item) => acc + item.item.price * item.cartItem.quantity,
    0
  );

  const totalItems = items.reduce(
    (acc, item) => acc + item.cartItem.quantity,
    0
  );

  async function handleCheckout() {
    setIsCreatingOrder(true);
    setOrderCreateError(null);

    try {
      const { error } = await createOrderFromCart();
      if (error) {
        setOrderCreateError({
          message: error,
        });
        setIsCreatingOrder(false);
        return;
      }
    } catch (error) {
      console.log(error);
      setOrderCreateError({
        message: "Nastala chyba pri vytváraní objednávky",
      });
      setIsCreatingOrder(false);
      return;
    }

    setIsCreatingOrder(false);
    router.push("/auth/c/order");
  }

  async function fetchCart() {
    const data = await getCartItems(cartId);
    if (data.length === 0) {
      router.refresh();
      return;
    }
    setItems(data);
    setIsLoaded(true);
  }

  return (
    <Drawer
      onClose={() => {
        setIsLoaded(false);
      }}
    >
      <DrawerTrigger onClick={fetchCart} asChild>
        <Button className="w-full h-12 font-semibold text-base shadow-sm">
          Pokračovať
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <ShoppingBag className="w-7 h-7 text-primary" />
            </div>
            <DrawerTitle className="text-xl">Zhrnutie objednávky</DrawerTitle>
            <DrawerDescription>
              Skontroluj položky pred odoslaním
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            {/* Items List */}
            <Card className="overflow-hidden border-border/50">
              <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">
                          {item.cartItem.quantity}x
                        </span>
                      </div>
                      <span className="truncate text-sm font-medium">
                        {item.item.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0 ml-3">
                      {(item.item.price * item.cartItem.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-4 py-4 bg-muted/30 border-t border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground">Celkom</p>
                  <p className="text-2xl font-bold">{totalPrice.toFixed(2)}€</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "položka"
                      : totalItems < 5
                      ? "položky"
                      : "položiek"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Error Message */}
            {orderCreateError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {orderCreateError.message}
                </p>
              </div>
            )}
          </div>

          <DrawerFooter className="gap-2">
            <Button
              disabled={isCreatingOrder || !isLoaded}
              onClick={handleCheckout}
              className={cn("h-12 text-base font-semibold", isLoaded && !isCreatingOrder && "shadow-lg")}
            >
              {isCreatingOrder ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Vytváranie objednávky...
                </>
              ) : !isLoaded ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Načítavam...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Potvrdiť objednávku
                </>
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="h-11">
                Zrušiť
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
