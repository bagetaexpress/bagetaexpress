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
import {
  Loader,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ShoppingBag,
  QrCode as QrCodeIcon,
} from "lucide-react";
import orderRepository from "@/repositories/order-repository";
import itemRepository from "@/repositories/item-repository";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OrderPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <Link
          href="/auth/c/store"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Späť do ponuky
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Tvoja objednávka</h1>
        <p className="text-muted-foreground mt-1">
          Ukáž QR kód predajcovi pri vyzdvihnutí
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-1 justify-center items-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Načítavam objednávku...
              </p>
            </div>
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

  const total = items.reduce(
    (acc, { item, quantity }) => acc + item.price * quantity,
    0
  );
  const totalItems = items.reduce((acc, { quantity }) => acc + quantity, 0);

  const isUnpicked = order.status === "unpicked";
  const canCancel = order.status === "ordered" && new Date(orderClose) > new Date();

  return (
    <div className="flex flex-col gap-6">
      {/* Status Banner */}
      {isUnpicked && (
        <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  Objednávka čaká na vyzdvihnutie
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-0.5">
                  Prosím, dostavte sa k školskému predajcovi
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code Section */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-2">
              <QrCode
                pin={order.pin}
                className="w-48 h-48 sm:w-56 sm:h-56"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Klikni pre zväčšenie
            </p>

            {/* Order Number */}
            <div className="flex items-center gap-2 mb-2">
              <QrCodeIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Číslo objednávky
              </span>
            </div>
            <p className="text-3xl font-bold tracking-wider">{order.pin}</p>

            {/* Status Badge */}
            <Badge
              className={cn(
                "mt-3",
                isUnpicked
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0"
                  : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-0"
              )}
            >
              {isUnpicked ? (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Čaká na vyzdvihnutie
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Objednávka potvrdená
                </>
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Položky objednávky</h2>
        </div>

        <Card className="border-border/50 overflow-hidden">
          <div className="divide-y divide-border/50">
            {items.map(({ item, quantity }) => (
              <div key={item.id} className="flex gap-4 p-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  {item.imageUrl != null && item.imageUrl != "" ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={item.imageUrl}
                        fill
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary/30">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-medium leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {quantity}x {item.price.toFixed(2)}€
                    </p>
                  </div>
                  <p className="font-semibold text-lg flex-shrink-0">
                    {(item.price * quantity).toFixed(2)}€
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-4 py-4 bg-muted/30 border-t border-border/50">
            <div>
              <p className="text-sm text-muted-foreground">Celkom</p>
              <p className="text-2xl font-bold">{total.toFixed(2)}€</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {totalItems}{" "}
                {totalItems === 1
                  ? "položka"
                  : totalItems < 5
                  ? "položky"
                  : "položiek"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cancel Order */}
      {canCancel && (
        <div className="pt-2">
          <DeleteOrder orderId={order.id} />
        </div>
      )}
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
        <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4 mr-2" />
          Zrušiť objednávku
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <AlertDialogTitle className="text-center">
            Zrušiť objednávku?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Táto akcia je nevratná. Objednávka bude trvalo zmazaná.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-col sm:space-x-0 gap-2">
          <form
            action={async () => {
              "use server";
              const orderClose = await orderRepository.getFirstClose(orderId);
              if (new Date(orderClose) > new Date()) {
                await deleteOrderAndItems(orderId);
              }
              revalidatePath("/auth/c/order");
            }}
            className="flex flex-1"
          >
            <AlertDialogAction asChild>
              <Button variant="destructive" className="flex-1" type="submit">
                <Trash2 className="w-4 h-4 mr-2" />
                Áno, zrušiť objednávku
              </Button>
            </AlertDialogAction>
          </form>
          <AlertDialogCancel className="mt-0">Ponechať objednávku</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
