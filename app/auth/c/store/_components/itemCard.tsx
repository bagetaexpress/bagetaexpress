"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Reservation, SchoolStore } from "@/db/schema";
import AddToCartButton from "./add-to-cart-button";
import Link from "next/link";
import { ExtendedItem } from "@/repositories/item-repository";
import { offsetDateToSk } from "@/lib/utils";
import { Clock, CalendarClock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ItemStatus = "available" | "reservation" | "closed";

interface ItemCardProps {
  item: ExtendedItem;
  hasOrder: boolean;
  status?: ItemStatus;
}

export default function ItemCard({
  item: { item, store, reservation, schoolStore },
  hasOrder,
  status: propStatus,
}: ItemCardProps) {
  // Calculate status if not provided
  const status: ItemStatus = propStatus ?? (() => {
    const orderClosed = new Date(schoolStore.orderClose) < new Date();
    const reservationClosed = new Date(schoolStore.reservationClose) < new Date();
    if (!orderClosed) return "available";
    if (reservation && !reservationClosed) return "reservation";
    return "closed";
  })();

  const statusConfig = {
    available: {
      badge: "Dostupné",
      badgeClass: "bg-green-500/90 text-white border-0",
      icon: <CheckCircle2 className="w-3 h-3" />,
      cardClass: "",
    },
    reservation: {
      badge: "Len rezervácia",
      badgeClass: "bg-amber-500/90 text-white border-0",
      icon: <CalendarClock className="w-3 h-3" />,
      cardClass: "",
    },
    closed: {
      badge: "Nedostupné",
      badgeClass: "bg-muted text-muted-foreground border-0",
      icon: <XCircle className="w-3 h-3" />,
      cardClass: "opacity-60",
    },
  };

  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden transition-shadow duration-200",
        "hover:shadow-md",
        "border-border/50",
        config.cardClass
      )}
    >
      <Link
        prefetch={false}
        className="flex-1 flex flex-col"
        href={`/auth/c/item/${item.id}`}
      >
        {/* Image Section */}
        <div className="relative w-full overflow-hidden">
          {item.imageUrl !== "" && item.imageUrl !== null ? (
            <Image
              src={item.imageUrl}
              width={400}
              height={400}
              alt={item.name}
              className="w-full aspect-[4/3] object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
              <span className="text-5xl font-bold text-primary/30">
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Price Badge */}
          <div className="absolute left-3 top-3">
            <Badge className="text-base font-bold px-3 py-1 bg-background/95 text-foreground backdrop-blur-sm border-0 shadow-lg">
              {item.price.toFixed(2)}€
            </Badge>
          </div>

          {/* Status Badge */}
          <div className="absolute right-3 top-3">
            <Badge className={cn("flex items-center gap-1", config.badgeClass)}>
              {config.icon}
              {config.badge}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{store.name}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-0 flex-1 flex flex-col">
          {item.description.trim() !== "" && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {item.description}
            </p>
          )}
          
          {/* Deadline Info */}
          <div className="mt-auto pt-2">
            <DeadlineInfo
              schoolStore={schoolStore}
              reservation={reservation}
              status={status}
            />
          </div>
        </CardContent>
      </Link>

      <CardFooter className="pt-3 pb-4">
        <AddToCartButton
          item={{ item, reservation, schoolStore }}
          isDisabled={status === "closed" || hasOrder}
          status={status}
        />
      </CardFooter>
    </Card>
  );
}

function DeadlineInfo({
  schoolStore,
  reservation,
  status,
}: {
  schoolStore: SchoolStore;
  reservation: Reservation | null;
  status: ItemStatus;
}) {
  if (status === "closed") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <XCircle className="w-4 h-4" />
        <span>Objednávanie ukončené</span>
      </div>
    );
  }

  const shiftedOrderClose = offsetDateToSk(new Date(schoolStore.orderClose));
  const shiftedReservationClose = offsetDateToSk(new Date(schoolStore.reservationClose));
  const shiftedNow = offsetDateToSk(new Date());

  if (status === "reservation") {
    const isToday = shiftedReservationClose.getDate() === shiftedNow.getDate();
    const timeLeft = shiftedReservationClose.getTime() - shiftedNow.getTime();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const isUrgent = hoursLeft < 2;

    return (
      <div className={cn(
        "flex items-center gap-2 text-sm",
        isUrgent ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
      )}>
        <Clock className="w-4 h-4" />
        <span>
          Rezervuj do{" "}
          <span className="font-semibold">
            {isToday
              ? shiftedReservationClose.toLocaleTimeString("sk-SK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : shiftedReservationClose.toLocaleDateString("sk-SK")}
          </span>
        </span>
      </div>
    );
  }

  // Available status
  const isToday = shiftedOrderClose.getDate() === shiftedNow.getDate();
  const timeLeft = shiftedOrderClose.getTime() - shiftedNow.getTime();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const isUrgent = hoursLeft < 2;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm",
      isUrgent ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
    )}>
      <Clock className="w-4 h-4" />
      <span>
        Objednaj do{" "}
        <span className="font-semibold">
          {isToday
            ? shiftedOrderClose.toLocaleTimeString("sk-SK", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : shiftedOrderClose.toLocaleDateString("sk-SK")}
        </span>
      </span>
    </div>
  );
}
