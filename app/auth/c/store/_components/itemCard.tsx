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
import { getDate, getNewDate } from "@/lib/utils";
import AddToCartButton from "./add-to-cart-button";
import Link from "next/link";
import { ExtendedItem } from "@/repositories/item-repository";

export default function ItemCard({
  item: { item, store, reservation, schoolStore },
  hasOrder,
}: {
  item: ExtendedItem;
  hasOrder: boolean;
}) {
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link
        prefetch={false}
        className="flex-1 flex flex-col"
        href={`/auth/c/item/${item.id}`}
      >
        <div className="relative w-full rounded-md rounded-b-none overflow-hidden">
          {item.imageUrl !== "" && item.imageUrl !== null ? (
            <Image
              src={item.imageUrl}
              width={400}
              height={400}
              alt={item.name}
              className="w-full aspect-video object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-4xl font-bold">
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute left-2 top-2">
            <Badge variant="default" className="text-md">{item.price}€</Badge>
          </div>
        </div>
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
      <CardFooter className="pt-2">
        <div className="w-full">
          <AddToCartButton
            item={{ item, reservation, schoolStore }}
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
  if (getDate(schoolStore.orderClose) >= getNewDate()) {
    return false;
  }
  if (reservation && getDate(schoolStore.reservationClose) >= getNewDate()) {
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
  if (orderClose < getNewDate()) {
    if (!reservation) {
      return <p>Objednanie uzatvorené</p>;
    }

    const reservationClose = getDate(schoolStore.reservationClose);
    if (reservationClose < getNewDate()) {
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
