import Cheackout from "@/app/auth/c/cart/_components/checkout";
import { getCartId, getCartItems } from "@/lib/cart-utils";
import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import LocalCart from "./_components/local-cart";
import { Suspense } from "react";
import { Loader } from "lucide-react";

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

  const [cartId, data] = await Promise.all([getCartId(), getCartItems()]);

  if (data.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-xl">Tvoj kosík je prázdny</p>
        <form
          action={async () => {
            "use server";
            redirect("/auth/c/store");
          }}
        ></form>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between md:justify-start">
      <div>
        <LocalCart data={data} cartId={cartId} />
      </div>
      <div className="flex justify-end">
        <Cheackout items={data} cartId={cartId} />
      </div>
    </div>
  );
}
