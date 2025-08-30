import { getUser } from "@/lib/user-utils";
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
import { deleteOrderAndItems } from "@/lib/order-utils";
import { Order } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import orderRepository from "@/repositories/order-repository";
import itemRepository from "@/repositories/item-repository";

export default function OrderPage() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-semibold py-2">Objednávka</h1>
      <Suspense
        fallback={
          <div className="flex flex-1 justify-center items-center">
            <Loader className="h-10 w-10 animate-spin" />
          </div>
        }
      >
        <OrderPageInner />
      </Suspense>
    </div>
  );
}

async function OrderPageInner() {
  const user = await getUser();
  if (!user) return null;

  const order = await orderRepository.getSingle({
    userId: user.id,
    status: ["ordered", "unpicked"],
  });
  if (!order) return null;

  const [items, orderClose] = await Promise.all([
    itemRepository.getManyWithQuantity({
      orderId: order.id,
      orderStatus: ["ordered", "unpicked"],
    }),
    orderRepository.getFirstClose(order.id),
  ]);

  const total = items
    .reduce((acc, { item, quantity }) => acc + item.price * quantity, 0)
    .toFixed(2);

  return (
    <>
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
        {items.map(({ item, quantity }) => (
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
      <div className="flex justify-between py-4">
        <p className="font-semibold text-lg">Spolu</p>
        <p className="font-semibold text-xl">{total}€</p>
      </div>
      {order.status === "unpicked" && (
        <p className="text-center font-semibold text-lg text-destructive">
          Objednávka je nevyzdvihnutá, prosím, dostavte sa k školskému
          predajcovi
        </p>
      )}
      <div className="flex justify-end">
        {order.status === "ordered" && new Date(orderClose) > new Date() && (
          <DeleteOrder orderId={order.id} />
        )}
      </div>
    </>
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
              const orderClose = await orderRepository.getFirstClose(orderId);
              if (new Date(orderClose) > new Date()) {
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
