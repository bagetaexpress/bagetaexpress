import { ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/userUtils";
import { getOrdersByUserId } from "@/db/controllers/orderController";
import NavWrapper from "@/components/nav/navWrapper";
import NavButton from "@/components/nav/navButton";

export default async function authLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user || !user.isCustomer) {
    redirect("/");
  }

  const foundOrder = await getOrdersByUserId(user.id, "ordered");
  const hasOrder = foundOrder.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <NavWrapper>
        <NavButton href="/auth/c/store" text="Home" />
        {!hasOrder && (
          <NavButton
            href="/auth/c/cart"
            text="Shopping cart"
            Icon={ShoppingCart}
            className="hidden sm:flex"
          />
        )}
        {hasOrder && (
          <NavButton
            href="/auth/c/order"
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
