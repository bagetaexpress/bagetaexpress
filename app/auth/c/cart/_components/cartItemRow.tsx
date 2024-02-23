"use client";

import { Item } from "@/db/schema";
import { saveUpdateCartItem } from "@/lib/cartUtils";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useOptimistic } from "react";

export default function CartItemRow({
  quantity,
  cartId,
  addItem,
  removeItem,
  ...item
}: Item & {
  quantity: number;
  cartId: string;
  addItem: () => void;
  removeItem: () => void;
}) {
  async function handleDescrease() {
    removeItem();
    await saveUpdateCartItem(cartId, item.id, quantity - 1);
  }

  async function handleIncrease() {
    addItem();
    await saveUpdateCartItem(cartId, item.id, quantity + 1);
  }

  if (quantity <= 0) {
    return null;
  }

  return (
    <div className="flex justify-between p-2 items-center">
      <div className="flex gap-1 items-center">
        {item.imageUrl != null && item.imageUrl != "" ? (
          <Image
            src={item.imageUrl}
            width={150}
            height={150}
            alt="Obrázok produktu"
            className="rounded-md max-w-24 object-contain"
          />
        ) : null}
        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="font-light text-sm">{item.description}</p>
        </div>
      </div>
      <div className="flex justify-center text-center gap-2 flex-col">
        <p className=" font-bold text-xl">{item.price} €</p>
        <div className="flex items-center">
          <button
            onClick={handleDescrease}
            type="submit"
            className=" bg-destructive aspect-square rounded-md p-1"
          >
            {quantity === 1 ? (
              <Trash className="w-5 h-5 text-white" />
            ) : (
              <Minus className="w-5 h-5 text-white" />
            )}
          </button>
          <p className="text-xl px-2">{quantity}</p>
          <button
            type="submit"
            onClick={handleIncrease}
            disabled={quantity >= 5}
            className={cn(
              "rounded-md p-1 aspect-square",
              quantity >= 5 ? "bg-gray-500" : "bg-green-500"
            )}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
