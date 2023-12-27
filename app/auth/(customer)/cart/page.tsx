import CartItemRow from "@/components/cartItemRow";
import getCartId from "@/lib/cart/getCartId";
import getCartItems from "@/lib/cart/getCartItems";

export default async function CartPage() {
  const orderId = await getCartId();
  const data = await getCartItems();

  return (
    <div>
      <h1 className="text-2xl font-semibold pt-2">Cart</h1>
      <div className="grid grid-cols-1 divide-y-2">
        {data.map((item, i) => (
          <CartItemRow
            key={item.item.id}
            {...item.item}
            quantity={item.quantity}
            cartId={orderId}
          />
        ))}
      </div>
    </div>
  );
}
