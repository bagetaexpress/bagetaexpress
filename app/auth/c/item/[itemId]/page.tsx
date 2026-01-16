import { Reservation, SchoolStore } from "@/db/schema";
import allergenRepository from "@/repositories/allergen-repository";
import ingredientRepository from "@/repositories/ingredient-repository";
import itemRepository from "@/repositories/item-repository";
import Image from "next/image";
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  CalendarClock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  AlertTriangle,
  Loader,
  Wheat,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "bageta.express | Detail bagety",
};

export default function ItemDetailPage(props: {
  params: Promise<{ itemId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-3">Načítavam...</p>
        </div>
      }
    >
      <ItemDetailContent params={props.params} />
    </Suspense>
  );
}

async function ItemDetailContent({
  params: paramsPromise,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const params = await paramsPromise;

  if (
    isNaN(parseInt(params.itemId)) ||
    parseInt(params.itemId) < 0 ||
    !Number.isFinite(parseInt(params.itemId))
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Neplatné ID produktu</h1>
        <p className="text-muted-foreground mb-4">
          Produkt s týmto ID neexistuje
        </p>
        <Link href="/auth/c/store">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Späť do obchodu
          </Button>
        </Link>
      </div>
    );
  }

  const found = await itemRepository.getSingle({ id: parseInt(params.itemId) });
  if (!found) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Produkt nenájdený</h1>
        <p className="text-muted-foreground mb-4">
          Tento produkt už nie je dostupný
        </p>
        <Link href="/auth/c/store">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Späť do obchodu
          </Button>
        </Link>
      </div>
    );
  }

  const { item, store, reservation, schoolStore } = found;

  const [allergens, ingredients] = await Promise.all([
    allergenRepository.getMany({ storeId: store.id }),
    ingredientRepository.getMany({ itemId: item.id }),
  ]);

  // Calculate status
  const orderClosed = new Date(schoolStore.orderClose) < new Date();
  const reservationClosed = new Date(schoolStore.reservationClose) < new Date();
  let status: "available" | "reservation" | "closed";
  if (!orderClosed) {
    status = "available";
  } else if (reservation && !reservationClosed) {
    status = "reservation";
  } else {
    status = "closed";
  }

  const statusConfig = {
    available: {
      badge: "Dostupné na objednanie",
      badgeClass: "bg-green-500/90 text-white border-0",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    reservation: {
      badge: "K dispozícii len na rezerváciu",
      badgeClass: "bg-amber-500/90 text-white border-0",
      icon: <CalendarClock className="w-4 h-4" />,
    },
    closed: {
      badge: "Nedostupné",
      badgeClass: "bg-muted text-muted-foreground border-0",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Back Button */}
      <Link
        href="/auth/c/store"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors -mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Späť do ponuky
      </Link>

      {/* Hero Image */}
      {item.imageUrl && item.imageUrl !== "" && (
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={item.imageUrl}
            width={800}
            height={600}
            alt={item.name}
            className="w-full aspect-video object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Status Badge on Image */}
          <div className="absolute top-4 right-4">
            <Badge className={cn("flex items-center gap-1.5 text-sm px-3 py-1.5", config.badgeClass)}>
              {config.icon}
              {config.badge}
            </Badge>
          </div>

          {/* Price Badge on Image */}
          <div className="absolute bottom-4 left-4">
            <Badge className="text-2xl font-bold px-4 py-2 bg-background/95 text-foreground backdrop-blur-sm border-0 shadow-lg">
              {item.price.toFixed(2)}€
            </Badge>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {/* Title & Store */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
          <p className="text-lg text-muted-foreground mt-1">{store.name}</p>
        </div>

        {/* Description */}
        {item.description && item.description.trim() !== "" && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Ingredients & Allergens */}
        <div className="grid gap-4 sm:grid-cols-2">
          {ingredients.length > 0 && (
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wheat className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Zloženie</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ingredients.map((v) => v.name).join(", ")}
                </p>
              </CardContent>
            </Card>
          )}

          {allergens.length > 0 && (
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold">Alergény</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allergens.map((allergen) => (
                    <Badge
                      key={allergen.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {allergen.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order/Reservation Deadlines */}
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Termíny</h3>
            </div>
            <div className="space-y-4">
              <OrderDateDetail schoolStore={schoolStore} />
              <ReservationDateDetail
                reservation={reservation}
                schoolStore={schoolStore}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrderDateDetail({ schoolStore }: { schoolStore: SchoolStore }) {
  const orderClose = new Date(schoolStore.orderClose);
  const isExpired = orderClose < new Date();

  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isExpired
            ? "bg-muted text-muted-foreground"
            : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        )}
      >
        {isExpired ? (
          <XCircle className="w-4 h-4" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
      </div>
      <div>
        <p className="font-medium">Objednanie</p>
        {isExpired ? (
          <p className="text-sm text-muted-foreground">
            Možnosť objednať vypršala
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Objednanie možné do{" "}
            <span className="font-semibold text-foreground">
              {orderClose.toLocaleString("sk-SK")}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function ReservationDateDetail({
  reservation,
  schoolStore,
}: {
  reservation: Reservation | null;
  schoolStore: SchoolStore;
}) {
  if (!reservation) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <XCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">Rezervácia</p>
          <p className="text-sm text-muted-foreground">
            Tento produkt nie je možné rezervovať
          </p>
        </div>
      </div>
    );
  }

  const reservationClose = new Date(schoolStore.reservationClose);
  const orderClose = new Date(schoolStore.orderClose);
  const now = new Date();
  const isExpired = reservationClose < now;
  const isActive = orderClose < now && !isExpired;

  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isExpired
            ? "bg-muted text-muted-foreground"
            : isActive
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            : "bg-muted/50 text-muted-foreground"
        )}
      >
        {isExpired ? (
          <XCircle className="w-4 h-4" />
        ) : (
          <CalendarClock className="w-4 h-4" />
        )}
      </div>
      <div>
        <p className="font-medium">Rezervácia</p>
        {isExpired ? (
          <p className="text-sm text-muted-foreground">
            Možnosť rezervovať vypršala
          </p>
        ) : isActive ? (
          <p className="text-sm text-muted-foreground">
            Rezervácia možná do{" "}
            <span className="font-semibold text-foreground">
              {reservationClose.toLocaleString("sk-SK")}
            </span>
            {" • "}
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {reservation.remaining} ks dostupných
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Rezervácia bude možná od{" "}
            <span className="font-semibold text-foreground">
              {orderClose.toLocaleString("sk-SK")}
            </span>
            {" do "}
            <span className="font-semibold text-foreground">
              {reservationClose.toLocaleString("sk-SK")}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
