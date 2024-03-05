import ItemCard from "@/app/auth/c/store/_components/itemCard";
import { Button } from "@/components/ui/button";
import {
  ExtendedItem,
  getItemsBySchool,
} from "@/db/controllers/itemController";
import { getOrdersByUserId } from "@/db/controllers/orderController";
import { getFirstOrderClose } from "@/db/controllers/schoolController";
import { getUser } from "@/lib/userUtils";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Store() {
  const user = await getUser();
  if (!user || !user.schoolId) {
    redirect("/");
  }

  const foundOrder = await getOrdersByUserId(user.id, "ordered");
  const foundUnpicked = await getOrdersByUserId(user.id, "unpicked");
  const hasOrder = foundOrder.length > 0 || foundUnpicked.length > 0;

  const items = (await fetch(
    `${process.env.NEXTAUTH_URL}/api/client/items?schoolID=${user.schoolId}`,
    {
      next: {
        revalidate: 3600,
        tags: ["items"],
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      throw new Error("Failed to fetch items");
    })) as ExtendedItem[];

  const orderClose = await getFirstOrderClose(user.schoolId);
  return (
    <div className="h-full relative">
      <h1 className="text-2xl font-semibold pt-2">Obchod</h1>
      {orderClose > new Date() ? (
        <div className="text-sm text-gray-500 mb-4">
          Objednávky sa uzatvárajú:{" "}
          <span className="font-semibold text-primary-foreground">
            {orderClose.toLocaleString("sk-SK")}
          </span>
        </div>
      ) : (
        <div className="text-sm text-gray-500 mb-4">
          Objednávky sú uzatvorené
        </div>
      )}
      <div className="grid gap-1 mb-14 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {items.map((item) => (
          <ItemCard
            key={item.item.id}
            item={item}
            orderClose={orderClose}
            disabled={hasOrder || orderClose <= new Date()}
          />
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
