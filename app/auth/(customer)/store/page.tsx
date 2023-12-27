import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ItemCard from "@/components/itemCard";
import { Button } from "@/components/ui/button";
import { getItemsBySchool } from "@/db/controllers/itemController";
import { ShoppingCart } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function Store() {
  const sesstion = await getServerSession(authOptions);
  if (!sesstion || !sesstion.user) {
    return null;
  }
  const items = await getItemsBySchool(sesstion.user.schoolId);
  return (
    <div className=" relative min-h-full">
      <h1 className="text-2xl font-semibold pt-2">Store</h1>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      <a
        href="/auth/cart"
        className=" absolute sm:hidden bottom-0 left-0 right-0"
      >
        <Button className="w-full m-1 justify-center">
          Shopping car
          <ShoppingCart className="ml-2 h-5 w-5" />
        </Button>
      </a>
    </div>
  );
}
