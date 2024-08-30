import { getItemsFromOrder } from "@/db/controllers/itemController";
import {
  getFirstOrderItemClose,
  getOrdersByUserId,
} from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";
import QrCode from "./_components/qrCode";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteOrderAndItems } from "@/lib/orderUtils";
import { Order } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Separator } from "@/components/ui/separator";
import { getNewDate } from "@/lib/utils";

export default async function OrderPage() {
  const currUser = await getUser();
  if (!currUser) return null;

  const foundOrders = await getOrdersByUserId(currUser.id, "ordered");
  const foundUnpicked = await getOrdersByUserId(currUser.id, "unpicked");

  const order = foundOrders[0] ?? foundUnpicked[0];
  const orderClose = await getFirstOrderItemClose(order.id);

  const items = await getItemsFromOrder(order.id);
<<<<<<< Updated upstream
  const total = items.reduce(
    (acc, { item, quantity }) => acc + item.price * quantity,
    0
  );
=======
  const total = items
    .reduce(
      (acc, { item, quantity }) => acc + parseFloat(item.price) * quantity,
      0,
    )
    .toFixed(2);
>>>>>>> Stashed changes

  return (
    <div>
      <h1 className="text-2xl font-semibold py-2">Objednávka</h1>
      <div className="flex justify-center">
        <QrCode
          pin={order.pin}
          className=" flex-1 max-h-80 max-w-screen-sm aspect-square"
        />
      </div>
      <h3 className="pb-3 text-center font-bold text-lg">
        Číslo objednávky: {order.pin}
      </h3>
      <div className="grid grid-cols-1 divide-y-2">
        {items.map(({ item, quantity }, i) => (
          <div key={item.id} className="flex justify-between p-1">
            <div className="flex gap-1">
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
              <p className=" font-medium text-xl">
                {quantity}x{item.price.toFixed(2)}€
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-3">
        <p className="font-semibold text-lg">Spolu</p>
        <p className="font-semibold text-xl">{total.toFixed(2)}€</p>
      </div>
      {order.discount > 0 && (
        <>
          <Separator />
          <div className="flex justify-between py-3">
            <p className="font-semibold text-lg">Zľava</p>
            <p className="font-semibold text-xl">
              {order.discount.toFixed(2)}€
            </p>
          </div>
          <Separator />
          <div className="flex justify-between py-3">
            <p className="font-semibold text-lg">Celkom</p>
            <p className="font-semibold text-xl">
              {(total - order.discount).toFixed(2)}€
            </p>
          </div>
        </>
      )}
      {foundUnpicked.length > 0 && (
        <p className="text-center font-semibold text-lg text-destructive">
          Objednávka je nevyzdvihnutá, prosím, dostavte sa k školskému
          predajcovi
        </p>
      )}
      <div className="flex justify-end">
        {foundOrders.length > 0 && orderClose > getNewDate() && (
          <DeleteOrder orderId={order.id} />
        )}
      </div>
    </div>
  );
}

interface DeleteOrderProps {
  orderId: Order["id"];
}

async function DeleteOrder({ orderId }: DeleteOrderProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Zrušiť objednávku</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Určite chcete zmazať objednávku?</AlertDialogTitle>
          <AlertDialogDescription>
            Táto akcia je nevratná.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Vrátiť sa</AlertDialogCancel>
          <form
            action={async () => {
              "use server";
              const orderClose = await getFirstOrderItemClose(orderId);
              if (orderClose > getNewDate()) {
                await deleteOrderAndItems(orderId);
              }
              revalidatePath("/auth/c/order");
            }}
            className=" flex flex-1 sm:grow-0"
          >
            <AlertDialogAction asChild>
              <Button variant="destructive" className="flex-1" type="submit">
                Zrušiť objednávku
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
