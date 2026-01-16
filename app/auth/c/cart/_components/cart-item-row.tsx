"use client";

import { Badge } from "@/components/ui/badge";
import { CartExtendedItem } from "@/repositories/item-repository";
import { saveUpdateCartItem } from "@/lib/cart-utils";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function CartItemRow({
  cartId,
  addItem,
  removeItem,
  ...props
}: CartExtendedItem & {
  cartId: string;
  addItem: () => void;
  removeItem: () => void;
}) {
  async function handleDescrease() {
    removeItem();
    await saveUpdateCartItem(
      cartId,
      props.item.id,
      props.cartItem.quantity - 1,
    );
  }

  async function handleIncrease() {
    addItem();
    await saveUpdateCartItem(
      cartId,
      props.item.id,
      props.cartItem.quantity + 1,
    );
  }

  const isInvalid = useMemo(() => {
    if (
      new Date(props.schoolStore.orderClose) < new Date() &&
      !props.reservation
    ) {
      return true;
    }

    if (
      props.reservation &&
      new Date(props.schoolStore.reservationClose) < new Date()
    ) {
      return true;
    }

    if (
      props.reservation &&
      new Date(props.schoolStore.orderClose) < new Date() &&
      new Date(props.schoolStore.reservationClose) >= new Date() &&
      props.reservation.remaining < props.cartItem.quantity
    ) {
      return true;
    }
    return false;
  }, [props.reservation, props.schoolStore, props.cartItem]);

  if (props.cartItem.quantity <= 0) {
    return null;
  }

  const itemTotal = props.item.price * props.cartItem.quantity;

  return (
    <div
      className={cn(
        "flex gap-4 p-4 transition-colors",
        isInvalid && "bg-red-50 dark:bg-red-950/20"
      )}
    >
      {/* Image */}
      <div className="flex-shrink-0">
        {props.item.imageUrl != null && props.item.imageUrl != "" ? (
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted">
            <Image
              src={props.item.imageUrl}
              fill
              alt={props.item.name}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary/30">
              {props.item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-base leading-tight line-clamp-1">
              {props.item.name}
            </h3>
            <p className="text-sm text-muted-foreground">{props.store.name}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-lg">{itemTotal.toFixed(2)}€</p>
            {props.cartItem.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {props.item.price.toFixed(2)}€ / ks
              </p>
            )}
          </div>
        </div>

        {/* Badges */}
        <CartBadges {...props} />

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDescrease}
            >
              {props.cartItem.quantity === 1 ? (
                <Trash2 className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
            </Button>
            <span className="w-8 text-center font-semibold text-sm">
              {props.cartItem.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleIncrease}
              disabled={props.cartItem.quantity >= 5}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartBadges({ reservation, schoolStore, cartItem }: CartExtendedItem) {
  const isOrderClosed = useMemo(
    () => new Date(schoolStore.orderClose) < new Date(),
    [schoolStore.orderClose],
  );
  const isReservationClosed = useMemo(
    () => new Date(schoolStore.reservationClose) < new Date(),
    [schoolStore.reservationClose],
  );

  const badges = [];

  if (!reservation && isOrderClosed) {
    badges.push(
      <Badge key="order-closed" variant="destructive" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        Objednávky uzavreté
      </Badge>
    );
  }

  if (reservation && isReservationClosed) {
    badges.push(
      <Badge key="reservation-closed" variant="destructive" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        Rezervácie uzavreté
      </Badge>
    );
  }

  if (reservation && isOrderClosed && !isReservationClosed) {
    badges.push(
      <Badge key="reservation" variant="secondary">
        Rezervácia
      </Badge>
    );
    badges.push(
      <Badge key="stock" variant="outline" className="text-xs">
        Skladom {reservation.remaining} ks
      </Badge>
    );
  }

  if (
    reservation &&
    isOrderClosed &&
    !isReservationClosed &&
    cartItem.quantity > reservation.remaining
  ) {
    badges.push(
      <Badge key="insufficient" variant="destructive" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        Nedostatok skladom
      </Badge>
    );
  }

  if (badges.length === 0) return null;

  return <div className="flex flex-wrap gap-1.5 mt-2">{badges}</div>;
}
