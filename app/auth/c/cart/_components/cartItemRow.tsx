"use client";

import { Item } from "@/db/controllers/itemController";
import { saveUpdateCartItem } from "@/lib/cartUtils";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useOptimistic } from "react";

export default function CartItemRow({
  quantity,
  cartId,
  ...item
}: Item & { quantity: number; cartId: number }) {
  const [q, updateQ] = useOptimistic<number, number>(
    quantity,
    (_, updated) => updated
  );

  async function handleDescrease() {
    updateQ(q - 1);
    await saveUpdateCartItem(cartId, item.id, q - 1);
  }

  async function handleIncrease() {
    updateQ(q + 1);
    await saveUpdateCartItem(cartId, item.id, q + 1);
  }

  if (q <= 0 || quantity <= 0) {
    return null;
  }

  return (
    <div className="flex justify-between p-2 items-center">
      <div className="flex gap-1 items-center">
        <Image
          src={item.imageUrl}
          width={150}
          height={150}
          alt="Obrázok produktu"
          className="rounded-md max-w-24 object-contain"
        />
        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="font-light text-sm">{item.description}</p>
        </div>
      </div>
      <div className="flex justify-center text-center gap-2 flex-col">
        <p className=" font-bold text-xl">
          {/* {(parseFloat(item.price) * q).toFixed(2)}€ */}
          {item.price} €
        </p>
        <div className="flex items-center">
          <form action={handleDescrease}>
            <button type="submit" className=" bg-green-500 rounded-md p-1">
              <Minus className="w-5 h-5 text-white" />
            </button>
          </form>
          <p className="text-xl px-2">{q}</p>
          <form action={handleIncrease}>
            <button type="submit" className=" bg-red-500 rounded-md p-1">
              <Plus className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
