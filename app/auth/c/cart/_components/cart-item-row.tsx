// "use client";

import { Badge } from "@/components/ui/badge";
import { CartExtendedItem } from "@/repositories/item-repository";
import { saveUpdateCartItem } from "@/lib/cart-utils";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

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

  return (
    <div
      className={`flex justify-between p-2 items-center ${isInvalid ? "bg-red-200 bg-opacity-50" : ""}`}
    >
      <div className="flex gap-1 items-center">
        {props.item.imageUrl != null && props.item.imageUrl != "" ? (
          <Image
            src={props.item.imageUrl}
            width={150}
            height={150}
            alt="Obrázok produktu"
            className="rounded-md max-w-24 object-contain"
          />
        ) : null}
        <div>
          <h3 className="font-semibold text-lg">{props.item.name}</h3>
          <p className="font-light text-sm">{props.store.name}</p>
          <CartBadges {...props} />
        </div>
      </div>
      <div className="flex justify-center text-center gap-2 flex-col">
        <p className=" font-bold text-xl">{props.item.price} €</p>
        <div className="flex items-center">
          <button
            onClick={handleDescrease}
            type="submit"
            className="aspect-square rounded-md p-1"
          >
            {props.cartItem.quantity === 1 ? (
              <Trash className="w-5 h-5" />
            ) : (
              <Minus className="w-5 h-5" />
            )}
          </button>
          <p className="text-xl text-center w-[2ch] px-2">
            {props.cartItem.quantity}
          </p>
          <button
            type="submit"
            onClick={handleIncrease}
            disabled={props.cartItem.quantity >= 5}
            className={cn(
              "rounded-md p-1 aspect-square",
              props.cartItem.quantity >= 5 && "opacity-50",
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
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

  return (
    <div className="flex flex-wrap gap-1">
      {!reservation && isOrderClosed && (
        <Badge variant="destructive">Objednávky uzavreté</Badge>
      )}
      {reservation && isReservationClosed && (
        <Badge variant="destructive">Rezervácie uzavreté</Badge>
      )}
      {reservation && isOrderClosed && !isReservationClosed && (
        <Badge variant="secondary">Rezervácia</Badge>
      )}
      {reservation && isOrderClosed && (
        <Badge variant="secondary">Skladom {reservation.remaining}ks.</Badge>
      )}
      {reservation &&
        isOrderClosed &&
        cartItem.quantity > reservation.remaining && (
          <Badge variant="destructive">Nedostatok skladom</Badge>
        )}
    </div>
  );
}
