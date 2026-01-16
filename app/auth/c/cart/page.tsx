import Cheackout from "@/app/auth/c/cart/_components/checkout";
import { getCart, getCartItems } from "@/lib/cart-utils";
import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import LocalCart from "./_components/local-cart";
import { Suspense } from "react";
import { Loader, ShoppingBag, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "bageta.express | Nákupný košík",
};

export default function CartPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <Link
          href="/auth/c/store"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Späť do ponuky
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Nákupný košík</h1>
        <p className="text-muted-foreground mt-1">
          Skontroluj položky pred odoslaním objednávky
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-1 justify-center items-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Načítavam košík...</p>
            </div>
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
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-5">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Tvoj košík je prázdny</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Začni tým, že si vyberieš z ponuky a pridáš položky do košíka.
        </p>
        <form
          action={async () => {
            "use server";
            redirect("/auth/c/store");
          }}
        >
          <Button type="submit" size="lg" className="font-semibold">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Prejsť do ponuky
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between md:justify-start pb-24 md:pb-0">
      <div>
        <LocalCart data={data} cartId={cart.userId} />
      </div>
      <div className="hidden md:flex justify-end">
        <Cheackout items={data} cartId={cart.userId} />
      </div>
    </div>
  );
}
