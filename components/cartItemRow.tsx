import { Item } from "@/db/controllers/itemController";
import { updateOrderItemQuantity } from "@/db/controllers/orderItemController";
import { Button } from "./ui/button";
import { revalidatePath } from "next/cache";
import { Minus, Plus } from "lucide-react";

export default function CartItemRow({
  quantity,
  cartId,
  ...item
}: Item & { quantity: number; cartId: number }) {
  async function handleDescrease() {
    "use server";
    if (quantity === 1) {
      return;
    }
    await updateOrderItemQuantity(cartId, item.id, quantity - 1);
    revalidatePath("/auth/cart");
  }

  async function handleIncrease() {
    "use server";
    await updateOrderItemQuantity(cartId, item.id, quantity + 1);
    revalidatePath("/auth/cart");
  }

  return (
    <div className="flex justify-between p-2 items-center">
      <div>
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="font-light text-sm">{item.description}</p>
      </div>
      <div className="flex justify-center text-center gap-2 flex-col">
        <p className=" font-bold text-xl">
          {(parseFloat(item.price) * quantity).toFixed(2)}€
        </p>
        <div className="flex items-center">
          <form action={handleDescrease}>
            <button type="submit" className=" bg-green-500 rounded-md p-1">
              <Minus className="w-5 h-5 text-white" />
            </button>
          </form>
          <p className="text-xl px-2">{quantity}</p>
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
