import { ReactNode, Suspense } from "react";
import { Loader, ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/user-utils";
import NavButton from "@/components/nav/nav-button";
import NavWrapper from "@/components/nav/nav-wrapper";
import { Button } from "@/components/ui/button";
import orderRepository from "@/repositories/order-repository";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bageta.express | Domovská stránka",
};

export default async function authLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user || !user.isCustomer) {
    redirect("/");
  }

  return (
    <div style={{ minHeight: "100dvh" }} className="flex flex-col">
      <NavWrapper>
        <NavButton href="/auth/c/store" text="Obchod" />
        <Suspense
          fallback={
            <Button variant="ghost" className="opacity-50" disabled>
              <Loader className="w-5 h-5 animate-spin" />
            </Button>
          }
        >
          <NavButtons />
        </Suspense>
      </NavWrapper>
      <div className="p-2 flex-1 flex">
        <main className="max-w-screen-lg mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}

async function NavButtons() {
  const user = await getUser();
  if (!user || !user.isCustomer) {
    return null;
  }

  const hasOrder = await orderRepository.getSingle({
    userId: user.id,
    status: ["ordered", "unpicked"],
  });

  return (
    <>
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
    </>
  );
}
