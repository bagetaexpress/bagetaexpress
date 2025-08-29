import Cheackout from "@/app/auth/c/cart/_components/checkout";
import { getCart, getCartItems } from "@/lib/cart-utils";
import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import LocalCart from "./_components/local-cart";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "bageta.express | Nákupný košík",
};

export default function CartPage() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-semibold pt-2">Košík</h1>
      <Suspense
        fallback={
          <div className="flex flex-1 justify-center items-center">
            <Loader className="h-10 w-10 animate-spin" />
          </div>
        }
      >
        <CartPageInner />
      </Suspense>
    </div>
  );
}

async function CartPageInner() {
  const user = await getUser();
  if (!user || !user.schoolId) return;

  const [cart, data] = await Promise.all([getCart(), getCartItems()]);

  if (data.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <p className="text-xl font-semibold mb-2">Tvoj košík je prázdny</p>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Začni tým, že si vyberieš z ponuky a pridáš položky do košíka.
        </p>
        <form
          action={async () => {
            "use server";
            redirect("/auth/c/store");
          }}
        >
          <Button type="submit">Prejsť do ponuky</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between md:justify-start pb-20 md:pb-0">
      <div>
        <LocalCart data={data} cartId={cart.userId} />
      </div>
      <div className="hidden md:flex justify-end">
        <Cheackout items={data} cartId={cart.userId} />
      </div>
    </div>
  );
}
