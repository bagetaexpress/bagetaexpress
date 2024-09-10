import Cheackout from "@/app/auth/c/cart/_components/checkout";
import { getFirstOrderClose } from "@/db/controllers/school-controller";
import { getCartId, getCartItems } from "@/lib/cart-utils";
import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import LocalCart from "./_components/local-cart";
import { getDate } from "@/lib/utils";

export default async function CartPage() {
  const cartId = await getCartId();
  const data = await getCartItems();

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

  const user = await getUser();
  if (!user || !user.schoolId) return;
  const orderClose = getDate(await getFirstOrderClose(user.schoolId));

  return (
    <div className="h-full flex flex-col justify-between md:justify-start">
      <LocalCart data={data} cartId={cartId} />
      <div className="flex justify-end">
        {orderClose > new Date() ? (
          <Cheackout orderClose={orderClose} items={data} cartId={cartId} />
        ) : (
          <p className="text-xl font-semibold text-red-500">
            Objednávky sú uzavreté
          </p>
        )}
      </div>
    </div>
  );
}
