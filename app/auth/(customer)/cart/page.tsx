import CartItemRow from "@/components/cartItemRow";
import Cheackout from "@/components/checkout";
import { getCartId, getCartItems } from "@/lib/cartUtils";

export default async function CartPage() {
  const orderId = await getCartId();
  const data = await getCartItems();

  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-xl">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between md:justify-start">
      <div>
        <h1 className="text-2xl font-semibold pt-2">Cart</h1>
        <div className="grid grid-cols-1 divide-y-2">
          {data.map((item, i) => (
            <CartItemRow
              key={item.item.id + "-" + i}
              {...item.item}
              quantity={item.quantity}
              cartId={orderId}
            />
          ))}
        </div>
        <div className="flex justify-between py-4">
          <p className="font-semibold text-lg">Total</p>
          <p className="font-semibold text-xl">
            {data
              .reduce(
                (acc, item) =>
                  acc + parseFloat(item.item.price) * item.quantity,
                0
              )
              .toFixed(2)}
            €
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Cheackout items={data} orderId={orderId} />
      </div>
    </div>
  );
}
