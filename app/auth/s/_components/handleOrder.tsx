import { Button } from "@/components/ui/button";
import { getItemsFromOrder } from "@/db/controllers/itemController";
import {
  getOrderByPin,
  updateOrderStatus,
} from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";

interface IProps {
  pin: string;
  confirmText: string;
  confirmAction: () => void;
  cancelAction: () => void;
}

export default async function HandleOrder({
  pin,
  confirmText = "Confirm",
  confirmAction,
  cancelAction,
}: IProps) {
  const currUser = await getUser();
  if (!currUser) return null;

  const order = await getOrderByPin(pin, currUser.schoolId, "ordered");
  if (!order) {
    return (
      <div className="min-h-full flex justify-center items-center flex-col gap-2">
        <h1 className="text-2xl font-semibold">Objednávka nebola nájdená</h1>
        <a href="/auth/s/take">
          <Button>Vrátiť sa</Button>
        </a>
      </div>
    );
  }

  const items = await getItemsFromOrder(order.id);
  const total = items
    .reduce(
      (acc, { item, quantity }) => acc + parseFloat(item.price) * quantity,
      0
    )
    .toFixed(2);

  return (
    <div className=" min-h-full flex flex-col justify-between sm:justify-start">
      <div>
        <h1 className="text-2xl font-semibold pt-2">
          Č. objednávky:{order.pin}
        </h1>
        <div className="grid grid-cols-1 divide-y-2">
          {items.map(({ item, quantity }, i) => (
            <div key={i} className="flex justify-between p-1">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="font-light text-sm">{item.description}</p>
              </div>
              <div className="flex justify-center text-center gap-2 flex-col">
                <p className=" font-medium text-xl">
                  {quantity}x{parseFloat(item.price).toFixed(2)}€
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-4">
          <p className="font-semibold text-lg">Spolu</p>
          <p className="font-semibold text-xl">{total}€</p>
        </div>
      </div>
      <div className=" flex gap-2 justify-end flex-col sm:flex-row">
        <form action={confirmAction}>
          <Button className="w-full" type="submit">
            {confirmText}
          </Button>
        </form>
        <form action={cancelAction}>
          <Button className="w-full" type="submit" variant="outline">
            Zrušiť
          </Button>
        </form>
      </div>
    </div>
  );
}
