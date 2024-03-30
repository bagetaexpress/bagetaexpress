import CartItemRow from "@/app/auth/c/cart/_components/cartItemRow";
import Cheackout from "@/app/auth/c/cart/_components/checkout";
import { getFirstOrderClose } from "@/db/controllers/schoolController";
import { getCartId, getCartItems } from "@/lib/cartUtils";
import { getUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import LocalCart from "./_components/localCart";
import { getTotalOrderedItems } from "@/db/controllers/orderController";

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
  const orderClose = new Date(await getFirstOrderClose(user.schoolId));
  const totalOrders = await getTotalOrderedItems();

  return (
    <div className="h-full flex flex-col justify-between md:justify-start">
      <LocalCart data={data} cartId={cartId} totalOrdered={totalOrders} />
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
