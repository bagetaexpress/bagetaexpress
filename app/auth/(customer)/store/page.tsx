import ItemCard from "@/app/auth/(customer)/store/_components/itemCard";
import { Button } from "@/components/ui/button";
import { getItemsBySchool } from "@/db/controllers/itemController";
import { getOrdersByUserId } from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Store() {
  const user = await getUser();
  if (!user || !user.schoolId) {
    redirect("/");
  }

  const foundOrder = await getOrdersByUserId(user.id, "ordered");
  const hasOrder = foundOrder.length > 0;

  const items = await getItemsBySchool(user.schoolId);
  return (
    <div className=" relative min-h-full">
      <h1 className="text-2xl font-semibold pt-2">Store</h1>
      <div className="grid gap-1 mb-14 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} disabled={hasOrder} />
        ))}
      </div>
      {!hasOrder && (
        <a
          href="/auth/cart"
          className=" absolute sm:hidden bottom-0 left-0 right-0"
        >
          <Button className="w-full m-1 justify-center">
            Shopping car
            <ShoppingCart className="ml-2 h-5 w-5" />
          </Button>
        </a>
      )}
      {hasOrder && (
        <a
          href="/auth/order"
          className=" absolute sm:hidden bottom-0 left-0 right-0"
        >
          <Button className="w-full m-1 justify-center">Shor order</Button>
        </a>
      )}
    </div>
  );
}
