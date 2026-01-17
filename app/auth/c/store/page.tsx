import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/user-utils";
import itemRepository from "@/repositories/item-repository";
import orderRepository from "@/repositories/order-repository";
import { Loader, ShoppingCart, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import StoreClient from "./_components/store-client";

export default function StorePage() {
  return (
    <div className="h-full relative flex flex-col">
      <Suspense
        fallback={
          <div className="flex flex-1 justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Načítavam ponuku...</p>
            </div>
          </div>
        }
      >
        <StorePageInner />
      </Suspense>
    </div>
  );
}

async function StorePageInner() {
  const user = await getUser();
  if (!user || !user.schoolId) {
    redirect("/");
  }

  const [hasOrder, items] = await Promise.all([
    orderRepository.getSingle({
      userId: user.id,
      status: ["ordered", "unpicked"],
    }),
    itemRepository.getMany({
      schoolId: user.schoolId,
      orderBy: "desc",
    }),
  ]);

  return (
    <>
      {/* Header Section */}
      <div className="mb-0">
        <h1 className="text-3xl font-bold tracking-tight">Ponuka</h1>
      </div>

      {/* Main Content */}
      <StoreClient items={items} hasOrder={!!hasOrder} />

      {/* Mobile Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-3 bg-transparent sm:hidden z-50"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        {!hasOrder ? (
          <Link prefetch={false} href="/auth/c/cart" className="block">
            <Button className="w-full h-12 text-base font-semibold shadow-lg border-foreground/10 border-2">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Nákupný košík
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link prefetch={false} href="/auth/c/order" className="block">
            <Button className="w-full h-12 text-base font-semibold shadow-lg border-foreground/10 border-2">
              Zobraziť objednávku
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="h-16 sm:hidden" />
    </>
  );
}
