import ItemCard from "@/app/auth/c/store/_components/itemCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/user-utils";
import { getDate, getNewDate } from "@/lib/utils";
import itemRepository from "@/repositories/item-repository";
import orderRepository from "@/repositories/order-repository";
import { Loader, ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function StorePage() {
  return (
    <div className="h-full relative flex flex-col">
      <h1 className="text-2xl font-semibold pt-2">Obchod</h1>
      <Suspense
        fallback={
          <div className="flex flex-1 justify-center items-center">
            <Loader className="h-10 w-10 animate-spin" />
          </div>
        }
      >
        <StorePageInner />
      </Suspense>
    </div>
  );
}

async function StorePageInner() {
  const user = await getUser();
  if (!user || !user.schoolId) {
    redirect("/");
  }

  const [hasOrder, items] = await Promise.all([
    orderRepository.getSingle({
      userId: user.id,
      status: ["ordered", "unpicked"],
    }),
    itemRepository.getMany({
      schoolId: user.schoolId,
      orderBy: "desc",
    }),
  ]);

  return (
    <>
      <div className="grid gap-1 mb-14 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {items
          .sort((a, b) => {
            if (
              getDate(a.schoolStore.orderClose) >= getNewDate() &&
              getDate(b.schoolStore.orderClose) < getNewDate()
            ) {
              return -1;
            }
            if (
              a.reservation &&
              (getDate(a.schoolStore.reservationClose) >= getNewDate() ||
                a.reservation.remaining > 0) &&
              (!b.reservation ||
                (getDate(b.schoolStore.reservationClose) < getNewDate() &&
                  b.reservation.remaining <= 0))
            ) {
              return -1;
            }
            return 0;
          })
          .map((item) => (
            <ItemCard key={item.item.id} item={item} hasOrder={!!hasOrder} />
          ))}
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "100dvh",
          pointerEvents: "none",
        }}
        className="flex flex-col justify-end sm:hidden"
      >
        {!hasOrder && (
          <Link
            prefetch={false}
            href="/auth/c/cart"
            className="m-2"
            style={{ pointerEvents: "all" }}
          >
            <Button className="w-full">
              Nákupný košík
              <ShoppingCart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}
        {hasOrder && (
          <Link
            prefetch={false}
            href="/auth/c/order"
            className="m-2"
            style={{ pointerEvents: "all" }}
          >
            <Button className="w-full">Zobraziť objednávku</Button>
          </Link>
        )}
      </div>
    </>
  );
}
