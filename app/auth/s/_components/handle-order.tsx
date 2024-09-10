import { Button } from "@/components/ui/button";
import { getItemsFromOrder } from "@/db/controllers/item-controller";
import { getOrderByPin } from "@/db/controllers/order-controller";
import { Order } from "@/db/schema";
import { getUser } from "@/lib/user-utils";
import ClientButton from "./client-button";

interface IProps {
  pin: string;
  confirmText: string;
  orderStatus?: Order["status"];
  confirmAction: () => void;
  cancelAction: () => void;
}

export default async function HandleOrder({
  pin,
  confirmText = "Confirm",
  orderStatus = "ordered",
  confirmAction,
  cancelAction,
}: IProps) {
  const currUser = await getUser();
  if (!currUser) return null;

  const order = await getOrderByPin(pin, currUser.schoolId, orderStatus);
  if (!order) {
    return (
      <div className="min-h-full flex justify-center items-center flex-col gap-2">
        <h1 className="text-2xl font-semibold">Objednávka nebola nájdená</h1>
        <a
          href={orderStatus === "ordered" ? "/auth/s/take" : "/auth/s/unblock"}
        >
          <Button>Vrátiť sa</Button>
        </a>
      </div>
    );
  }

  const items = await getItemsFromOrder(order.id);
  const total = items
    .reduce((acc, { item, quantity }) => acc + item.price * quantity, 0)
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
                  {quantity}x{item.price.toFixed(2)}€
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
        <ClientButton action={confirmAction} text={confirmText} />
        <form action={cancelAction}>
          <Button className="w-full" type="submit" variant="outline">
            Zrušiť
          </Button>
        </form>
      </div>
    </div>
  );
}
