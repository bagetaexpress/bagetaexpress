import Cheackout from "@/app/auth/c/cart/_components/checkout";
import { getCartId, getCartItems } from "@/lib/cart-utils";
import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import LocalCart from "./_components/local-cart";

export default async function CartPage() {
  const user = await getUser();
  if (!user || !user.schoolId) return;

  const [cartId, data] = await Promise.all([getCartId(), getCartItems()]);

  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold">Košík</h1>
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
    <div className="h-full flex flex-col justify-between md:justify-start">
      <LocalCart data={data} cartId={cartId} />
      <div className="flex justify-end">
        <Cheackout items={data} cartId={cartId} />
      </div>
    </div>
  );
}
