import { Reservation, SchoolStore } from "@/db/schema";
import { getDate, getNewDate } from "@/lib/utils";
import allergenRepository from "@/repositories/allergen-repository";
import ingredientRepository from "@/repositories/ingredient-repository";
import itemRepository from "@/repositories/item-repository";
import Image from "next/image";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bageta.express | Detail bagety",
};

export default async function ItemDetailDialog(props: {
  params: Promise<{ itemId: string }>;
}) {
  const params = await props.params;
  if (
    isNaN(parseInt(params.itemId)) ||
    parseInt(params.itemId) < 0 ||
    !Number.isFinite(parseInt(params.itemId))
  ) {
    return <p>Invalid item ID</p>;
  }

  const found = await itemRepository.getSingle({ id: parseInt(params.itemId) });
  if (!found) {
    return <p>Item not found</p>;
  }
  const { item, store, reservation, schoolStore } = found;

  const [allergens, ingredients] = await Promise.all([
    allergenRepository.getMany({ storeId: store.id }),
    ingredientRepository.getMany({ itemId: item.id }),
  ]);

  return (
    <div className="flex flex-col gap-2">
      <Image
        src={item.imageUrl}
        width={800}
        height={800}
        alt="Obrázok produktu"
        className="rounded-md w-full mt-2"
      />
      <div>
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <h2 className="text-muted-foreground">{store.name}</h2>
      </div>
      <p>{item.description}</p>
      <div>
        <p>
          <span className="underline">Zloženie:</span>{" "}
          {ingredients.map((v) => v.name).join(", ")}
        </p>
        <p>
          <span className="underline">Alergény:</span>{" "}
          <span className="italic">
            {allergens.map((v) => v.name).join(", ")}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <OrderDate schoolStore={schoolStore} />
        <ReservationDate reservation={reservation} schoolStore={schoolStore} />
      </div>
    </div>
  );
}

function OrderDate({ schoolStore }: { schoolStore: SchoolStore }) {
  if (getDate(schoolStore.orderClose) < getNewDate()) {
    return (
      <p>
        <span className="font-semibold">Objenanie:</span>
        <br />
        Možnosť objednať vypršala
      </p>
    );
  }
  return (
    <p>
      <span className="font-semibold">Objenanie:</span>
      <br />
      Objednanie možné do:{" "}
      <span className="font-semibold text-nowrap">
        {getDate(schoolStore.orderClose).toLocaleString("sk-SK")}
      </span>
    </p>
  );
}

function ReservationDate({
  reservation,
  schoolStore,
}: {
  reservation: Reservation | null;
  schoolStore: SchoolStore;
}) {
  if (!reservation) {
    return null;
  }

  if (getDate(schoolStore.reservationClose) < getNewDate()) {
    return (
      <p>
        <span className="font-semibold">Rezervácia:</span>
        <br />
        Možnosť rezervovať vypršala
      </p>
    );
  }

  if (getDate(schoolStore.orderClose) < getNewDate()) {
    return (
      <p>
        <span className="font-semibold">Rezervácia:</span>
        <br />
        Rezervácia je možná do{" "}
        <span className="font-semibold text-nowrap">
          {getDate(schoolStore.reservationClose).toLocaleString("sk-SK")}
        </span>{" "}
        dostupných je {reservation.remaining} ks.
      </p>
    );
  }

  return (
    <p>
      Rezervácia je možná od{" "}
      <span className="font-semibold text-nowrap">
        {getDate(schoolStore.orderClose).toLocaleString("sk-SK")}
      </span>
      {" do "}
      <span className="font-semibold text-nowrap">
        {getDate(schoolStore.reservationClose).toLocaleString("sk-SK")}
      </span>
    </p>
  );
}
