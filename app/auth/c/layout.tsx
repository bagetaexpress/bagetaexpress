import { ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/userUtils";
import { getOrdersByUserId } from "@/db/controllers/orderController";
import NavButton from "@/components/nav/navButton";
import NavWrapper from "@/components/nav/navWrapper";

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
  const foundUnpicked = await getOrdersByUserId(user.id, "unpicked");
  const hasOrder = foundOrder.length > 0 || foundUnpicked.length > 0;

  return (
    <div style={{ minHeight: "100dvh" }} className="flex flex-col">
      <NavWrapper>
        <NavButton href="/auth/c/store" text="Domov" />
        {!hasOrder && (
          <NavButton
            href="/auth/c/cart"
            text="Košík"
            Icon={ShoppingCart}
            className="hidden sm:flex"
          />
        )}
        {hasOrder && (
          <NavButton
            href="/auth/c/order"
            text="Objednávka"
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
