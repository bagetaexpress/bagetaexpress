import { Button } from "@/components/ui/button";
import UserDropdown from "@/app/auth/(customer)/_components/userDropdown";
import { ShoppingCart, User } from "lucide-react";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import { getOrdersByUserId } from "@/db/controllers/orderController";
import { orderItem } from "@/db/schema";

export default async function authLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user || !user.schoolId) {
    redirect("/");
  }

  const foundOrder = await getOrdersByUserId(user.id, "ordered");
  const hasOrder = foundOrder.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary text-primary-foreground p-2">
        <nav
          className="
          w-full h-fit flex flex-row items-center
          justify-between max-w-screen-lg mx-auto"
        >
          <div>
            <p className="text-xl font-semibold">bagetaExpress</p>
          </div>
          <div className="flex gap-1">
            <a href="/auth/store">
              <Button variant="ghost">Home</Button>
            </a>
            {!hasOrder && (
              <a href="/auth/cart">
                <Button variant="ghost" className="hidden sm:flex">
                  Shopping cart
                  <ShoppingCart className="ml-2 h-5 w-5" />
                </Button>
              </a>
            )}
            {hasOrder && (
              <a href="/auth/order">
                <Button variant="ghost" className="hidden sm:flex">
                  Order
                </Button>
              </a>
            )}
            <UserDropdown />
          </div>
        </nav>
      </div>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
