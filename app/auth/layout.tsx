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
import NavWrapper from "@/components/nav/navWrapper";
import NavButton from "@/components/nav/navButton";

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
      <NavWrapper>
        <NavButton href="/auth/store" text="Home" />
        {!hasOrder && (
          <NavButton
            href="/auth/cart"
            text="Shopping cart"
            Icon={ShoppingCart}
            className="hidden sm:flex"
          />
        )}
        {hasOrder && (
          <NavButton
            href="/auth/order"
            text="Order"
            className="hidden sm:flex"
          />
        )}
      </NavWrapper>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
