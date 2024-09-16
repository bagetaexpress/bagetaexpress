import { ExtendedItem } from "@/db/controllers/item-controller";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Reservation, SchoolStore } from "@/db/schema";
import { getDate } from "@/lib/utils";
import AddToCartButton from "./add-to-cart-button";
import Link from "next/link";

export default function ItemCard({
  item: { item, store, reservation, schoolStore },
  hasOrder,
}: {
  item: ExtendedItem;
  hasOrder: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <Link className="flex-1 flex flex-col" href={`/auth/c/item/${item.id}`}>
        {item.imageUrl !== "" && item.imageUrl !== null ? (
          <Image
            src={item.imageUrl}
            width={400}
            height={400}
            alt="Obrázok produktu"
            className="rounded-md w-full rounded-b-none aspect-video object-cover object-center"
          />
        ) : null}
        <CardHeader className="py-2 flex">
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{store.name}</CardDescription>
        </CardHeader>
        <CardContent className="py-0 flex flex-col gap-1 flex-1">
          <div className="flex flex-wrap">
            {reservation && (
              <Badge variant="secondary">Možnosť rezervovať</Badge>
            )}
          </div>
          {item.description.trim() !== "" && <p>{item.description}</p>}
          <div className="flex-1 flex flex-col justify-end">
            <OrderDateShort
              schoolStore={schoolStore}
              reservation={reservation}
            />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="grid grid-cols-3 justify-center items-center">
        <p className="text-center text-xl font-bold">{item.price}€</p>
        <div className="col-span-2">
          <AddToCartButton
            item={{ item, store, reservation, schoolStore }}
            isDisabled={
              isAddToCartDisabled({ schoolStore, reservation }) || hasOrder
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
}

function isAddToCartDisabled({
  schoolStore,
  reservation,
}: {
  schoolStore: SchoolStore;
  reservation: Reservation | null;
}): boolean {
  if (getDate(schoolStore.orderClose) >= new Date()) {
    return false;
  }
  if (reservation && getDate(schoolStore.reservationClose) >= new Date()) {
    return false;
  }
  return true;
}

function OrderDateShort({
  schoolStore,
  reservation,
}: {
  schoolStore: SchoolStore;
  reservation: Reservation | null;
}) {
  const orderClose = getDate(schoolStore.orderClose);
  if (orderClose < new Date()) {
    if (!reservation) {
      return <p>Objednanie uzatvorené</p>;
    }

    const reservationClose = getDate(schoolStore.reservationClose);
    if (reservationClose < new Date()) {
      return <p>Rezervovanie uzatvorené</p>;
    }

    if (reservationClose.getDate() !== new Date().getDate()) {
      return (
        <p>
          Rezervuj do{" "}
          <span className="font-semibold text-nowrap">
            {reservationClose.toLocaleDateString("sk-SK")}
          </span>
        </p>
      );
    }

    return (
      <p>
        Rezervuj do{" "}
        <span className="font-semibold text-nowrap">
          {reservationClose.toLocaleTimeString("sk-SK")}
        </span>
      </p>
    );
  }

  if (orderClose.getDate() !== new Date().getDate()) {
    return (
      <p>
        Objednaj do{" "}
        <span className="font-semibold text-nowrap">
          {orderClose.toLocaleDateString("sk-SK")}
        </span>
      </p>
    );
  }

  return (
    <p>
      Objednaj do{" "}
      <span className="font-semibold text-nowrap">
        {orderClose.toLocaleTimeString("sk-SK")}
      </span>
    </p>
  );
}
