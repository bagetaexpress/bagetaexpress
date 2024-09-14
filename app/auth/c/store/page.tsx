import ItemCard from "@/app/auth/c/store/_components/itemCard";
import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/db/controllers/item-controller";
import { hasActiveOrder } from "@/db/controllers/order-controller";
import { getUser } from "@/lib/user-utils";
import { getDate } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Store() {
  const user = await getUser();
  if (!user || !user.schoolId) {
    redirect("/");
  }

  const [hasOrder, items] = await Promise.all([
    hasActiveOrder(user.id),
    fetch(
      `${process.env.NEXTAUTH_URL}/api/client/items?schoolID=${user.schoolId}`,
      {
        next: {
          tags: ["items"],
        },
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        throw new Error("Failed to fetch items");
      }) as Promise<ExtendedItem[]>,
  ]);

  return (
    <div className="h-full relative">
      <h1 className="text-2xl font-semibold pt-2">Obchod</h1>
      <div className="grid gap-1 mb-14 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {items
          .sort((a) => {
            if (getDate(a.schoolStore.orderClose) >= new Date()) {
              return -1;
            }
            if (
              a.reservation &&
              (getDate(a.schoolStore.reservationClose) >= new Date() ||
                a.reservation.remaining > 0)
            ) {
              return -1;
            }
            return 0;
          })
          .map((item) => (
            <ItemCard key={item.item.id} item={item} hasOrder={hasOrder} />
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
          <a
            href="/auth/c/cart"
            className="m-2"
            style={{ pointerEvents: "all" }}
          >
            <Button className="w-full">
              Nákupný košík
              <ShoppingCart className="ml-2 h-5 w-5" />
            </Button>
          </a>
        )}
        {hasOrder && (
          <a
            href="/auth/c/order"
            className="m-2"
            style={{ pointerEvents: "all" }}
          >
            <Button className="w-full">Zobraziť objednávku</Button>
          </a>
        )}
      </div>
    </div>
  );
}
